import { useState, useEffect, useMemo } from "react";
import { Globe, Mountain, Waves, TreePine, Landmark, MapPin, Search, Filter, Star, ArrowRight } from "lucide-react";
import { getDestinations, Destination } from "@/lib/destinations";
import { DestinationDetailsModal } from "./DestinationDetailsModal";
import { useLanguage } from "@/lib/i18n";

const categoryIcons: Record<string, React.ReactNode> = {
  Beach: <Waves className="h-3.5 w-3.5" />,
  Safari: <Globe className="h-3.5 w-3.5" />,
  Mountain: <Mountain className="h-3.5 w-3.5" />,
  Heritage: <Landmark className="h-3.5 w-3.5" />,
  Island: <Waves className="h-3.5 w-3.5" />,
  Crater: <Globe className="h-3.5 w-3.5" />,
  Forest: <TreePine className="h-3.5 w-3.5" />,
  Park: <TreePine className="h-3.5 w-3.5" />,
  Lake: <Waves className="h-3.5 w-3.5" />,
};

const categoryColors: Record<string, string> = {
  Beach: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  Safari: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Mountain: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  Heritage: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  Island: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  Crater: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  Forest: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Park: "bg-green-500/10 text-green-500 border-green-500/20",
  Lake: "bg-teal-400/10 text-teal-400 border-teal-400/20",
};

export function DestinationsDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    getDestinations().then(setDestinations).catch(console.error);
  }, []);

  const allCategories = useMemo(() => ["All", ...Array.from(new Set(destinations.map((d) => d.category)))], [destinations]);

  const filtered = destinations
    .filter(
      (d) =>
        (activeCategory === "All" || d.category === activeCategory) &&
        (d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.tag.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => (sortBy === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name)));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {allCategories.slice(1).map((cat) => {
          const count = destinations.filter((d) => d.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? "All" : cat)}
              className={`rounded-2xl p-4 border text-left transition-all hover:shadow-gold hover:border-gold/30
                ${activeCategory === cat ? "bg-gradient-gold border-gold/50 text-primary-foreground shadow-gold" : "bg-card border-border"}`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${activeCategory === cat ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {cat}
              </span>
              <p
                className={`text-2xl font-bold mt-1 ${activeCategory === cat ? "text-primary-foreground" : "text-foreground"}`}
              >
                {count}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dash.search.placeholder")}
            className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rating" | "name")}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gold cursor-pointer"
          >
            <option value="rating">{t("dash.sort.rating")}</option>
            <option value="name">{t("dash.sort.name")}</option>
          </select>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${
                activeCategory === cat
                  ? "bg-gradient-gold text-primary-foreground border-gold/50 shadow-gold"
                  : "bg-card border-border text-muted-foreground hover:text-gold hover:border-gold/30"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destinations Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("dash.showing")} <span className="font-semibold text-foreground">{filtered.length}</span> {t("dash.of")}{" "}
            {destinations.length} {t("dash.destinations_count")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/40">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Destination
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Experience
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rating
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No destinations match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((d: Destination) => (
                  <tr key={d.id} className="hover:bg-accent/30 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <img
                            src={d.image}
                            alt={d.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-semibold group-hover:text-gold transition-colors">
                            {d.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {d.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground hidden sm:table-cell">
                      {d.tag}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[d.category] ?? ""}`}
                      >
                        {categoryIcons[d.category]}
                        {d.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-gold font-semibold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {d.rating}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedDestination(d)}
                        className="flex items-center gap-1 text-xs font-semibold text-gold hover:gap-2 transition-all ml-auto"
                      >
                        {t("dash.btn.explore")} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDestination && (
        <DestinationDetailsModal 
          destination={selectedDestination} 
          onClose={() => setSelectedDestination(null)} 
        />
      )}
    </div>
  );
}
