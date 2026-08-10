import { useState, useEffect } from "react";
import { Star, Heart, Trash2, ArrowRight, MapPin, Calendar, DollarSign } from "lucide-react";
import { getDestinations, getPackages, Destination, Package } from "@/lib/destinations";
import { favoriteStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-provider";

export function FavoritesDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user } = useAuth();
  const [favDestinations, setFavDestinations] = useState<Destination[]>([]);
  const [favPackages, setFavPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    Promise.all([
      getDestinations(),
      getPackages(),
      favoriteStore.getDestinationIds(user.id),
      favoriteStore.getPackageIds(user.id),
    ])
      .then(([destinations, packages, destIds, pkgIds]) => {
        setFavDestinations(destinations.filter((d) => destIds.has(d.id)));
        setFavPackages(packages.filter((p) => pkgIds.has(p.id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const remove = async (id: string) => {
    if (!user) return;
    await favoriteStore.removeDestination(user.id, id);
    setFavDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground text-sm">Loading your favorites…</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Favorites Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Saved Destinations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {favDestinations.length} destinations saved
            </p>
          </div>
        </div>
        {favDestinations.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Heart className="h-10 w-10 opacity-20" />
            <p className="text-sm">No saved destinations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {favDestinations.map((d: Destination) => (
              <div
                key={d.id}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-gold hover:border-gold/40 transition-all duration-300"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <button
                    onClick={() => remove(d.id)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white font-bold text-sm">{d.name}</p>
                    <p className="text-white/70 text-[11px]">{d.tag}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gold font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current" /> {d.rating}
                  </span>
                  <button
                    onClick={() => onNavigate?.("AI")}
                    className="flex items-center gap-0.5 text-xs text-gold hover:gap-1.5 transition-all font-semibold"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Packages Comparison Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold">Saved Packages</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Compare your saved travel packages</p>
        </div>
        <div className="overflow-x-auto">
          {favPackages.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground">
              <p className="text-sm">No saved packages yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Package
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Destination
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Duration
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Best For
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Price Range
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {favPackages.map((p: Package) => (
                  <tr key={p.id} className="hover:bg-accent/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <p className="font-semibold group-hover:text-gold transition-colors">
                          {p.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-gold" /> {p.destination}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 text-gold" /> {p.duration}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                        {p.bestFor}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-xs font-bold text-gold">
                        <DollarSign className="h-3 w-3" />
                        {p.priceFrom.toLocaleString()} – {p.priceTo.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onNavigate?.("AI")}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-gold text-primary-foreground text-xs font-semibold shadow-gold hover:shadow-[0_10px_40px_-10px_var(--gold)] transition-all"
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
