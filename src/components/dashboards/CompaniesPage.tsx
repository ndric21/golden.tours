import { useState, useEffect } from "react";
import { getAllCompanies, TourCompany, CompanyReview } from "@/lib/companies";
import { Star, MapPin, Calendar, ChevronDown, ChevronUp, Building2, Filter } from "lucide-react";

type Category = "all" | TourCompany["category"];

function StarRating({ rating, size = "sm", animate = false }: { rating: number; size?: "sm" | "lg"; animate?: boolean }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s, i) => (
        <Star
          key={s}
          className={`${size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"} ${
            s <= Math.round(rating) ? "fill-gold text-gold" : "text-border"
          } ${animate ? "animate-star" : ""}`}
          style={animate ? { animationDelay: `${i * 60}ms` } : undefined}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: CompanyReview; index: number }) {
  return (
    <div
      className="bg-accent/30 border border-border rounded-xl p-4 animate-slide-in-right"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 shadow-gold">
          {review.reviewerInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-sm">{review.reviewerName}</p>
              <p className="text-xs text-muted-foreground">{review.tripType}</p>
            </div>
            <div className="text-right">
              <StarRating rating={review.rating} />
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

function CompanyCard({ company, index }: { company: TourCompany; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const categoryColors: Record<string, string> = {
    safari: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    beach: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    mountain: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    cultural: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    adventure: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };

  return (
    <div
      className="bg-card border border-border rounded-3xl overflow-hidden hover:border-gold/40 hover:shadow-gold transition-all duration-300 animate-fade-slide-up"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gold/20 to-accent border border-gold/30 flex items-center justify-center text-3xl flex-shrink-0 shadow-gold">
            {company.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-bold text-lg leading-tight">{company.name}</h3>
                <p className="text-sm text-muted-foreground italic">{company.tagline}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${categoryColors[company.category] || "bg-accent text-muted-foreground"}`}>
                {company.category}
              </span>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {company.rating > 0 ? (
                <>
                  <StarRating rating={company.rating} animate={true} />
                  <span className="text-sm font-bold text-gold">{company.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({company.reviewCount} reviews)</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground italic">No reviews yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {company.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            Est. {company.established}
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {company.specialties.slice(0, 3).map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/20">
              {s}
            </span>
          ))}
          {company.specialties.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-accent text-muted-foreground text-xs font-medium">
              +{company.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Expand/Collapse */}
      <div className="border-t border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold text-gold hover:bg-gold/5 transition-colors"
        >
          <span>{expanded ? "Hide Details" : "View Details & Reviews"}</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded && (
          <div className="px-6 pb-6 space-y-5 animate-fade-in">
            {/* Description */}
            <div>
              <h4 className="font-semibold text-sm mb-2">About</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
            </div>

            {/* All specialties */}
            {company.specialties.length > 3 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">All Specialties</h4>
                <div className="flex flex-wrap gap-1.5">
                  {company.specialties.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {company.reviews.length > 0 ? (
              <div>
                <h4 className="font-semibold text-sm mb-3">Traveler Reviews</h4>
                <div className="space-y-3">
                  {company.reviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border border-border rounded-xl text-muted-foreground text-sm">
                No reviews yet for this operator.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "All Operators", emoji: "🌍" },
  { id: "safari", label: "Safari", emoji: "🦁" },
  { id: "beach", label: "Beach", emoji: "🏝️" },
  { id: "mountain", label: "Mountain", emoji: "🏔️" },
  { id: "cultural", label: "Cultural", emoji: "🌿" },
  { id: "adventure", label: "Adventure", emoji: "⛺" },
];

export function CompaniesPage() {
  const [companies, setCompanies] = useState<TourCompany[]>([]);
  const [filter, setFilter] = useState<Category>("all");

  useEffect(() => {
    getAllCompanies().then(setCompanies).catch(console.error);
  }, []);

  const filtered = filter === "all" ? companies : companies.filter((c) => c.category === filter);

  return (
    <div className="space-y-8 animate-fade-slide-up">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gold/20 via-accent/20 to-card border border-gold/20 p-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
        <div className="text-5xl mb-3">🏢</div>
        <h2 className="text-3xl font-bold text-gradient-gold mb-2">Trusted Tour Operators</h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Hand-picked East Africa tour operators with verified reviews. Every company listed here has been
          assessed for quality, safety, and guest satisfaction.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-6 flex-wrap">
          {[
            { label: "Operators", value: companies.length.toString() },
            { label: "Total Reviews", value: companies.reduce((s, c) => s + c.reviewCount, 0).toLocaleString() },
            { label: "Avg. Rating", value: (companies.filter(c => c.rating > 0).reduce((s, c) => s + c.rating, 0) / Math.max(companies.filter(c => c.rating > 0).length, 1)).toFixed(1) + "★" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-gradient-gold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 ${
              filter === cat.id
                ? "bg-gradient-gold text-primary-foreground shadow-gold"
                : "bg-card border border-border text-muted-foreground hover:border-gold/40 hover:text-gold"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> operator{filtered.length !== 1 ? "s" : ""}
        {filter !== "all" && ` in ${filter}`}
      </p>

      {/* Company Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 text-gold/40" />
          <p className="font-medium">No operators found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filtered.map((company, i) => (
            <CompanyCard key={company.id} company={company} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
