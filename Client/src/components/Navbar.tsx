import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/authStore";

// This list is modified dynamically in the render but I will keep base links here
const baseLinks = [{ href: "/", label: "Events" }];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo - Theme aware */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src={resolvedTheme === "dark" ? logoDark : logoLight}
            alt="Pulse Booking"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {baseLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          <ThemeToggle />

          {/* Logic: Authenticated vs Guest View */}
          {user ? (
            <>
              {/* Logged In View */}
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Hi, {user.name}
              </span>

              <Link to="/my-bookings">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  My Bookings
                </Button>
              </Link>

              {user.role === "admin" && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-blue-500/30 text-blue-500"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Guest View */}
              {/* Hidden Admin Button for Guests (or keep if you want public access to login page) */}
              <Link to="/login">
                <Button variant="hero" size="sm" className="gap-2">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-lg md:hidden animate-fade-in">
          <div className="container flex flex-col gap-4 py-4">
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border/50 my-2" />

            {/* Mobile Logic */}
            {user ? (
              <>
                <div className="text-sm font-medium text-muted-foreground px-2 pb-2">
                  Signed in as {user.email}
                </div>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 justify-start"
                  >
                    <User className="h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>

                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 justify-start border-blue-500/30 text-blue-500"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 justify-start text-red-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Portal
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full gap-2">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
