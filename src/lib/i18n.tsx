import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "sw";

export const translations: Record<string, Record<Language, string>> = {
  // Navigation & General
  "nav.home": { en: "Home", sw: "Nyumbani" },
  "nav.destinations": { en: "Destinations", sw: "Sehemu za Kusafiri" },
  "nav.mytrips": { en: "My Trips", sw: "Safari Zangu" },
  "nav.favorites": { en: "Favorites", sw: "Vipendwa" },
  "nav.ai": { en: "AI", sw: "Akili Bandia (AI)" },
  "nav.profile": { en: "Profile", sw: "Wasifu" },
  "app.title": { en: "Golden Tours", sw: "Golden Tours" },
  
  // Landing Page
  "landing.hero.title": { en: "Golden Journeys Await", sw: "Safari za Dhahabu Zinakusubiri" },
  "landing.hero.subtitle": { 
    en: "Curated AI-Powered Adventures in Tanzania & East Africa —", 
    sw: "Matukio ya Kusisimua Tanzania na Afrika Mashariki Yanayopangwa na AI —" 
  },
  "landing.hero.highlight": { en: " One Unforgettable Day at a Time.", sw: " Siku Moja Isiyosahaulika kwa Wakati." },
  "landing.start_adventure": { en: "Start Your Adventure", sw: "Anza Safari Yako" },
  "landing.explore_destinations": { en: "Explore Destinations", sw: "Gundua Sehemu za Kusafiri" },
  
  // Stats
  "stat.destinations": { en: "Curated Destinations", sw: "Sehemu Zilizochaguliwa" },
  "stat.travelers": { en: "Happy Travelers", sw: "Wasafiri Wenye Furaha" },
  "stat.rating": { en: "Average Rating", sw: "Wastani wa Ukadiriaji" },
  "stat.ai": { en: "Powered Planning", sw: "Mipango ya AI" },

  // Dashboards
  "dash.destinations.title": { en: "Explore Destinations", sw: "Gundua Sehemu za Kusafiri" },
  "dash.destinations.subtitle": { en: "Discover Tanzania & East Africa's finest locations.", sw: "Gundua maeneo bora zaidi Tanzania na Afrika Mashariki." },
  "dash.search.placeholder": { en: "Search destinations or experiences…", sw: "Tafuta sehemu au uzoefu…" },
  "dash.sort.rating": { en: "Sort by Rating", sw: "Panga kwa Ukadiriaji" },
  "dash.sort.name": { en: "Sort by Name", sw: "Panga kwa Jina" },
  "dash.showing": { en: "Showing", sw: "Inaonyesha" },
  "dash.of": { en: "of", sw: "kati ya" },
  "dash.destinations_count": { en: "destinations", sw: "sehemu" },
  "dash.btn.explore": { en: "Explore", sw: "Gundua" },

  // Destination Modal
  "modal.highlights": { en: "Highlights", sw: "Vivutio" },
  "modal.book_btn": { en: "Book Your Journey Here", sw: "Wezesha Safari Yako Hapa" },
  
  // Booking Modal
  "book.title": { en: "Book Your Journey", sw: "Wezesha Safari Yako" },
  "book.confirmed": { en: "Booking Confirmed", sw: "Safari Imethibitishwa" },
  "book.destination": { en: "Destination / Park", sw: "Sehemu / Mbuga" },
  "book.destination_placeholder": { en: "e.g. Serengeti, Diani Beach", sw: "mf. Serengeti, Diani Beach" },
  "book.package": { en: "Recommended Package", sw: "Kifurushi Kinachopendekezwa" },
  "book.custom_package": { en: "I want a custom itinerary", sw: "Nataka mpangilio wangu maalum" },
  "book.start_date": { en: "Start Date", sw: "Tarehe ya Kuanza" },
  "book.travelers": { en: "Travelers", sw: "Wasafiri" },
  "book.requests": { en: "Special Requests", sw: "Maombi Maalum" },
  "book.requests_placeholder": { en: "Any dietary requirements, celebrations, or specific animals you want to see?", sw: "Mahitaji yoyote ya chakula, sherehe, au wanyama maalum unataka kuona?" },
  "book.btn.confirm": { en: "Confirm Booking Request", sw: "Thibitisha Ombi la Safari" },
  "book.success.title": { en: "Request Received!", sw: "Ombi Limepokelewa!" },
  "book.success.desc": { en: "Your booking request has been submitted. Our concierge team will review your details and send a confirmation shortly.", sw: "Ombi lako la safari limetumwa. Timu yetu ya wahudumu itapitia maelezo yako na kutuma uthibitisho hivi karibuni." },
  "book.btn.back": { en: "Back to Destinations", sw: "Rudi kwenye Sehemu" },
  
  // Auth / Signup
  "auth.create_account": { en: "Create Account", sw: "Tengeneza Akaunti" },
  "auth.begin_journey": { en: "Begin your golden journey today", sw: "Anza safari yako ya dhahabu leo" },
  "auth.account_type": { en: "Account Type", sw: "Aina ya Akaunti" },
  "auth.traveler": { en: "Traveler", sw: "Msafiri" },
  "auth.company": { en: "Company", sw: "Kampuni" },
  "auth.fullname": { en: "Full Name", sw: "Jina Kamili" },
  "auth.email": { en: "Email", sw: "Barua Pepe" },
  "auth.password": { en: "Password", sw: "Nenosiri" },
  "auth.confirm_password": { en: "Confirm Password", sw: "Thibitisha Nenosiri" },
  "auth.btn.create": { en: "Create Account", sw: "Tengeneza Akaunti" },
  "auth.btn.creating": { en: "Creating account...", sw: "Inatengeneza akaunti..." },
  "auth.language": { en: "Language", sw: "Lugha" },
  
  // Header
  "header.welcome": { en: "Welcome", sw: "Karibu" },
};

export function getTranslation(key: string, lang: Language): string {
  const trans = translations[key];
  if (!trans) return key; // Fallback to key if not found
  return trans[lang];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children, initialLang = "en" }: { children: React.ReactNode, initialLang?: Language }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gt-language");
      return (saved === "en" || saved === "sw") ? saved : initialLang;
    }
    return initialLang;
  });

  useEffect(() => {
    localStorage.setItem("gt-language", language);
  }, [language]);

  const t = (key: string) => getTranslation(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
