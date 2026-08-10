import { Home, Map, Compass, Heart, Star, Menu, X, Sparkles, Settings, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDestinations, type Destination } from "@/lib/destinations";
import { useLanguage } from "@/lib/i18n";

export type ActivePage = "Home" | "Destinations" | "My Trips" | "Favorites" | "Profile" | "AI" | "Settings" | "Companies";

const nav: { icon: typeof Home; label: ActivePage; transKey: string }[] = [
  { icon: Home, label: "Home", transKey: "nav.home" },
  { icon: Compass, label: "Destinations", transKey: "nav.destinations" },
  { icon: Map, label: "My Trips", transKey: "nav.mytrips" },
  { icon: Heart, label: "Favorites", transKey: "nav.favorites" },
  { icon: Building2, label: "Companies", transKey: "nav.companies" },
  { icon: Sparkles, label: "AI", transKey: "nav.ai" },
  { icon: Settings, label: "Settings", transKey: "nav.settings" },
];

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    getDestinations().then(setDestinations).catch(console.error);
  }, []);

  const navigate = (label: ActivePage) => {
    setActivePage(label);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-card border border-border text-gold"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[300px] flex-shrink-0
          bg-sidebar border-r border-sidebar-border flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-gradient-gold tracking-tight">Golden Tours</h1>
          <button onClick={() => setOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {nav.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  activePage === item.label
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "text-foreground/80 hover:bg-accent hover:text-gold"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {t(item.transKey)}
            </button>
          ))}
        </nav>

        <div className="px-5 pt-2 pb-2">
          <h2 className="text-xs uppercase tracking-widest text-gold/80 font-semibold">
            Popular Destinations
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-6 space-y-2">
          {destinations.map((d) => (
            <button
              key={d.id}
              onClick={() => navigate("Destinations")}
              className="group w-full flex gap-3 p-2 rounded-xl hover:bg-accent transition-all text-left"
            >
              <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                <img
                  src={d.image}
                  alt={d.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate group-hover:text-gold transition-colors">
                    {d.name}
                  </p>
                  <span className="flex items-center gap-0.5 text-xs text-gold">
                    <Star className="h-3 w-3 fill-current" />
                    {d.rating}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{d.tag}</p>
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gold/70">
                  {d.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
