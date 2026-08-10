import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar, ActivePage } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DestinationsDashboard } from "@/components/dashboards/DestinationsDashboard";
import { TripsDashboard } from "@/components/dashboards/TripsDashboard";
import { FavoritesDashboard } from "@/components/dashboards/FavoritesDashboard";
import { HomeDashboard } from "@/components/dashboards/HomeDashboard";
import { ProfilePage } from "@/components/dashboards/ProfilePage";
import { SettingsPage } from "@/components/dashboards/SettingsPage";
import { CompaniesPage } from "@/components/dashboards/CompaniesPage";
import { CompanyDashboard } from "@/components/dashboards/CompanyDashboard";
import { AIPage } from "@/components/AIPage";
import { Landing } from "@/components/Landing";
import { useAuth } from "@/lib/auth-provider";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Golden Tours — AI Vacation Planner for Tanzania & East Africa" },
      {
        name: "description",
        content:
          "Plan luxury Tanzania safaris, Zanzibar beach escapes and Kilimanjaro climbs with an AI travel assistant.",
      },
    ],
  }),
});

const pageMeta: Record<ActivePage, { title: string; subtitle: string }> = {
  Home: {
    title: "Welcome Back",
    subtitle: "Here's what's happening across your golden journeys.",
  },
  Destinations: {
    title: "Explore Destinations",
    subtitle: "Discover Tanzania & East Africa's finest locations.",
  },
  "My Trips": {
    title: "My Trips",
    subtitle: "Track, manage, and plan all your golden adventures.",
  },
  Favorites: {
    title: "Favorites",
    subtitle: "Your saved destinations and curated travel packages.",
  },
  Profile: {
    title: "My Profile",
    subtitle: "Manage your avatar, personal info, and account security.",
  },
  AI: {
    title: "AI Travel Assistant",
    subtitle: "Get personalized recommendations powered by AI.",
  },
  Settings: {
    title: "Settings",
    subtitle: "Manage travel buddies, preferences, and account settings.",
  },
  Companies: {
    title: "Tour Operators",
    subtitle: "Browse trusted East Africa tour companies with ratings & reviews.",
  },
};

function Index() {
  const { user } = useAuth();

  // If user is logged in, default to Destinations instead of Home (Landing)
  const defaultPage = user && user.role === "user" ? "Destinations" : "Home";
  const [activePage, setActivePage] = useState<ActivePage>(defaultPage);

  useEffect(() => {
    const stored = localStorage.getItem("gt-theme");
    document.documentElement.classList.toggle("dark", stored !== "light");
  }, []);

  // If user is a company, they get the dedicated full-screen Company Dashboard
  if (user?.role === "company") {
    return <CompanyDashboard />;
  }

  // Hide sidebar only on the logged-out marketing landing page for a full immersive experience
  const isLandingPage = activePage === "Home" && !user;
  const isAIPage = activePage === "AI";

  const meta = pageMeta[activePage];

  return (
    <div className="min-h-screen bg-background bg-radial-gold">
      {isAIPage ? (
        // Full-page AI experience
        <AIPage onBack={() => setActivePage(user ? "Destinations" : "Home")} />
      ) : (
        // Standard layout — sidebar hidden on the logged-out landing page
        <div className="flex">
          {!isLandingPage && <Sidebar activePage={activePage} setActivePage={setActivePage} />}
          <div className="flex-1 min-w-0">
            <Header />
            <main
              className={`px-4 lg:px-8 py-6 max-w-7xl mx-auto ${isLandingPage ? "max-w-full" : ""}`}
            >
              {/* Page headers only for non-AI, non-landing pages */}
              {!isAIPage && !isLandingPage && (
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {meta.title.split(" ").map((word, i) =>
                      i === meta.title.split(" ").length - 1 ? (
                        <span key={i} className="text-gradient-gold">
                          {" "}
                          {word}
                        </span>
                      ) : (
                        <span key={i}>{word} </span>
                      ),
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">{meta.subtitle}</p>
                </div>
              )}

              {/* Page Content */}
              {activePage === "Home" && !user && (
                <Landing onStart={() => setActivePage("Home")} />
              )}
              {activePage === "Home" && user && (
                <HomeDashboard onNavigate={(p) => setActivePage(p as ActivePage)} />
              )}
              {activePage === "Destinations" && (
                <DestinationsDashboard onNavigate={(p) => setActivePage(p as ActivePage)} />
              )}
              {activePage === "My Trips" && (
                <TripsDashboard onNavigate={(p) => setActivePage(p as ActivePage)} />
              )}
              {activePage === "Favorites" && (
                <FavoritesDashboard onNavigate={(p) => setActivePage(p as ActivePage)} />
              )}
              {activePage === "Profile" && user && (
                <ProfilePage />
              )}
              {activePage === "Profile" && !user && (
                <div className="text-center py-20 text-muted-foreground">
                  Please log in to view your profile.
                </div>
              )}
              {activePage === "Settings" && user && (
                <SettingsPage onNavigate={(p) => setActivePage(p as ActivePage)} />
              )}
              {activePage === "Settings" && !user && (
                <div className="text-center py-20 text-muted-foreground">
                  Please log in to access settings.
                </div>
              )}
              {activePage === "Companies" && (
                <CompaniesPage />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
