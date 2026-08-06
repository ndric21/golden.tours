import { useState } from 'react'
import { User, Mail, Phone, Globe2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import Spinner from '../../components/ui/Spinner'

export default function Profile() {
  const { profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [nationality, setNationality] = useState(profile?.nationality ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone, nationality })
        .eq('id', profile.id)
      if (error) throw error
      await refreshProfile()
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-900">My Profile</h1>
      <p className="mt-2 text-sm text-ink-500">Keep your details current so we can tailor your journeys.</p>

      <div className="mt-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-2xl font-semibold text-gold-700">
          {profile?.full_name?.[0] ?? 'G'}
        </span>
        <div>
          <div className="font-display text-lg font-semibold text-ink-900">{profile?.full_name}</div>
          <div className="text-sm text-ink-500">{profile?.email}</div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card mt-8 space-y-4 p-6">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-safari-50 px-4 py-3 text-sm text-safari-800">
            <CheckCircle2 className="h-4 w-4" /> Profile updated.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <div>
          <label className="label flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Full Name
          </label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" required />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </label>
          <input value={profile?.email ?? ''} disabled className="input bg-ink-50 text-ink-400" />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> Phone
          </label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+1 555 000 0000" />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" /> Nationality
          </label>
          <input
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="input"
            placeholder="e.g. United States"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Spinner size={16} />}
          Save Changes
        </button>
      </form>
    </div>
  )
}
