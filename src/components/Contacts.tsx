import { useState } from 'react'
import { ErrorText, SaveBar, Sheet } from './ui'
import { updateItem, useSingle } from '../lib/store'
import type { Code, Contact, Profile } from '../lib/types'

export const DEFAULT_CONTACTS: Contact[] = [
  { name: 'Rachel', role: 'Sofía’s coach' },
  { name: 'Annie', role: '' },
]

export function telHref(phone: string) {
  return 'tel:' + phone.replace(/[^\d+]/g, '')
}

/** "Dr. Douglas Novick" -> "Dr. Novick" so the button stays short. */
export function shortVetName(name: string) {
  const words = name.replace(/^Dr\.?\s+/i, '').trim().split(/\s+/)
  return words.length ? `Dr. ${words[words.length - 1]}` : name
}

export function smsHref(phone: string) {
  return 'sms:' + phone.replace(/[^\d+]/g, '')
}

/** 📞 buttons for the people you call most. A button without a number asks for one. */
export function ContactButtons({ vet = false, editable = !vet }: { vet?: boolean; editable?: boolean }) {
  const profile = useSingle<Profile>('profile')
  const p = profile?.data
  const contacts = p?.contacts ?? DEFAULT_CONTACTS
  const [editing, setEditing] = useState(false)
  return (
    <div className="call-row">
      {vet && p?.vetPhone && (
        <a className="call-btn" href={telHref(p.vetPhone)}>
          📞 Vet{p.vetName ? ` (${shortVetName(p.vetName)})` : ''}
        </a>
      )}
      {vet && p?.farrierPhone && (
        <a className="call-btn" href={telHref(p.farrierPhone)}>
          📞 Farrier
        </a>
      )}
      {contacts.map((c) =>
        c.phone ? (
          <a
            key={c.name}
            className="call-btn"
            href={c.text ? smsHref(c.phone) : telHref(c.phone)}
            aria-label={`${c.text ? 'Text' : 'Call'} ${c.name}${c.role ? `, ${c.role}` : ''}`}
          >
            {c.text ? '💬' : '📞'} {c.name}
          </a>
        ) : (
          <button key={c.name} className="call-btn ghost" onClick={() => setEditing(true)}>
            {c.text ? '💬' : '📞'} {c.name} +
          </button>
        ),
      )}
      {profile && editable && (
        <button className="icon-btn small call-edit" aria-label="Edit call buttons" onClick={() => setEditing(true)}>
          ✎
        </button>
      )}
      {editing && profile && (
        <ContactsSheet
          contacts={contacts}
          onSave={(list) => updateItem(profile.id, { ...profile.data, contacts: list })}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}

function ContactsSheet({ contacts, onSave, onClose }: { contacts: Contact[]; onSave: (c: Contact[]) => Promise<void>; onClose: () => void }) {
  const [rows, setRows] = useState<Contact[]>(contacts)
  const [err, setErr] = useState('')
  const upd = (i: number, patch: Partial<Contact>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  async function save() {
    try {
      await onSave(rows.filter((r) => r.name.trim()).map((r) => ({ ...r, name: r.name.trim(), phone: r.phone?.trim() || undefined })))
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="Call buttons" onClose={onClose}>
      <p className="muted small">The button shows just the name. Choose Call or Text for each person.</p>
      <ul className="contact-rows">
        {rows.map((r, i) => (
          <li key={i}>
            <input value={r.name} onChange={(e) => upd(i, { name: e.target.value })} placeholder="Name" aria-label="Name" />
            <input type="tel" inputMode="tel" value={r.phone ?? ''} onChange={(e) => upd(i, { phone: e.target.value })} placeholder="Phone" aria-label={`${r.name || 'Contact'} phone`} />
            <select value={r.text ? 'text' : 'call'} onChange={(e) => upd(i, { text: e.target.value === 'text' || undefined })} aria-label="Call or text">
              <option value="call">📞 Call</option>
              <option value="text">💬 Text</option>
            </select>
            <button type="button" className="icon-btn small" aria-label="Remove" onClick={() => setRows((x) => x.filter((_, j) => j !== i))}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn secondary small" onClick={() => setRows((r) => [...r, { name: '' }])}>
        + Add person
      </button>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} />
    </Sheet>
  )
}

/** Barn gate codes, always visible on Home. */
export function CodesBanner() {
  const profile = useSingle<Profile>('profile')
  const codes = profile?.data.codes ?? []
  const [editing, setEditing] = useState(false)
  if (!profile) return null
  return (
    <>
      <button className="codes-banner" onClick={() => setEditing(true)} aria-label="Barn codes, tap to edit">
        <span aria-hidden>🔑</span>
        {codes.length ? (
          codes.map((c) => (
            <span key={c.label} className="code">
              <span className="code-label">{c.label}</span>
              <strong className="code-value">{c.code}</strong>
            </span>
          ))
        ) : (
          <span className="muted small">Add the barn gate codes</span>
        )}
        <span className="codes-edit" aria-hidden>
          ✎
        </span>
      </button>
      {editing && (
        <CodesSheet codes={codes} onSave={(list) => updateItem(profile.id, { ...profile.data, codes: list })} onClose={() => setEditing(false)} />
      )}
    </>
  )
}

function CodesSheet({ codes, onSave, onClose }: { codes: Code[]; onSave: (c: Code[]) => Promise<void>; onClose: () => void }) {
  const [rows, setRows] = useState<Code[]>(codes.length ? codes : [{ label: 'Main gate', code: '' }, { label: 'Walk-in', code: '' }])
  const [err, setErr] = useState('')
  const upd = (i: number, patch: Partial<Code>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  async function save() {
    try {
      await onSave(rows.filter((r) => r.label.trim() && r.code.trim()).map((r) => ({ label: r.label.trim(), code: r.code.trim() })))
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="Barn codes" onClose={onClose}>
      <p className="muted small">The barn changes these every few months. Update them here, or forward the email to Claude.</p>
      <ul className="contact-rows codes-rows">
        {rows.map((r, i) => (
          <li key={i}>
            <input value={r.label} onChange={(e) => upd(i, { label: e.target.value })} placeholder="e.g. Main gate" aria-label="Name" />
            <input inputMode="numeric" value={r.code} onChange={(e) => upd(i, { code: e.target.value })} placeholder="Code" aria-label={`${r.label || 'Code'} code`} />
            <button type="button" className="icon-btn small" aria-label="Remove" onClick={() => setRows((x) => x.filter((_, j) => j !== i))}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn secondary small" onClick={() => setRows((r) => [...r, { label: '', code: '' }])}>
        + Add code
      </button>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} />
    </Sheet>
  )
}
