import { ArrowRight, Sparkles, Compass, Shield, Star, MapPin } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-serengeti.jpg";
import { getDestinations, type Destination } from "@/lib/destinations";
import { useLanguage } from "@/lib/i18n";

const signatureIds = ["zanzibar", "serengeti", "kilimanjaro", "ngorongoro"];

const stats = [
  { value: "24+", labelKey: "stat.destinations" },
  { value: "3,800+", labelKey: "stat.travelers" },
  { value: "4.9", labelKey: "stat.rating" },
  { value: "AI", labelKey: "stat.ai" },
];

const whyItems = [
  {
    icon: Sparkles,
    title: "AI-Crafted Itineraries",
    desc: "Tell us your dream — we shape every golden day around you.",
  },
  {
    icon: Compass,
    title: "Local Expertise",
    desc: "Guides who know every acacia, crater rim and reef pass.",
  },
  {
    icon: Shield,
    title: "Effortless & Secure",
    desc: "Vetted lodges, transparent pricing, 24/7 concierge.",
  },
];

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    getDestinations().then(setDestinations).catch(console.error);
  }, []);

  const signatures = signatureIds
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="space-y-24 pb-24 animate-fade-in-up">
      {/* HERO */}
      <section className="relative -mx-4 lg:-mx-8 -mt-6 h-[88vh] min-h-[560px] overflow-hidden">
        <img
          src={heroImg}
          alt="Serengeti plains at golden hour with Mount Kilimanjaro"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-gold/30 text-gold text-xs uppercase tracking-[0.2em] mb-6">
            <Sparkles className="h-3 w-3" /> Tanzania · East Africa
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-gradient-gold drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)]">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed font-light">
            {t("landing.hero.subtitle")}
            <span className="text-gold/90">{t("landing.hero.highlight")}</span>
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:shadow-[0_0_50px_-5px_var(--gold-glow)] transition-all duration-300 hover:-translate-y-0.5"
            >
              {t("landing.start_adventure")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate({ to: "/", search: {} as never }) || onStart()}
              className="px-7 py-3.5 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
            >
              {t("landing.explore_destinations")}
            </button>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold/60 text-xs tracking-widest uppercase animate-pulse">
          Scroll
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.labelKey}
              className="bg-card/60 backdrop-blur border border-border rounded-2xl px-6 py-7 text-center hover:border-gold/40 hover:shadow-gold transition-all"
            >
              <p className="text-3xl font-bold text-gradient-gold">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                {t(s.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNATURE DESTINATIONS */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">
              Signature Destinations
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Wild &amp; <span className="text-gradient-gold">Wonderful</span>
            </h2>
          </div>
          <button
            onClick={onStart}
            className="hidden sm:flex items-center gap-1 text-sm text-gold hover:gap-2 transition-all"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="-mx-4 lg:-mx-8 px-4 lg:px-8 overflow-x-auto scrollbar-thin">
          <div className="flex gap-5 pb-4 min-w-min">
            {signatures.map((d) => (
              <button
                key={d.id}
                onClick={onStart}
                className="group relative flex-shrink-0 w-[300px] sm:w-[360px] h-[460px] rounded-3xl overflow-hidden border border-border hover:border-gold/40 transition-all"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  <div className="flex items-center gap-2 text-gold text-xs mb-2">
                    <Star className="h-3 w-3 fill-current" /> {d.rating}
                    <span className="text-white/40">·</span>
                    <span className="uppercase tracking-widest text-[10px]">{d.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{d.name}</h3>
                  <p className="text-sm text-white/70 mt-1">{d.tag}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    Discover <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GOLDEN TOURS */}
      <section className="max-w-6xl mx-auto px-2">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">Why Golden Tours</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Travel, <span className="text-gradient-gold">reimagined</span>.
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            A quiet kind of luxury — where wilderness meets thoughtful design and every detail is
            shaped by intelligence and instinct.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {whyItems.map((w) => (
            <div
              key={w.title}
              className="group bg-card/60 backdrop-blur border border-border rounded-2xl p-8 hover:border-gold/40 hover:shadow-gold transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground shadow-gold mb-5 group-hover:scale-110 transition-transform">
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{w.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-6xl mx-auto px-2">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-card via-card to-accent/30 p-10 sm:p-14">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative grid md:grid-cols-[1.4fr_auto] items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.25em] mb-3">
                <MapPin className="h-3 w-3" /> Limited Season Offer
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
                Your <span className="text-gradient-gold">Great Migration</span> awaits.
              </h3>
              <p className="text-muted-foreground mt-3 max-w-xl">
                Let our AI weave you a private 7-day Serengeti & Ngorongoro journey — handcrafted,
                golden hour to golden hour.
              </p>
            </div>
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:-translate-y-0.5 hover:shadow-[0_0_50px_-5px_var(--gold-glow)] transition-all whitespace-nowrap"
            >
              Plan with AI{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
