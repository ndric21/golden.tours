import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogIn, AlertCircle, Loader2, Sparkles, User, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { type UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — Golden Tours" },
      { name: "description", content: "Sign in to your Golden Tours account." },
    ],
  }),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-radial-gold flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-gold mb-4 shadow-gold">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-gold">Golden Tours</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tanzania & East Africa · AI Vacation Planner
          </p>
        </div>

        <div className="bg-card/70 backdrop-blur border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5 text-gold" />
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your golden journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Login As</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="role-user"
                  onClick={() => setRole("user")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    role === "user"
                      ? "bg-gradient-gold text-primary-foreground shadow-gold scale-[1.02]"
                      : "bg-accent text-foreground hover:bg-accent/80 border border-border"
                  }`}
                >
                  <User className="h-4 w-4" /> Traveler
                </button>
                <button
                  type="button"
                  id="role-company"
                  onClick={() => setRole("company")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    role === "company"
                      ? "bg-gradient-gold text-primary-foreground shadow-gold scale-[1.02]"
                      : "bg-accent text-foreground hover:bg-accent/80 border border-border"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> Company
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="transition-all focus:shadow-gold/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="transition-all focus:shadow-gold/20"
              />
            </div>

            <Button
              type="submit"
              id="login-submit"
              className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold py-2.5 transition-all hover:shadow-gold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Login as ${role === "company" ? "Company" : "Traveler"}`
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-gold hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
