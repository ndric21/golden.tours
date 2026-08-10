import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  X,
  FileText,
  User,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react";
import { bookingStore, type Booking, type BookingStatus } from "@/lib/store";

const STATUS_STYLES: Record<
  BookingStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  pending: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
    label: "Pending",
  },
  confirmed: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
    label: "Confirmed",
  },
  paid: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400", label: "Paid" },
  completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    label: "Completed",
  },
  cancelled: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function BookingDetailModal({
  booking,
  onClose,
  onUpdate,
}: {
  booking: Booking;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Booking>) => Promise<void>;
}) {
  const [notes, setNotes] = useState(booking.notes || "");
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onUpdate(booking.id, { status, notes });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Booking Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: User, label: "Customer", value: booking.userName },
              { icon: MapPin, label: "Destination", value: booking.destination },
              {
                icon: Calendar,
                label: "Start Date",
                value: new Date(booking.startDate).toLocaleDateString(),
              },
              {
                icon: Calendar,
                label: "End Date",
                value: new Date(booking.endDate).toLocaleDateString(),
              },
              {
                icon: Users,
                label: "Guests",
                value: `${booking.guests} traveler${booking.guests > 1 ? "s" : ""}`,
              },
              {
                icon: DollarSign,
                label: "Amount",
                value: `${booking.currency || "$"}${booking.amount.toLocaleString()}`,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="space-y-1">
                <p className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  {label}
                </p>
                <p className="text-sm text-white font-medium">{value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-white/30 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              {(["pending", "confirmed", "paid", "completed", "cancelled"] as BookingStatus[]).map(
                (s) => (
                  <option key={s} value={s} className="bg-[#141414]">
                    {STATUS_STYLES[s].label}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-white/30 uppercase tracking-wider">
              Admin Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  const refresh = () => bookingStore.getAll().then(setBookings).catch(console.error);
  useEffect(() => {
    refresh();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdate = async (id: string, updates: Partial<Booking>) => {
    await bookingStore.update(id, updates);
    refresh();
  };

  const quickStatus = async (id: string, status: BookingStatus) => {
    await bookingStore.update(id, { status });
    refresh();
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or destination..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
            className="pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40 appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[#141414]">
              All Status
            </option>
            {(["pending", "confirmed", "paid", "completed", "cancelled"] as BookingStatus[]).map(
              (s) => (
                <option key={s} value={s} className="bg-[#141414]">
                  {STATUS_STYLES[s].label}
                </option>
              ),
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3">
        {(["all", "pending", "confirmed", "paid", "completed", "cancelled"] as const)
          .slice(0, 5)
          .map((s) => {
            const count =
              s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s as BookingStatus | "all")}
                className={`rounded-xl p-3 text-center border transition-all ${statusFilter === s ? "border-amber-500/40 bg-amber-500/10" : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"}`}
              >
                <p className="text-lg font-bold text-white">{count}</p>
                <p className="text-[10px] text-white/40 capitalize mt-0.5">
                  {s === "all" ? "Total" : STATUS_STYLES[s as BookingStatus].label}
                </p>
              </button>
            );
          })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-sm text-white/40">
              {bookings.length === 0 ? "No bookings yet" : "No bookings match your filters"}
            </p>
            <p className="text-xs text-white/20 mt-1">
              {bookings.length === 0
                ? "Bookings will appear here when customers make reservations"
                : "Try adjusting your search or filter"}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                  {[
                    "Customer",
                    "Destination",
                    "Dates",
                    "Guests",
                    "Amount",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{b.userName}</p>
                      <p className="text-xs text-white/30">{b.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70">{b.destination}</td>
                    <td className="px-4 py-3 text-xs text-white/50">
                      {new Date(b.startDate).toLocaleDateString()} →{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70">{b.guests}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-400">
                      {b.currency || "$"}
                      {b.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(b)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="View / Edit"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {b.status === "pending" && (
                          <button
                            onClick={() => quickStatus(b.id, "confirmed")}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {b.status !== "cancelled" && b.status !== "completed" && (
                          <button
                            onClick={() => quickStatus(b.id, "cancelled")}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
