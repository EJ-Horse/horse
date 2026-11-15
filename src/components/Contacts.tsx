import { useState } from 'react'
import { ErrorText, SaveBar, Sheet } from './ui'
import { updateItem, useSingle } from '../lib/store'
import type { Contact, Profile } from '../lib/types'

export const DEFAULT_CONTACTS: Contact[] = [
  { name: 'Rachel', role: 'Sofía’s coach' },
  { name: 'Annie', role: '' },
]

export function telHref(phone: string) {
  return 'tel:' + phone.replace(/[^\d+]/g, '')
}

/** 📞 buttons for the people you call most. A button without a number asks for one. */
export function ContactButtons({ vet = false }: { vet?: boolean }) {
  const profile = useSingle<Profile>('profile')
  const p = profile?.data
  const contacts = p?.contacts ?? DEFAULT_CONTACTS
  const [editing, setEditing] = useState(false)
  return (
    <div className="quick-row">
      {vet && p?.vetPhone && (
        <a className="btn secondary small" href={telHref(p.vetPhone)}>
          📞 Vet{p.vetName ? ` (${p.vetName})` : ''}
        </a>
      )}
      {vet && p?.farrierPhone && (
        <a className="btn secondary small" href={telHref(p.farrierPhone)}>
          📞 Farrier
        </a>
      )}
      {contacts.map((c) =>
        c.phone ? (
          <a key={c.name} className="btn secondary small" href={telHref(c.phone)} aria-label={`Call ${c.name}${c.role ? `, ${c.role}` : ''}`}>
            📞 {c.name}
          </a>
        ) : (
          <button key={c.name} className="btn ghost small" onClick={() => setEditing(true)}>
            📞 {c.name} · add number
          </button>
        ),
      )}
      {profile && (
        <button className="link small" onClick={() => setEditing(true)}>
          Edit
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
      <p className="muted small">The button shows just the name. Add or remove people anytime.</p>
      <ul className="contact-rows">
        {rows.map((r, i) => (
          <li key={i}>
            <input value={r.name} onChange={(e) => upd(i, { name: e.target.value })} placeholder="Name" aria-label="Name" />
            <input type="tel" inputMode="tel" value={r.phone ?? ''} onChange={(e) => upd(i, { phone: e.target.value })} placeholder="Phone" aria-label={`${r.name || 'Contact'} phone`} />
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
