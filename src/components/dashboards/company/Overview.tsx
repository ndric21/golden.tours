import { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  MapPin,
  MessageSquare,
  TrendingUp,
  Users,
  Package,
  Star,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { bookingStore, enquiryStore, customerStore, paymentStore, reviewStore, packageStore } from "@/lib/store";
import type { Booking, Enquiry, CustomerProfile, Payment, Review } from "@/lib/store";
import type { CompanySection } from "../CompanyDashboard";

function EmptyState({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof DollarSign;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-white/20" />
      </div>
      <p className="text-sm font-medium text-white/50">{title}</p>
      <p className="text-xs text-white/25 mt-1 max-w-xs">{sub}</p>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  onClick,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""} ${color}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-2 tabular-nums">{value}</p>
          {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
        </div>
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      {onClick && (
        <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
      )}
    </div>
  );
}

interface OverviewProps {
  setSection: (s: CompanySection) => void;
}

export function Overview({ setSection }: OverviewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [packageCount, setPackageCount] = useState(0);

  useEffect(() => {
    const load = () => {
      bookingStore.getAll().then(setBookings).catch(console.error);
      enquiryStore.getAll().then(setEnquiries).catch(console.error);
      customerStore.getAll().then(setCustomers).catch(console.error);
      paymentStore.getAll().then(setPayments).catch(console.error);
      reviewStore.getAll().then(setReviews).catch(console.error);
      packageStore.getAll().then((p) => setPackageCount(p.length)).catch(console.error);
    };
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const confirmedRevenue = bookings
    .filter((b) => ["confirmed", "paid", "completed"].includes(b.status))
    .reduce((sum, b) => sum + b.amount, 0);

  const displayRevenue = totalRevenue > 0 ? totalRevenue : confirmedRevenue;

  const activeTrips = bookings.filter((b) => {
    if (!["confirmed", "paid"].includes(b.status)) return false;
    return new Date(b.startDate) >= new Date();
  }).length;

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  // Top destinations from bookings
  const destMap: Record<string, number> = {};
  bookings.forEach((b) => {
    destMap[b.destination] = (destMap[b.destination] || 0) + 1;
  });
  const topDestinations = Object.entries(destMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxBookings = topDestinations[0]?.[1] || 1;

  const hasAnyData = bookings.length > 0 || customers.length > 0 || enquiries.length > 0;

  const recentActivity = [
    ...bookings.slice(0, 3).map((b) => ({
      type: "booking",
      text: `${b.userName} booked ${b.destination}`,
      time: b.createdAt,
      color: "text-amber-400",
    })),
    ...enquiries
      .filter((e) => e.status === "new")
      .slice(0, 2)
      .map((e) => ({
        type: "enquiry",
        text: `New enquiry from ${e.userName}`,
        time: e.createdAt,
        color: "text-blue-400",
      })),
    ...customers.slice(0, 2).map((c) => ({
      type: "customer",
      text: `${c.name} joined as a traveler`,
      time: c.joinedAt,
      color: "text-green-400",
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${displayRevenue.toLocaleString()}`}
          sub="From confirmed bookings"
          color="bg-gradient-to-br from-amber-500/15 to-yellow-600/5 border-amber-500/20"
          onClick={() => setSection("payments")}
        />
        <KPICard
          icon={Calendar}
          label="Total Bookings"
          value={bookings.length}
          sub={`${bookings.filter((b) => b.status === "pending").length} pending review`}
          color="bg-gradient-to-br from-blue-500/15 to-blue-600/5 border-blue-500/20"
          onClick={() => setSection("bookings")}
        />
        <KPICard
          icon={MapPin}
          label="Active Trips"
          value={activeTrips}
          sub="Confirmed upcoming trips"
          color="bg-gradient-to-br from-emerald-500/15 to-green-600/5 border-emerald-500/20"
          onClick={() => setSection("bookings")}
        />
        <KPICard
          icon={MessageSquare}
          label="New Enquiries"
          value={newEnquiries}
          sub="Awaiting your response"
          color="bg-gradient-to-br from-purple-500/15 to-violet-600/5 border-purple-500/20"
          onClick={() => setSection("enquiries")}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: Users,
            label: "Customers",
            value: customers.length,
            section: "customers" as CompanySection,
            color: "text-sky-400",
          },
          {
            icon: Star,
            label: "Reviews",
            value: reviews.length,
            section: "reviews" as CompanySection,
            color: "text-yellow-400",
          },
          {
            icon: Package,
            label: "Tour Packages",
            value: packageCount,
            section: "packages" as CompanySection,
            color: "text-pink-400",
          },
        ].map((m) => (
          <button
            key={m.label}
            onClick={() => setSection(m.section)}
            className="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 text-left"
          >
            <m.icon className={`h-5 w-5 ${m.color} mb-2`} />
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{m.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Top Destinations</h3>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          {topDestinations.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No bookings yet"
              sub="Destinations will appear here as customers make bookings"
            />
          ) : (
            <div className="space-y-3">
              {topDestinations.map(([dest, count]) => (
                <div key={dest}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/70">{dest}</span>
                    <span className="text-xs font-semibold text-white">
                      {count} booking{count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                      style={{ width: `${(count / maxBookings) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <Clock className="h-4 w-4 text-white/30" />
          </div>
          {recentActivity.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No activity yet"
              sub="Your dashboard will populate as customers interact with your platform"
            />
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      item.type === "booking"
                        ? "bg-amber-400"
                        : item.type === "enquiry"
                          ? "bg-blue-400"
                          : "bg-green-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">
                      {new Date(item.time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!hasAnyData && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <p className="text-sm font-semibold text-amber-400 mb-1">Your dashboard is ready</p>
          <p className="text-xs text-white/40">
            Data will appear here in real-time as customers register, book trips, and interact with
            your AI assistant. Start by adding tour packages to attract travelers.
          </p>
        </div>
      )}
    </div>
  );
}
