/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logo-dark.png";

import { AuthService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

export default function Register() {
  const { resolvedTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calling the endpoint
      const response = await AuthService.register({ name, email, password });

      // Auto-login
      login(response.data.user, response.token!);

      toast({
        title: "Account Created!",
        description: "Welcome to Pulse Booking.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blurred Background Elements (Preserved) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md animate-scale-in border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={resolvedTheme === "dark" ? logoDark : logoLight}
              alt="Pulse Booking"
              className="h-16 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join Pulse Booking and never miss an event
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              variant="hero"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
