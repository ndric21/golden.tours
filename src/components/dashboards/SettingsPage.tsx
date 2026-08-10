import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/i18n";
import { travelBuddyStore } from "@/lib/store";
import type { AuthUser, TravelBuddy } from "@/lib/auth";
import {
  Settings,
  Users,
  UserPlus,
  Search,
  Sun,
  Moon,
  Globe,
  Bell,
  X,
  CheckCircle2,
  User,
  Mail,
} from "lucide-react";

type Section = "account" | "buddies" | "preferences";

interface BuddyProfileModalProps {
  buddy: TravelBuddy;
  onClose: () => void;
}

function BuddyProfileModal({ buddy, onClose }: BuddyProfileModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-scale-in text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="h-20 w-20 mx-auto rounded-full border-4 border-gold/40 overflow-hidden bg-gradient-gold flex items-center justify-center mb-4 shadow-gold">
          {buddy.avatarUrl ? (
            <img src={buddy.avatarUrl} alt={buddy.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-primary-foreground">{buddy.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h3 className="text-xl font-bold">{buddy.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{buddy.email}</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-gold" />
          <span>Travel Buddy since {new Date(buddy.addedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-6 p-4 rounded-2xl bg-accent/40 border border-border text-sm text-muted-foreground">
          🌍 Fellow Golden Tours traveler
        </div>
      </div>
    </div>
  );
}

export function SettingsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user, refreshProfile } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [section, setSection] = useState<Section>("account");
  const [buddyEmail, setBuddyEmail] = useState("");
  const [buddyMsg, setBuddyMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [viewingBuddy, setViewingBuddy] = useState<TravelBuddy | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [addingBuddy, setAddingBuddy] = useState(false);

  const buddies: TravelBuddy[] = (user as AuthUser | null)?.travelBuddies || [];

  const addBuddy = async () => {
    if (!user || !buddyEmail.trim() || addingBuddy) return;
    const email = buddyEmail.trim().toLowerCase();
    if (email === user.email.toLowerCase()) {
      setBuddyMsg({ text: "You can't add yourself as a buddy.", ok: false });
      return;
    }
    if (buddies.find((b) => b.email.toLowerCase() === email)) {
      setBuddyMsg({ text: "This person is already your travel buddy.", ok: false });
      return;
    }

    setAddingBuddy(true);
    try {
      await travelBuddyStore.add(user.id, email);
      await refreshProfile();
      setBuddyEmail("");
      setBuddyMsg({ text: `Added as a travel buddy! ✈️`, ok: true });
    } catch (err) {
      setBuddyMsg({ text: err instanceof Error ? err.message : "Failed to add travel buddy.", ok: false });
    } finally {
      setAddingBuddy(false);
      setTimeout(() => setBuddyMsg(null), 3500);
    }
  };

  const removeBuddy = async (buddyId: string) => {
    if (!user) return;
    await travelBuddyStore.remove(user.id, buddyId);
    await refreshProfile();
  };

  const sections: { id: Section; label: string; icon: typeof Settings }[] = [
    { id: "account", label: "Account", icon: User },
    { id: "buddies", label: "Travel Buddies", icon: Users },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-slide-up">
      {viewingBuddy && <BuddyProfileModal buddy={viewingBuddy} onClose={() => setViewingBuddy(null)} />}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left nav */}
        <div className="lg:w-60 flex-shrink-0">
          <div className="bg-card border border-border rounded-2xl p-3 space-y-1 sticky top-24">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  section === s.id
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
                {s.id === "buddies" && buddies.length > 0 && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${section === s.id ? "bg-white/30" : "bg-gold/20 text-gold"}`}>
                    {buddies.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {/* Account Section */}
          {section === "account" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold mb-2">Account Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your profile information and credentials.</p>
              <div className="space-y-3">
                {[
                  { label: "Display Name", value: user?.name, icon: User },
                  { label: "Email Address", value: user?.email, icon: Mail },
                  { label: "Account Type", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "", icon: Settings },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate?.("Profile")}
                className="w-full py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold hover:-translate-y-0.5 transition-transform shadow-gold"
              >
                Edit Profile & Change Password
              </button>
            </div>
          )}

          {/* Travel Buddies Section */}
          {section === "buddies" && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-1">Travel Buddies</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Add friends by email. Travel buddies can see each other's profiles.
                </p>

                {/* Add buddy form */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={buddyEmail}
                      onChange={(e) => setBuddyEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addBuddy()}
                      placeholder="Enter buddy's email address..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors text-sm"
                    />
                  </div>
                  <button
                    onClick={addBuddy}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-gold text-primary-foreground rounded-xl font-semibold hover:-translate-y-0.5 transition-transform shadow-gold text-sm whitespace-nowrap"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {buddyMsg && (
                  <div className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl animate-fade-in
                    ${buddyMsg.ok ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                    {buddyMsg.ok ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {buddyMsg.text}
                  </div>
                )}
              </div>

              {/* Buddy cards */}
              {buddies.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                  <div className="text-5xl mb-4">✈️</div>
                  <p className="text-muted-foreground font-medium">No travel buddies yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Add friends above to start exploring together!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {buddies.map((buddy, i) => (
                    <div
                      key={buddy.id}
                      className="bg-card border border-border rounded-2xl p-4 hover:border-gold/40 hover:shadow-gold transition-all animate-fade-slide-up"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-lg overflow-hidden flex-shrink-0">
                          {buddy.avatarUrl ? (
                            <img src={buddy.avatarUrl} alt={buddy.name} className="h-full w-full object-cover" />
                          ) : (
                            buddy.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{buddy.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{buddy.email}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => setViewingBuddy(buddy)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-gold/10 text-gold font-semibold hover:bg-gold/20 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => removeBuddy(buddy.id)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preferences Section */}
          {section === "preferences" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 animate-fade-in">
              <h3 className="text-lg font-bold mb-2">Preferences</h3>

              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon className="h-5 w-5 text-gold" /> : <Sun className="h-5 w-5 text-gold" />}
                  <div>
                    <p className="font-medium text-sm">Appearance</p>
                    <p className="text-xs text-muted-foreground capitalize">{theme} mode</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-gold" : "bg-border"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${theme === "dark" ? "left-6" : "left-0.5"}`} />
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-medium text-sm">Language</p>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "English" : "Kiswahili"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                  className="px-4 py-1.5 rounded-lg bg-gradient-gold text-primary-foreground text-xs font-bold hover:-translate-y-0.5 transition-transform shadow-gold"
                >
                  {language === "en" ? "Switch to SW" : "Switch to EN"}
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-medium text-sm">Notifications</p>
                    <p className="text-xs text-muted-foreground">Booking updates & travel tips</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifications ? "bg-gold" : "bg-border"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${notifications ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
