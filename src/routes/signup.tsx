import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { UserPlus, AlertCircle, Loader2, Sparkles, User, Building2, Globe } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { type UserRole } from "@/lib/auth";
import { useLanguage, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign Up — Golden Tours" },
      { name: "description", content: "Create your Golden Tours account." },
    ],
  }),
});

function SignupPage() {
  const { signup } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (role === "company" && !companyName.trim()) {
      setError("Please enter your company name.");
      return;
    }
    setIsLoading(true);
    try {
      await signup(name, email, password, role, role === "company" ? companyName : undefined, language);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-radial-gold flex items-center justify-center px-4 py-8">
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
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "sw" : "en")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent hover:bg-gold/10 text-gold transition-colors"
            >
              <Globe className="h-3 w-3" />
              {language === "en" ? "Switch to Swahili" : "Badili kwenda Kiingereza"}
            </button>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5 text-gold" />
              {t("auth.create_account")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t("auth.begin_journey")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Account type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.account_type")}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="signup-role-user"
                  onClick={() => setRole("user")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    role === "user"
                      ? "bg-gradient-gold text-primary-foreground shadow-gold scale-[1.02]"
                      : "bg-accent text-foreground hover:bg-accent/80 border border-border"
                  }`}
                >
                  <User className="h-4 w-4" /> {t("auth.traveler")}
                </button>
                <button
                  type="button"
                  id="signup-role-company"
                  onClick={() => setRole("company")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    role === "company"
                      ? "bg-gradient-gold text-primary-foreground shadow-gold scale-[1.02]"
                      : "bg-accent text-foreground hover:bg-accent/80 border border-border"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> {t("auth.company")}
                </button>
              </div>
              {role === "company" && (
                <p className="text-xs text-muted-foreground bg-gold/5 border border-gold/20 rounded-lg px-3 py-2">
                  Company accounts get access to the full business management dashboard.
                </p>
              )}
            </div>

            {/* Company name (company only) */}
            {role === "company" && (
              <div className="space-y-2">
                <label htmlFor="company-name" className="text-sm font-medium">
                  Company Name
                </label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="e.g. Safari Excellence Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required={role === "company"}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-sm font-medium">
                {t("auth.fullname")}
              </label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium">
                {t("auth.email")}
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium">
                {t("auth.password")}
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm-password" className="text-sm font-medium">
                {t("auth.confirm_password")}
              </label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              id="signup-submit"
              className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold py-2.5 transition-all hover:shadow-gold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("auth.btn.creating")}
                </>
              ) : (
                t("auth.btn.create")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
