import { useState } from 'react'
import { supabase } from '../lib/supabase'

/** Shown instead of the app until signed in. */
export function Lock() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass })
    setBusy(false)
    if (error) setMessage(error.status === 400 ? "That email and passcode didn't match." : `Couldn't sign in: ${error.message}`)
  }

  async function forgot() {
    if (!supabase) return
    if (!email) return setMessage('Enter your email first, then tap “Forgot passcode?” again.')
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + import.meta.env.BASE_URL })
    setMessage(error ? `Couldn't send the email: ${error.message}` : 'If that email has an account, a reset link is on its way.')
  }

  return (
    <div className="lock">
      <form className="card lock-card" onSubmit={signIn}>
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={64} height={64} />
        <h1>EJ</h1>
        <p className="muted small">Private. Sign in to continue.</p>
        <label className="field">
          <span className="field-label">Email</span>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Passcode</span>
          <input type="password" required autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>
        <button type="submit" className="btn" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Signing in…' : 'Unlock'}
        </button>
        <button type="button" className="link" onClick={() => void forgot()}>
          Forgot passcode?
        </button>
        {message && <p className="small" role="status">{message}</p>}
      </form>
    </div>
  )
}

/** After tapping a reset link in the email, choose a new passcode. */
export function NewPasscode({ onDone }: { onDone: () => void }) {
  const [pass, setPass] = useState('')
  const [msg, setMsg] = useState('')
  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    if (pass.length < 6) return setMsg('Use at least 6 characters.')
    const { error } = await supabase.auth.updateUser({ password: pass })
    if (error) setMsg(error.message)
    else onDone()
  }
  return (
    <div className="lock">
      <form className="card lock-card" onSubmit={save}>
        <h1>New passcode</h1>
        <input type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button className="btn" style={{ width: '100%' }}>
          Save
        </button>
        {msg && <p className="error">{msg}</p>}
      </form>
    </div>
  )
}

/** The published site was built without the Supabase settings. */
export function NotConfigured() {
  return (
    <div className="lock">
      <div className="card lock-card">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={64} height={64} />
        <h1>Almost ready</h1>
        <p className="muted small">The app isn’t connected to its database yet. Add the Supabase settings to the GitHub repository and run the deploy again.</p>
      </div>
    </div>
  )
}
