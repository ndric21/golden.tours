import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { companyDestinationStore, type CompanyDestination as Destination } from "@/lib/store";

export function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentDest, setCurrentDest] = useState<Partial<Destination>>({});
  const [error, setError] = useState("");

  const refresh = () => companyDestinationStore.getAll().then(setDestinations).catch(console.error);
  useEffect(() => {
    refresh();
  }, []);

  const handleSave = async () => {
    if (!currentDest.name || !currentDest.country) return;
    setError("");

    try {
      if (currentDest.id) {
        await companyDestinationStore.update(currentDest.id, currentDest);
      } else {
        await companyDestinationStore.add({
          name: currentDest.name,
          country: currentDest.country,
          description: currentDest.description || "",
          imageUrl: currentDest.imageUrl,
        });
      }
      await refresh();
      setIsEditing(false);
      setCurrentDest({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save destination.");
    }
  };

  const handleDelete = async (id: string) => {
    await companyDestinationStore.delete(id);
    refresh();
  };

  const filtered = destinations.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()),
  );

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            {currentDest.id ? "Edit Destination" : "Add New Destination"}
          </h3>

          <div className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Destination Name *</label>
                <input
                  value={currentDest.name || ""}
                  onChange={(e) => setCurrentDest({ ...currentDest, name: e.target.value })}
                  placeholder="e.g. Serengeti National Park"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Country *</label>
                <input
                  value={currentDest.country || ""}
                  onChange={(e) => setCurrentDest({ ...currentDest, country: e.target.value })}
                  placeholder="e.g. Tanzania"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Image URL</label>
              <input
                value={currentDest.imageUrl || ""}
                onChange={(e) => setCurrentDest({ ...currentDest, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Description</label>
              <textarea
                value={currentDest.description || ""}
                onChange={(e) => setCurrentDest({ ...currentDest, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentDest({});
              }}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!currentDest.name || !currentDest.country}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Save Destination
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40"
          />
        </div>
        <button
          onClick={() => {
            setCurrentDest({});
            setIsEditing(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Add Destination
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-white/20" />
          </div>
          <p className="text-sm text-white/40">No destinations found</p>
          <button
            onClick={() => {
              setCurrentDest({});
              setIsEditing(true);
            }}
            className="mt-4 text-sm text-amber-400 hover:underline"
          >
            Create your first destination
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors"
            >
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                {d.imageUrl ? (
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-white/10" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setCurrentDest(d);
                      setIsEditing(true);
                    }}
                    className="p-1.5 bg-black/50 backdrop-blur rounded-lg text-white/70 hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 bg-black/50 backdrop-blur rounded-lg text-red-400/70 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white truncate">{d.name}</h3>
                <p className="text-[10px] text-amber-400 font-medium uppercase tracking-wider mt-1">
                  {d.country}
                </p>
                <p className="text-xs text-white/40 mt-2 line-clamp-2">
                  {d.description || "No description provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
