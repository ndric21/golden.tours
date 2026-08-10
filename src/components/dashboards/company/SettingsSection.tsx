import { useState, useEffect } from "react";
import { Building2, Save, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { getMyCompanyId } from "@/lib/store";

interface CompanyForm {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  logoUrl: string;
}

export function SettingsSection() {
  const { user, refreshProfile } = useAuth();
  const [company, setCompany] = useState<CompanyForm | null>(null);
  const [yourName, setYourName] = useState(user?.name || "");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ ok?: boolean; error?: string } | null>(null);

  useEffect(() => {
    getMyCompanyId().then(async (companyId) => {
      if (!companyId) return;
      const { data } = await supabase.from("companies").select("*").eq("id", companyId).single();
      if (data) {
        setCompany({
          id: data.id,
          name: data.name,
          description: data.description,
          contactEmail: data.contact_email || "",
          contactPhone: data.contact_phone || "",
          website: data.website || "",
          logoUrl: data.logo_url || "",
        });
      }
    });
  }, []);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    setStatus(null);
    try {
      const { error: companyErr } = await supabase
        .from("companies")
        .update({
          name: company.name,
          description: company.description,
          contact_email: company.contactEmail,
          contact_phone: company.contactPhone,
          website: company.website,
          logo_url: company.logoUrl || null,
        })
        .eq("id", company.id);
      if (companyErr) throw companyErr;

      if (user && yourName !== user.name) {
        const { error: profileErr } = await supabase.from("profiles").update({ full_name: yourName }).eq("id", user.id);
        if (profileErr) throw profileErr;
        await refreshProfile();
      }
      setStatus({ ok: true });
    } catch (err) {
      setStatus({ error: err instanceof Error ? err.message : "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setPasswordStatus({ error: "Password must be at least 6 characters." });
      return;
    }
    setSavingPassword(true);
    setPasswordStatus(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordStatus({ ok: true });
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordStatus({ error: err instanceof Error ? err.message : "Failed to update password." });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!company) {
    return <div className="py-16 text-center text-sm text-white/40">Loading company settings…</div>;
  }

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in-up pb-10">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Company Profile</h3>
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-6">
          {status?.ok && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Settings saved.
            </div>
          )}
          {status?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {status.error}
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-10 w-10 text-white/20" />
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-white/50 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" /> Logo URL
              </label>
              <input
                value={company.logoUrl}
                onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                placeholder="https://…"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Company Name</label>
              <input
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Contact Email</label>
              <input
                value={company.contactEmail}
                onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Phone Number</label>
              <input
                value={company.contactPhone}
                onChange={(e) => setCompany({ ...company, contactPhone: e.target.value })}
                placeholder="+255..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Website</label>
              <input
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
                placeholder="https://"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-white/50">Company Description</label>
              <textarea
                value={company.description}
                onChange={(e) => setCompany({ ...company, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Admin Account</h3>
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-6">
          {passwordStatus?.ok && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Password updated.
            </div>
          )}
          {passwordStatus?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {passwordStatus.error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/50">Your Name</label>
              <input
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>
          </div>

          {showPasswordForm ? (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="space-y-1.5 flex-1">
                <label className="text-xs font-medium text-white/50">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={savingPassword}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-sm text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {savingPassword ? "Updating…" : "Update Password"}
              </button>
            </div>
          ) : (
            <button onClick={() => setShowPasswordForm(true)} className="text-sm text-amber-400 hover:underline">
              Change Password
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
