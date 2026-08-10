import { useState, useEffect } from "react";
import { BarChart2, TrendingUp, Users, Calendar } from "lucide-react";
import { bookingStore, customerStore, type Booking, type CustomerProfile } from "@/lib/store";

export function ReportsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);

  useEffect(() => {
    bookingStore.getAll().then(setBookings).catch(console.error);
    customerStore.getAll().then(setCustomers).catch(console.error);
  }, []);

  const totalRevenue = bookings
    .filter((b) => ["confirmed", "paid", "completed"].includes(b.status))
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-400",
          },
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: Calendar,
            color: "text-blue-400",
          },
          {
            label: "Completed Trips",
            value: bookings.filter((b) => b.status === "completed").length,
            icon: CheckCircle,
            color: "text-amber-400",
          },
          {
            label: "Total Customers",
            value: customers.length,
            icon: Users,
            color: "text-purple-400",
          },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
        <BarChart2 className="h-12 w-12 text-white/10 mb-4" />
        <p className="text-sm text-white/40">Advanced Reporting</p>
        <p className="text-xs text-white/20 mt-1 max-w-md">
          Detailed analytics, revenue charts, and seasonal trend reports will populate here once
          enough historical data is gathered.
        </p>
      </div>
    </div>
  );
}

// Inline CheckCircle icon for Reports section to avoid importing from non-existent path
function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
