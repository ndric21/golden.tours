import { Sun, Moon, User, LogOut, Settings, LogIn, UserPlus, Globe } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-provider";
import { useLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          <div className="pl-12 lg:pl-0">
            <h2 className="text-lg sm:text-xl font-bold text-gradient-gold">Golden Tours</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Tanzania & East Africa · AI Vacation Planner
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "sw" : "en")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border bg-card hover:bg-accent hover:text-gold transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              <Globe className="h-3.5 w-3.5" />
              {language}
            </button>
            <button
              onClick={toggle}
              className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-gold hover:shadow-gold transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-semibold hover:shadow-gold transition-all cursor-pointer">
                    {user.avatar || user.name.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{t("header.welcome")}</p>
                    <p className="text-xs text-gold mt-1 font-medium capitalize">
                      {user.role} Account
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="h-10 px-4 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-medium hover:shadow-gold transition-all gap-2 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="text-sm hidden sm:inline">Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="h-10 px-4 rounded-full bg-card border border-border flex items-center justify-center text-foreground font-medium hover:border-gold/40 hover:text-gold transition-all gap-2 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm hidden sm:inline">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
