import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  X,
  Users,
  History,
} from "lucide-react";
import { customerStore, bookingStore, type CustomerProfile, type Booking } from "@/lib/store";

function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: CustomerProfile;
  onClose: () => void;
}) {
  const [history, setHistory] = useState<Booking[]>([]);

  useEffect(() => {
    bookingStore.getByUser(customer.id).then(setHistory).catch(console.error);
  }, [customer.id]);

  const totalSpent = history
    .filter((b) => ["confirmed", "paid", "completed"].includes(b.status))
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in-up overflow-y-auto">
      <div className="w-full max-w-2xl my-auto bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col mt-10 mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0 sticky top-0 bg-[#141414]/95 backdrop-blur z-10">
          <h3 className="text-sm font-semibold text-white">Customer Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/5 flex-shrink-0">
              {customer.avatarUrl ? (
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-amber-500">
                  {customer.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{customer.name}</h2>
              <p className="text-sm text-white/50 mt-1 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> {customer.email}
              </p>
              <p className="text-xs text-white/30 mt-1 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Joined{" "}
                {new Date(customer.joinedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-white">{history.length}</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                Lifetime Value
              </p>
              <p className="text-2xl font-bold text-amber-400">${totalSpent.toLocaleString()}</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-white/40" />
            Booking History
          </h4>

          {history.length === 0 ? (
            <div className="text-center py-8 border border-white/5 rounded-xl bg-white/[0.01]">
              <p className="text-sm text-white/30">No bookings found for this customer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{b.destination}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A"} →{" "}
                      {b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-white/70">${b.amount.toLocaleString()}</span>
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-medium capitalize ${
                        b.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : b.status === "cancelled"
                            ? "bg-red-500/10 text-red-400"
                            : b.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomersSection() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    customerStore.getAll().then(setCustomers).catch(console.error);
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-white/20" />
          </div>
          <p className="text-sm text-white/40">
            {customers.length === 0 ? "No customers yet" : "No customers match your search"}
          </p>
          <p className="text-xs text-white/20 mt-1">
            {customers.length === 0
              ? "Customers will appear here when they register"
              : "Try a different search term"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className="group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white/50 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    c.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-white/40 truncate mt-0.5">{c.email}</p>
                  <p className="text-[10px] text-white/20 mt-2">
                    Joined {new Date(c.joinedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-white/10 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
