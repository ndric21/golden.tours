import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Plus,
  CheckCircle,
  Clock,
  Plane,
  Filter,
} from "lucide-react";
import { bookingStore, type Booking, type BookingStatus } from "@/lib/store";
import { useAuth } from "@/lib/auth-provider";

const statusConfig: Record<BookingStatus, { cls: string; icon: React.ReactNode }> = {
  pending: {
    cls: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  confirmed: {
    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: <Plane className="h-3.5 w-3.5" />,
  },
  paid: {
    cls: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  completed: {
    cls: "bg-gold/10 text-gold border-gold/20",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <Filter className="h-3.5 w-3.5" />,
  },
};

const allStatuses: (BookingStatus | "all")[] = [
  "all",
  "pending",
  "confirmed",
  "paid",
  "completed",
  "cancelled",
];

export function TripsDashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [myTrips, setMyTrips] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      bookingStore.getByUser(user.id).then(setMyTrips).catch(console.error);
    }
  }, [user]);

  const filtered = filter === "all" ? myTrips : myTrips.filter((t) => t.status === filter);

  const totalSpent = myTrips
    .filter((t) => ["completed", "paid", "confirmed"].includes(t.status))
    .reduce((s, t) => s + t.amount, 0);
  const totalGuests = myTrips.reduce((s, t) => s + t.guests, 0);

  // Calculate total days
  const totalDays = myTrips.reduce((s, t) => {
    const days = Math.ceil(
      (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    return s + (days > 0 ? days : 1);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Trips", value: String(myTrips.length), gold: false },
          { label: "Days Traveled", value: String(totalDays), gold: false },
          { label: "Total Guests", value: String(totalGuests), gold: false },
          { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, gold: true },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-gold hover:border-gold/30 transition-all"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.gold ? "text-gold" : ""}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-card border border-border rounded-xl gap-1 flex-wrap">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                ${filter === s ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:text-gold"}`}
            >
              {s}{" "}
              <span className="ml-1 opacity-70">
                ({s === "all" ? myTrips.length : myTrips.filter((t) => t.status === s).length})
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => onNavigate?.("AI")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-gold transition-all"
        >
          <Plus className="h-4 w-4" /> Plan New Trip
        </button>
      </div>

      {/* Trips Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/40">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Destination
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Dates
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                  Guests
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No trips found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const sc = statusConfig[t.status];
                  const days =
                    Math.ceil(
                      (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) || 1;
                  return (
                    <tr key={t.id} className="hover:bg-accent/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-semibold group-hover:text-gold transition-colors">
                          {t.destination}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          #{t.id.slice(-6)} · {days}d
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 text-gold" />{" "}
                          {new Date(t.startDate).toLocaleDateString()} –{" "}
                          {new Date(t.endDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" /> {t.guests}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${sc.cls}`}
                        >
                          {sc.icon} {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-gold">${t.amount.toLocaleString()}</p>
                        <button className="text-[11px] text-muted-foreground hover:text-gold flex items-center gap-0.5 ml-auto mt-0.5 transition-colors">
                          Details <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
