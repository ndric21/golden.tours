import {
  Users,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  LayoutGrid,
  Sparkles,
  Building2,
  Package as PackageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Recommendations } from "@/components/Recommendations";
import { Chat } from "@/components/Chat";
import { useAuth } from "@/lib/auth-provider";
import { bookingStore, type Booking, type BookingStatus } from "@/lib/store";
import { getDestinations } from "@/lib/destinations";
import { getAllCompanies } from "@/lib/companies";

const statusIcon: Record<BookingStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5 text-amber-400" />,
  confirmed: <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />,
  paid: <CheckCircle className="h-3.5 w-3.5 text-blue-400" />,
  completed: <CheckCircle className="h-3.5 w-3.5 text-sky-400" />,
  cancelled: <XCircle className="h-3.5 w-3.5 text-red-400" />,
};
const statusClass: Record<BookingStatus, string> = {
  pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  paid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function HomeDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"recs" | "chat">("recs");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [destinationCount, setDestinationCount] = useState<number | null>(null);
  const [companyStats, setCompanyStats] = useState<{ count: number; avgRating: number } | null>(null);

  useEffect(() => {
    if (user) bookingStore.getByUser(user.id).then(setMyBookings).catch(console.error);
    getDestinations().then((d) => setDestinationCount(d.length)).catch(console.error);
    getAllCompanies().then((companies) => {
      const rated = companies.filter((c) => c.rating > 0);
      setCompanyStats({
        count: companies.length,
        avgRating: rated.length ? rated.reduce((s, c) => s + c.rating, 0) / rated.length : 0,
      });
    }).catch(console.error);
  }, [user]);

  const stats = [
    {
      id: "destinations",
      label: "Destinations to Explore",
      value: destinationCount === null ? "…" : destinationCount.toString(),
      icon: MapPin,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      id: "companies",
      label: "Trusted Tour Operators",
      value: companyStats === null ? "…" : companyStats.count.toString(),
      icon: Building2,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      id: "rating",
      label: "Avg. Operator Rating",
      value: companyStats === null ? "…" : companyStats.avgRating > 0 ? companyStats.avgRating.toFixed(1) : "New",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      id: "trips",
      label: "Your Trips",
      value: myBookings.length.toString(),
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Stats Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.id}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-gold hover:border-gold/30 transition-all duration-300 group"
          >
            <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-4 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Your Recent Bookings */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold">Your Recent Bookings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your latest trips with Golden Tours</p>
          </div>
          <button
            onClick={() => onNavigate?.("My Trips")}
            className="flex items-center gap-1 text-xs font-semibold text-gold hover:gap-2 transition-all"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {myBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageIcon className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No bookings yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Use the AI Planner below to find your first East Africa adventure.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/40">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Trip
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Dates
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Guests
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myBookings.slice(0, 6).map((b) => (
                  <tr key={b.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-3.5 font-medium">{b.destination}</td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Users className="h-3 w-3" /> {b.guests}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusClass[b.status]}`}
                      >
                        {statusIcon[b.status]}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-gold">
                      ${b.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Recs / AI Tab */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Trip Planner</h2>
          <div className="inline-flex p-1 bg-card border border-border rounded-xl">
            <button
              onClick={() => setTab("recs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === "recs" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-gold"}`}
            >
              <LayoutGrid className="h-4 w-4" /> Quick Recommendations
            </button>
            <button
              onClick={() => setTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === "chat" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-gold"}`}
            >
              <Sparkles className="h-4 w-4" /> Ask AI Assistant
            </button>
          </div>
        </div>
        {tab === "recs" ? <Recommendations /> : <Chat />}
      </div>
    </div>
  );
}
