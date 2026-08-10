import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Users, MapPin, CheckCircle2, Building2 } from "lucide-react";
import { Destination, getPackages, Package } from "@/lib/destinations";
import { bookingStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-provider";
import { useLanguage } from "@/lib/i18n";

interface Props {
  prefilledDestination?: Destination;
  prefilledPackageId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CompanyOption {
  id: string;
  name: string;
}

export function BookingModal({ prefilledDestination, prefilledPackageId, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [packages, setPackages] = useState<Package[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);

  const [selectedDestination, setSelectedDestination] = useState<string>(prefilledDestination?.name || "");
  const [selectedPackage, setSelectedPackage] = useState<string>(prefilledPackageId || "");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getPackages().then(setPackages).catch(console.error);
    supabase
      .from("companies")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCompanies(data ?? []));
  }, []);

  const relevantPackages = packages.filter(
    (p) => !selectedDestination || p.destination.includes(selectedDestination.split(" ")[0])
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !user) return;
    setSubmitting(true);
    setError("");

    try {
      const pkg = packages.find((p) => p.id === selectedPackage);
      const company = companies.find((c) => c.id === selectedCompanyId);

      await bookingStore.add({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        destination: selectedDestination || "Custom East Africa Trip",
        packageId: selectedPackage || undefined,
        packageName: pkg?.title,
        companyId: selectedCompanyId || pkg?.companyId || undefined,
        companyName: company?.name,
        startDate: date,
        endDate: new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        guests,
        amount: pkg?.priceFrom || 2500,
        currency: "USD",
        status: "pending",
        notes,
      });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-card w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground mb-6">Please log in to book a trip.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl border border-gold text-gold font-bold hover:bg-gold/10 transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-accent/30">
          <h2 className="text-xl font-bold text-gradient-gold">
            {step === 1 ? t("book.title") : t("book.confirmed")}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              {error && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">
                  {error}
                </div>
              )}

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{t("book.destination")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                  <input
                    type="text"
                    required
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    placeholder={t("book.destination_placeholder")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{t("book.package")}</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors appearance-none"
                >
                  <option value="">{t("book.custom_package")}</option>
                  {(relevantPackages.length > 0 ? relevantPackages : packages).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Selection */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Tour Operator / Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors appearance-none"
                  >
                    <option value="">Any Available Operator</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{t("book.start_date")}</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{t("book.travelers")}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                    <input
                      type="number"
                      min="1"
                      required
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">{t("book.requests")}</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("book.requests_placeholder")}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors resize-none"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-gold text-primary-foreground font-bold shadow-gold hover:-translate-y-0.5 transition-transform disabled:opacity-60"
            >
              {submitting ? "Booking…" : t("book.btn.confirm")}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t("book.success.title")}</h3>
            <p className="text-muted-foreground mb-8">
              {t("book.success.desc")}
            </p>
            <button
              onClick={() => {
                onClose();
                onSuccess?.();
              }}
              className="w-full py-3.5 rounded-xl border border-gold text-gold font-bold hover:bg-gold/10 transition-colors"
            >
              {t("book.btn.back")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
