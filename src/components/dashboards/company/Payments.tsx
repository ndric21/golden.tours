import { useState, useEffect } from "react";
import { CreditCard, Search, DollarSign, Download, ExternalLink } from "lucide-react";
import { paymentStore, type Payment } from "@/lib/store";

export function PaymentsSection() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    paymentStore.getAll().then(setPayments).catch(console.error);
  }, []);

  const filtered = payments.filter(
    (p) =>
      !search ||
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCollected = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-600/5 border border-emerald-500/20">
          <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider mb-1">
            Total Collected
          </p>
          <p className="text-2xl font-bold text-emerald-400">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Transactions</p>
          <p className="text-2xl font-bold text-white">{payments.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
          <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or reference ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-amber-500/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
          <CreditCard className="h-8 w-8 text-white/20 mb-4" />
          <p className="text-sm text-white/40">No transactions found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                  {["Date", "Reference", "Customer", "Method", "Amount", "Status"].map((h) => (
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
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-white/5 hover:bg-white/[0.03] ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}`}
                  >
                    <td className="px-4 py-3 text-xs text-white/50">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-white/40">{p.reference}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{p.userName}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/60 capitalize">
                      {p.method.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">
                      ${p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-medium capitalize ${
                          p.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : p.status === "refunded"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
