import { useEffect, useState } from 'react'
import { Building2, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { fetchCompanySettings, updateCompanySettings } from '../../lib/api'
import Spinner from '../../components/ui/Spinner'
import LoadingScreen from '../../components/LoadingScreen'

function Toast({ ok, error }) {
  if (!ok && !error) return null
  return ok ? (
    <div className="flex items-center gap-2 rounded-xl bg-safari-50 px-4 py-3 text-sm text-safari-800">
      <CheckCircle2 className="h-4 w-4" /> Saved successfully.
    </div>
  ) : (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="h-4 w-4" /> {error}
    </div>
  )
}

export default function Settings() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [companyForm, setCompanyForm] = useState(null)
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })

  const [savingCompany, setSavingCompany] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [status, setStatus] = useState({})

  useEffect(() => {
    fetchCompanySettings()
      .then(setCompanyForm)
      .finally(() => setLoading(false))
    if (profile) setProfileForm({ full_name: profile.full_name ?? '', phone: profile.phone ?? '' })
  }, [profile])

  const handleCompanySave = async (e) => {
    e.preventDefault()
    setSavingCompany(true)
    setStatus((s) => ({ ...s, company: null }))
    try {
      const updated = await updateCompanySettings(companyForm)
      setCompanyForm(updated)
      setStatus((s) => ({ ...s, company: { ok: true } }))
    } catch (err) {
      setStatus((s) => ({ ...s, company: { error: err.message } }))
    } finally {
      setSavingCompany(false)
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setStatus((s) => ({ ...s, profile: null }))
    try {
      const { error } = await supabase.from('profiles').update(profileForm).eq('id', profile.id)
      if (error) throw error
      await refreshProfile()
      setStatus((s) => ({ ...s, profile: { ok: true } }))
    } catch (err) {
      setStatus((s) => ({ ...s, profile: { error: err.message } }))
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setStatus((s) => ({ ...s, password: null }))
    if (passwordForm.password.length < 6) {
      setStatus((s) => ({ ...s, password: { error: 'Password must be at least 6 characters.' } }))
      return
    }
    if (passwordForm.password !== passwordForm.confirm) {
      setStatus((s) => ({ ...s, password: { error: 'Passwords do not match.' } }))
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.password })
      if (error) throw error
      setPasswordForm({ password: '', confirm: '' })
      setStatus((s) => ({ ...s, password: { ok: true } }))
    } catch (err) {
      setStatus((s) => ({ ...s, password: { error: err.message } }))
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading || !companyForm) return <LoadingScreen label="Loading settings…" />

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your admin account and Golden Tours company details.</p>
      </div>

      <form onSubmit={handleCompanySave} className="card space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
          <Building2 className="h-4.5 w-4.5 text-gold-600" /> Company Profile
        </h2>
        <Toast {...(status.company ?? {})} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Company Name</label>
            <input value={companyForm.company_name} onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Default Currency</label>
            <input value={companyForm.default_currency} onChange={(e) => setCompanyForm({ ...companyForm, default_currency: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Support Email</label>
            <input value={companyForm.support_email} onChange={(e) => setCompanyForm({ ...companyForm, support_email: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Support Phone</label>
            <input value={companyForm.support_phone} onChange={(e) => setCompanyForm({ ...companyForm, support_phone: e.target.value })} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Office Address</label>
            <input value={companyForm.office_address} onChange={(e) => setCompanyForm({ ...companyForm, office_address: e.target.value })} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Booking Notice (shown to customers)</label>
            <textarea rows={2} value={companyForm.booking_notice} onChange={(e) => setCompanyForm({ ...companyForm, booking_notice: e.target.value })} className="input resize-none" />
          </div>
        </div>
        <button type="submit" disabled={savingCompany} className="btn-primary">
          {savingCompany && <Spinner size={16} />} Save Company Settings
        </button>
      </form>

      <form onSubmit={handleProfileSave} className="card space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
          <User className="h-4.5 w-4.5 text-gold-600" /> My Admin Profile
        </h2>
        <Toast {...(status.profile ?? {})} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full Name</label>
            <input value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <input value={profile?.email ?? ''} disabled className="input bg-ink-50 text-ink-400" />
          </div>
        </div>
        <button type="submit" disabled={savingProfile} className="btn-primary">
          {savingProfile && <Spinner size={16} />} Save Profile
        </button>
      </form>

      <form onSubmit={handlePasswordSave} className="card space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
          <Lock className="h-4.5 w-4.5 text-gold-600" /> Change Password
        </h2>
        <Toast {...(status.password ?? {})} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="input"
            />
          </div>
        </div>
        <button type="submit" disabled={savingPassword} className="btn-primary">
          {savingPassword && <Spinner size={16} />} Update Password
        </button>
      </form>
    </div>
  )
}
