import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  Users,
  Wallet,
  Clock,
  MapPin,
  Sparkles,
  Loader2,
  Compass,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPackages, Package } from "@/lib/destinations";
import { BookingModal } from "@/components/dashboards/BookingModal";

// Currency exchange rates (base: USD)
const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1, label: "USD – US Dollar" },
  { code: "EUR", symbol: "€", rate: 0.92, label: "EUR – Euro" },
  { code: "GBP", symbol: "£", rate: 0.79, label: "GBP – British Pound" },
  { code: "KES", symbol: "KSh", rate: 129, label: "KES – Kenyan Shilling" },
  { code: "TZS", symbol: "TSh", rate: 2650, label: "TZS – Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", rate: 3730, label: "UGX – Ugandan Shilling" },
  { code: "RWF", symbol: "Fr", rate: 1290, label: "RWF – Rwandan Franc" },
  { code: "ZAR", symbol: "R", rate: 18.5, label: "ZAR – South African Rand" },
];

// Interest → category/highlight keyword mapping
const INTEREST_KEYWORDS: Record<string, string[]> = {
  "Wildlife Safari": ["safari", "migration", "game", "wildlife", "elephant", "lion", "leopard", "rhino", "wild dog"],
  "Beach Relaxation": ["beach", "coastal", "coast", "island", "ocean", "resort", "dhow"],
  "Mountain Trekking": ["mountain", "trek", "climb", "summit", "peak", "kilimanjaro", "kenya"],
  "Cultural Experiences": ["culture", "swahili", "maasai", "heritage", "town", "community", "village", "batwa"],
  "Photography": ["scenery", "sunrise", "sunset", "balloon", "viewpoint", "panoramic"],
  "Scuba Diving": ["snorkel", "dive", "coral", "reef", "marine"],
  "Hot Air Ballooning": ["balloon"],
  "Honeymoon": ["couple", "beachfront", "retreat", "escape", "luxury"],
  "Gorilla Trekking": ["gorilla", "primate", "chimpanzee"],
  "Bird Watching": ["bird", "flamingo", "stork"],
};

// Budget string → USD price range
const BUDGET_RANGES: Record<string, [number, number]> = {
  "Economy (< $1500)": [0, 1500],
  "Mid-Range ($1500–$3000)": [1500, 3000],
  "Luxury ($3000–$5000)": [3000, 5000],
  "Ultra-Luxury ($5000+)": [5000, 999999],
};

// Duration string → days range
const DURATION_DAYS: Record<string, [number, number]> = {
  "3–5 Days": [3, 5],
  "1 Week": [6, 8],
  "10 Days": [9, 11],
  "2 Weeks": [12, 15],
  "2+ Weeks": [14, 999],
};

function parseDuration(str: string): number {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0]) : 7;
}

