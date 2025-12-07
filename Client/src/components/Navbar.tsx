import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Ticket, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Events" },
  { href: "/booking/demo", label: "Book Now" },
  { href: "/my-bookings", label: "My Bookings" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo - Theme aware */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img 
            src={resolvedTheme === "dark" ? logoDark : logoLight} 
            alt="Pulse Booking" 
            className="h-10 w-auto" 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
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
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="hero" size="sm" className="gap-2">
              Sign In
            </Button>
          </Link>
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
            {navLinks.map((link) => (
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
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="hero" size="sm" className="w-full gap-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
