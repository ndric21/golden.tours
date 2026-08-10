import { X, MapPin, Star, Calendar, CheckCircle2, Heart } from "lucide-react";
import { Destination } from "@/lib/destinations";
import { useState, useEffect } from "react";
import { BookingModal } from "./BookingModal";
import { useLanguage } from "@/lib/i18n";
import { favoriteStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-provider";

interface Props {
  destination: Destination;
  onClose: () => void;
}

export function DestinationDetailsModal({ destination, onClose }: Props) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    favoriteStore
      .getDestinationIds(user.id)
      .then((ids) => setIsFavorite(ids.has(destination.id)))
      .catch(console.error);
  }, [user, destination.id]);

  const toggleFavorite = async () => {
    if (!user || favoriteBusy) return;
    setFavoriteBusy(true);
    try {
      if (isFavorite) {
        await favoriteStore.removeDestination(user.id, destination.id);
      } else {
        await favoriteStore.addDestination(user.id, destination.id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    } finally {
      setFavoriteBusy(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" 
          onClick={onClose} 
        />
        <div className="relative bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row animate-in slide-in-from-bottom-8">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column - Images */}
          <div className="w-full sm:w-1/2 h-[300px] sm:h-auto flex flex-col bg-black">
            <div className="relative flex-1 overflow-hidden">
              <img 
                src={destination.images[activeImage] || destination.image} 
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
            {/* Image Thumbnails */}
            <div className="flex gap-2 p-2 overflow-x-auto bg-black/90">
              {destination.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${destination.name} ${i+1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full sm:w-1/2 overflow-y-auto p-6 sm:p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest mb-3">
                <MapPin className="h-3.5 w-3.5" /> {destination.country}
                <span className="text-muted-foreground ml-2">•</span>
                <span className="flex items-center ml-2">
                  <Star className="h-3.5 w-3.5 fill-current mr-1" /> {destination.rating}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{destination.name}</h2>
              <p className="text-sm text-gold/80 font-medium">{destination.tag}</p>
            </div>

            <div className="prose prose-sm dark:prose-invert mb-8 text-muted-foreground leading-relaxed">
              <p>{destination.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">{t("modal.highlights")}</h3>
              <ul className="grid grid-cols-1 gap-3">
                {destination.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="flex-1 py-4 rounded-xl bg-gradient-gold text-primary-foreground font-bold shadow-gold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" /> {t("modal.book_btn")}
                </button>
                {user && (
                  <button
                    onClick={toggleFavorite}
                    disabled={favoriteBusy}
                    title={isFavorite ? "Remove from favorites" : "Save to favorites"}
                    className={`px-4 rounded-xl border transition-colors flex items-center justify-center ${
                      isFavorite
                        ? "border-rose-400/40 bg-rose-500/10 text-rose-400"
                        : "border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-gold"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal 
          prefilledDestination={destination} 
          onClose={() => setIsBookingOpen(false)} 
          onSuccess={onClose}
        />
      )}
    </>
  );
}
