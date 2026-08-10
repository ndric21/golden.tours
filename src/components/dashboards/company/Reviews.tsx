import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Search, MessageSquare } from "lucide-react";
import { reviewStore, type Review } from "@/lib/store";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");

  const refresh = () => reviewStore.getAll().then(setReviews).catch(console.error);
  useEffect(() => {
    refresh();
  }, []);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    await reviewStore.update(id, { status });
    refresh();
  };

  const filtered = reviews.filter(
    (r) =>
      !search ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-amber-500/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
          <Star className="h-8 w-8 text-white/20 mb-4" />
          <p className="text-sm text-white/40">No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{r.title}</h3>
                    <p className="text-xs text-white/40">
                      {r.userName} • {r.destination}
                    </p>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < r.rating ? "fill-current" : "text-white/10"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/70 italic mb-4">"{r.comment}"</p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-medium capitalize ${
                    r.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : r.status === "rejected"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {r.status}
                </span>

                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(r.id, "approved")}
                      className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStatus(r.id, "rejected")}
                      className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
