import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getPackages, type Package } from "@/lib/destinations";

export function Recommendations() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getPackages().then(setPackages).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in-up">
      {packages.map((p, i) => (
        <article
          key={p.id}
          className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-gold transition-all duration-300"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={p.image}
              alt={p.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-semibold">
              Best for {p.bestFor}
            </span>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-lg font-bold text-white drop-shadow">{p.title}</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {p.destination}
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gold" /> {p.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-gold" /> {p.bestFor}
              </span>
            </div>
            <ul className="space-y-1">
              {p.highlights.map((h) => (
                <li key={h} className="text-xs text-foreground/80 flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 rounded-full bg-gold" /> {h}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">From</p>
                <p className="text-base font-bold text-gold">
                  ${p.priceFrom.toLocaleString()} – ${p.priceTo.toLocaleString()}
                </p>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold text-gold hover:gap-2 transition-all">
                Details <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