function filterPackages(
  allPackages: Package[],
  travelers: string,
  budget: string,
  duration: string,
  interests: string[]
): Package[] {
  let results = [...allPackages];

  // Budget filter
  const budgetRange = BUDGET_RANGES[budget];
  if (budgetRange) {
    results = results.filter(
      (p) => p.priceFrom <= budgetRange[1] && p.priceTo >= budgetRange[0]
    );
  }

  // Duration filter
  const durationRange = DURATION_DAYS[duration];
  if (durationRange) {
    results = results.filter((p) => {
      const days = parseDuration(p.duration);
      return days >= durationRange[0] && days <= durationRange[1];
    });
  }

  // Interest scoring
  if (interests.length > 0) {
    const keywords = interests.flatMap((i) => INTEREST_KEYWORDS[i] ?? []);
    results = results
      .map((p) => {
        const text = [p.title, p.destination, ...p.highlights]
          .join(" ")
          .toLowerCase();
        const score = keywords.filter((kw) => text.includes(kw)).length;
        return { pkg: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.pkg);
  }

  // Traveler filter – bestFor matching
  if (travelers.includes("Couple")) {
    results.sort((a) => (a.bestFor === "Couple" ? -1 : 0));
  } else if (travelers.includes("Family")) {
    results.sort((a) => (a.bestFor === "Family" ? -1 : 0));
  } else if (travelers.includes("Solo")) {
    results.sort((a) => (a.bestFor === "Solo" ? -1 : 0));
  } else if (travelers.includes("Group") || travelers.includes("Large")) {
    results.sort((a) => (a.bestFor === "Group" ? -1 : 0));
  }

  return results.length > 0 ? results : allPackages.slice(0, 3);
}

export function AIPage({ onBack }: { onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-background bg-radial-gold flex flex-col">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-gold/10 to-accent/20 border-b border-gold/20 px-4 lg:px-8 py-8 pt-10">
        <div className="max-w-5xl mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 px-3 mb-6 rounded-lg bg-card hover:bg-accent transition-colors border border-gold/20 text-gold flex items-center gap-1.5 text-sm font-medium"
              aria-label="Back to Home"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            AI Vacation Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Let us craft your perfect Tanzania & East Africa adventure
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <main className="flex-1 px-4 lg:px-8 py-8 w-full max-w-5xl mx-auto flex flex-col">
        <div className="flex-1">
          <SmartFormPlanner />
        </div>
      </main>
    </div>
  );
}

function SmartFormPlanner() {
  const [travelers, setTravelers] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Package[] | null>(null);
  const [bookingPackageId, setBookingPackageId] = useState<string | null>(null);

  useEffect(() => {
    getPackages().then(setAllPackages).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const filtered = filterPackages(allPackages, travelers, budget, duration, interests);
    setResults(filtered);
    setIsGenerating(false);
  };

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return converted.toLocaleString();
  };

  const pillClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer ${
      active
        ? "bg-gold/15 border-gold text-gold shadow-sm shadow-gold/20"
        : "bg-accent/30 border-border text-foreground hover:border-gold/40 hover:bg-accent/60"
    }`;

  if (results) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Your Personalized Itineraries
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Matched to your preferences · Prices in {currency.code}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={currency.code}
              onChange={(e) =>
                setCurrency(CURRENCIES.find((c) => c.code === e.target.value)!)
              }
              className="bg-accent/30 border border-gold/30 text-foreground text-sm rounded-lg px-3 py-2 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={() => setResults(null)}>
              Edit Preferences
            </Button>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gold/40" />
            <p className="text-lg font-medium">No exact matches found</p>
            <p className="text-sm mt-2">Try relaxing your filters</p>
            <Button variant="outline" className="mt-6" onClick={() => setResults(null)}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-gold hover:border-gold/40 transition-all duration-300 h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-gold/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="h-3 w-3" /> Recommended
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {pkg.destination}
                    </p>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4 text-xs font-medium text-foreground/80">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gold" /> {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-gold" />
                      {currency.symbol}{formatPrice(pkg.priceFrom)} – {currency.symbol}{formatPrice(pkg.priceTo)}
                    </span>
                  </div>
                  <div className="space-y-1 mb-6 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Key Highlights
                    </p>
                    <ul className="text-sm text-foreground/90 space-y-1.5">
                      {pkg.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gold font-bold">•</span>
                          <span className="line-clamp-2">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button
                      variant="outline"
                      className="w-full text-xs hover:border-gold hover:text-gold transition-colors"
                    >
                      View Itinerary
                    </Button>
                    <Button 
                      className="w-full text-xs bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
                      onClick={() => setBookingPackageId(pkg.id)}
                    >
                      Book This Trip
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookingPackageId && (
          <BookingModal 
            prefilledPackageId={bookingPackageId} 
            onClose={() => setBookingPackageId(null)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm max-w-3xl mx-auto animate-fade-in-up">
      <div className="space-y-8">

        {/* Currency */}
        <div>
          <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-gold" /> Display Currency
          </label>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c)}
                className={pillClass(currency.code === c.code)}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Travelers */}
        <div>
          <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-gold" /> Number of Travelers
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "1 (Solo)",
              "2 (Couple)",
              "3–4 (Small Group)",
              "5+ (Large Group)",
              "Family with Kids",
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => setTravelers(opt)}
                className={pillClass(travelers === opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Level */}
        <div>
          <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Wallet className="h-4 w-4 text-gold" /> Budget Level (per person)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Economy (< $1500)",
              "Mid-Range ($1500–$3000)",
              "Luxury ($3000–$5000)",
              "Ultra-Luxury ($5000+)",
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => setBudget(opt)}
                className={pillClass(budget === opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Duration */}
        <div>
          <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-gold" /> Trip Duration
          </label>
          <div className="flex flex-wrap gap-2">
            {["3–5 Days", "1 Week", "10 Days", "2 Weeks", "2+ Weeks"].map((opt) => (
              <button
                key={opt}
                onClick={() => setDuration(opt)}
                className={pillClass(duration === opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Travel Month — pill buttons matching theme */}
        <div>
          <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-gold" /> Preferred Travel Month
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "January", "February", "March", "April",
              "May", "June", "July", "August",
              "September", "October", "November", "December",
            ].map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={pillClass(month === m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Compass className="h-4 w-4 text-gold" /> Interests & Activities
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Wildlife Safari",
              "Beach Relaxation",
              "Mountain Trekking",
              "Cultural Experiences",
              "Photography",
              "Scuba Diving",
              "Hot Air Ballooning",
              "Honeymoon",
              "Gorilla Trekking",
              "Bird Watching",
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => toggleInterest(opt)}
                className={pillClass(interests.includes(opt))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border flex justify-end">
        <Button
          onClick={handleGenerate}
          disabled={
            !travelers || !budget || !duration || !month || interests.length === 0 || isGenerating
          }
          size="lg"
          className="bg-gradient-gold text-primary-foreground font-bold hover:opacity-90 shadow-gold px-8 py-6 text-base w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Crafting Itinerary...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" /> Generate My Personalized Itineraries
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
