import { useState, useEffect } from "react";
import { Mail, Search, CheckCircle, Clock, XCircle, ArrowRight, Bot } from "lucide-react";
import { enquiryStore, type Enquiry, type EnquiryStatus } from "@/lib/store";

export function EnquiriesSection() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "all">("all");

  const refresh = () => enquiryStore.getAll().then(setEnquiries).catch(console.error);
  useEffect(() => {
    refresh();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<Enquiry>) => {
    await enquiryStore.update(id, updates);
    refresh();
  };

  const filtered = enquiries.filter(
    (e) =>
      (!search ||
        e.userName.toLowerCase().includes(search.toLowerCase()) ||
        e.userEmail.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || e.status === statusFilter),
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/40 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EnquiryStatus | "all")}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/40 outline-none appearance-none cursor-pointer"
        >
          <option value="all" className="bg-[#141414]">
            All Enquiries
          </option>
          <option value="new" className="bg-[#141414]">
            New
          </option>
          <option value="reviewed" className="bg-[#141414]">
            Under Review
          </option>
          <option value="converted" className="bg-[#141414]">
            Converted
          </option>
          <option value="closed" className="bg-[#141414]">
            Closed
          </option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
          <Mail className="h-8 w-8 text-white/20 mb-4" />
          <p className="text-sm text-white/40">No enquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{e.userName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                        e.status === "new"
                          ? "bg-blue-500/10 text-blue-400"
                          : e.status === "converted"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : e.status === "closed"
                              ? "bg-white/5 text-white/40"
                              : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {e.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {e.userEmail}
                  </p>

                  {(e.destination || e.budget) && (
                    <div className="mt-3 flex gap-3 text-xs">
                      {e.destination && (
                        <span className="text-white/60">
                          Dest: <span className="text-white">{e.destination}</span>
                        </span>
                      )}
                      {e.budget && (
                        <span className="text-white/60">
                          Budget: <span className="text-white">{e.budget}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {e.adminNotes && (
                    <div className="mt-3 p-2 rounded-lg bg-black/20 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                        Admin Notes
                      </p>
                      <p className="text-xs text-white/70">{e.adminNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
                  <p className="text-[10px] text-white/30 text-right sm:mb-2 flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" /> {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                  {e.status === "new" && (
                    <button
                      onClick={() => handleUpdate(e.id, { status: "reviewed" })}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {e.status === "reviewed" && (
                    <>
                      <button
                        onClick={() => handleUpdate(e.id, { status: "converted" })}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Convert to Booking
                      </button>
                      <button
                        onClick={() => handleUpdate(e.id, { status: "closed" })}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 text-xs font-medium transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
