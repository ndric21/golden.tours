import { useState, useEffect } from "react";
import { Package, Plus, Edit2, Trash2, Search, DollarSign, Clock, Users } from "lucide-react";
import { packageStore, type TourPackage } from "@/lib/store";

export function PackagesSection() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPkg, setCurrentPkg] = useState<Partial<TourPackage>>({});

  const refresh = () => packageStore.getAll().then(setPackages).catch(console.error);
  useEffect(() => {
    refresh();
  }, []);

  const handleSave = async () => {
    if (!currentPkg.name || !currentPkg.destination || !currentPkg.price) return;

    if (currentPkg.id) {
      await packageStore.update(currentPkg.id, currentPkg);
    } else {
      await packageStore.add({
        name: currentPkg.name,
        destination: currentPkg.destination,
        price: currentPkg.price,
        priceTo: currentPkg.priceTo ?? currentPkg.price,
        currency: currentPkg.currency || "USD",
        duration: currentPkg.duration || 1,
        maxGroupSize: currentPkg.maxGroupSize || 2,
        isActive: currentPkg.isActive !== undefined ? currentPkg.isActive : true,
        category: currentPkg.category || "safari",
        difficulty: currentPkg.difficulty || "easy",
        description: currentPkg.description || "",
        inclusions: currentPkg.inclusions || [],
        exclusions: currentPkg.exclusions || [],
        itinerary: currentPkg.itinerary || "",
        highlights: currentPkg.highlights || [],
        imageUrl: currentPkg.imageUrl,
      });
    }

    refresh();
    setIsEditing(false);
    setCurrentPkg({});
  };

  const handleDelete = async (id: string) => {
    await packageStore.delete(id);
    refresh();
  };

  const filtered = packages.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase()),
  );

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up pb-10">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            {currentPkg.id ? "Edit Tour Package" : "Create Tour Package"}
          </h3>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Package Name *</label>
                <input
                  value={currentPkg.name || ""}
                  onChange={(e) => setCurrentPkg({ ...currentPkg, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Destination *</label>
                <input
                  value={currentPkg.destination || ""}
                  onChange={(e) => setCurrentPkg({ ...currentPkg, destination: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Price *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="number"
                    value={currentPkg.price || ""}
                    onChange={(e) =>
                      setCurrentPkg({ ...currentPkg, price: Number(e.target.value) })
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Duration (Days)</label>
                <input
                  type="number"
                  value={currentPkg.duration || ""}
                  onChange={(e) =>
                    setCurrentPkg({ ...currentPkg, duration: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Image URL</label>
              <input
                value={currentPkg.imageUrl || ""}
                onChange={(e) => setCurrentPkg({ ...currentPkg, imageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Description</label>
              <textarea
                value={currentPkg.description || ""}
                onChange={(e) => setCurrentPkg({ ...currentPkg, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:border-amber-500/50 outline-none resize-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentPkg.isActive !== false}
                onChange={(e) => setCurrentPkg({ ...currentPkg, isActive: e.target.checked })}
                className="rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-500/50"
              />
              <span className="text-sm text-white">Active Package (visible to customers)</span>
            </label>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentPkg({});
              }}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!currentPkg.name || !currentPkg.destination || !currentPkg.price}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Save Package
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
            placeholder="Search packages..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/40"
          />
        </div>
        <button
          onClick={() => {
            setCurrentPkg({});
            setIsEditing(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Create Package
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-white/20" />
          </div>
          <p className="text-sm text-white/40">No packages found</p>
          <button
            onClick={() => {
              setCurrentPkg({});
              setIsEditing(true);
            }}
            className="mt-4 text-sm text-amber-400 hover:underline"
          >
            Create your first package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-colors ${p.isActive ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-white/5 bg-transparent opacity-60"}`}
            >
              <div className="h-24 w-full sm:w-32 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-white/10" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">{p.name}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setCurrentPkg(p);
                        setIsEditing(true);
                      }}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-amber-400 font-medium uppercase tracking-wider mt-0.5">
                  {p.destination}
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" /> {p.price.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {p.duration} Days
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Max {p.maxGroupSize}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
