import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  Camera,
  User,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Save,
  Loader2,
} from "lucide-react";

type Tab = "profile" | "security" | "danger";

function PasswordStrength({ pwd }: { pwd: string }) {
  const checks = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return pwd.length > 0 ? (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= score ? colors[score] : "bg-border"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${score < 2 ? "text-red-500" : score < 4 ? "text-yellow-500" : "text-emerald-500"}`}>
        {labels[score]}
      </p>
    </div>
  ) : null;
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl animate-fade-slide-up
        ${type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400"}`}
    >
      {type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");
  const [name, setName] = useState(user?.name || "");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
      const { error } = await supabase.from("profiles").update({ avatar_url: dataUrl }).eq("id", user.id);
      if (error) {
        showToast("Failed to update photo.", "error");
      } else {
        await refreshProfile();
        showToast("Photo updated!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInfoSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setLoading(false);
    if (error) {
      showToast(error.message, "error");
    } else {
      await refreshProfile();
      showToast("Profile updated successfully!", "success");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { showToast("Passwords do not match.", "error"); return; }
    if (newPwd.length < 8) { showToast("Password must be at least 8 characters.", "error"); return; }
    if (!user) return;
    setLoading(true);

    const { error: verifyErr } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPwd });
    if (verifyErr) {
      showToast("Current password is incorrect.", "error");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setLoading(false);
    if (error) {
      showToast(error.message, "error");
      return;
    }
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    showToast("Password changed successfully!", "success");
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-slide-up">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Avatar Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gold/20 via-accent/30 to-card border border-gold/20 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-28 w-28 rounded-full border-4 border-gold/40 overflow-hidden shadow-gold bg-accent flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gradient-gold">
                  {user?.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <Camera className="h-7 w-7 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          {/* Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold capitalize">
              {user?.role} Account
            </span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-gold"
          >
            <Camera className="h-4 w-4" />
            Change Photo
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-accent/50 rounded-2xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-gold text-primary-foreground shadow-gold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm animate-fade-in">
        {activeTab === "profile" && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold mb-4">Profile Information</h3>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-input border border-border outline-none opacity-60 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-muted-foreground">Contact support to change your login email.</p>
            </div>
            <button
              onClick={handleInfoSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary-foreground rounded-xl font-semibold hover:-translate-y-0.5 transition-transform shadow-gold disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            {/* Current password */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {/* New password */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-input border border-border focus:border-gold outline-none transition-colors"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength pwd={newPwd} />
            </div>
            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 rounded-xl bg-input border transition-colors outline-none
                  ${confirmPwd && confirmPwd !== newPwd ? "border-red-500 focus:border-red-500" : "border-border focus:border-gold"}`}
              />
              {confirmPwd && confirmPwd !== newPwd && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary-foreground rounded-xl font-semibold hover:-translate-y-0.5 transition-transform shadow-gold disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Update Password
            </button>
          </form>
        )}

        {activeTab === "danger" && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold mb-1 text-red-500">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">These actions are irreversible. Please proceed with caution.</p>
            <div className="border border-red-500/30 rounded-2xl p-5 bg-red-500/5">
              <h4 className="font-semibold text-red-500 mb-1">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently remove your account and all associated data from Golden Tours. This cannot be undone.
              </p>
              <button
                onClick={() => {
                  showToast("Please contact hello@goldentours.africa to permanently delete your account.", "error");
                }}
                className="px-5 py-2.5 rounded-xl border-2 border-red-500 text-red-500 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
