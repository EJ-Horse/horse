import { useState } from 'react'
import { AddButton, ErrorText, Field, SaveBar, Screen, Sheet, useDraft } from '../components/ui'
import { addItem, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { Login } from '../lib/types'

/** Rider → Logins: website accounts like the AHR registry, with copy buttons. */
export function Logins() {
  const list = useItems<Login>('login').sort((a, b) => a.data.name.localeCompare(b.data.name))
  const [editing, setEditing] = useState<Item<Login> | 'new' | null>(null)
  return (
    <Screen title="Logins" action={<AddButton onClick={() => setEditing('new')} label="Login" />}>
      <p className="hint">Only people signed in to this app can see these.</p>
      {list.length === 0 && <p className="empty">No logins yet. Tap + Login to add one.</p>}
      <ul className="list">
        {list.map((l) => (
          <LoginCard key={l.id} item={l} onEdit={() => setEditing(l)} />
        ))}
      </ul>
      {editing && <LoginSheet item={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </Screen>
  )
}

function LoginCard({ item, onEdit }: { item: Item<Login>; onEdit: () => void }) {
  const l = item.data
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState('')
  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('')
    }
  }
  const rows: [string, string | undefined, boolean?][] = [
    ['User number', l.number],
    ['Username', l.username],
    ['Password', l.password, true],
  ]
  return (
    <li className="card login-card">
      <div className="row-between">
        <strong>🔑 {l.name}</strong>
        <button className="link small" onClick={onEdit}>
          Edit
        </button>
      </div>
      <dl className="login-rows">
        {rows
          .filter(([, v]) => v)
          .map(([label, v, secret]) => (
            <div key={label} className="login-row">
              <dt className="muted small">{label}</dt>
              <dd>
                <span className="login-value">{secret && !show ? '••••••••' : v}</span>
                {secret && (
                  <button className="btn ghost small" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                    {show ? 'Hide' : 'Show'}
                  </button>
                )}
                <button className="btn ghost small" onClick={() => void copy(label, v!)}>
                  {copied === label ? '✓ Copied' : 'Copy'}
                </button>
              </dd>
            </div>
          ))}
      </dl>
      {!l.password && <p className="hint">No password saved. Tap Edit to add it.</p>}
      {l.notes && <p className="muted small">{l.notes}</p>}
      {l.url && (
        <a className="btn small login-open" href={l.url} target="_blank" rel="noreferrer">
          Open {l.name} login ↗
        </a>
      )}
    </li>
  )
}

function LoginSheet({ item, onClose }: { item?: Item<Login>; onClose: () => void }) {
  const [d, set] = useDraft<Login>(item?.data ?? { name: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  async function save() {
    if (!d.name.trim()) return setErr('Give it a name, e.g. AHR.')
    const clean: Login = { name: d.name.trim() }
    for (const k of ['url', 'number', 'username', 'password', 'notes'] as const) if (d[k]?.trim()) clean[k] = d[k]!.trim()
    if (clean.url && !/^https?:\/\//i.test(clean.url)) clean.url = 'https://' + clean.url
    try {
      if (item) await updateItem(item.id, clean)
      else await addItem('login', clean)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title={item ? `Edit ${item.data.name}` : 'New login'} onClose={onClose}>
      <Field label="Name">
        <input value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. AHR" />
      </Field>
      <Field label="Login link">
        <input type="url" inputMode="url" value={d.url ?? ''} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
      </Field>
      <Field label="User number">
        <input inputMode="numeric" value={d.number ?? ''} onChange={(e) => set('number', e.target.value)} />
      </Field>
      <Field label="Username / email">
        <input autoCapitalize="none" autoCorrect="off" value={d.username ?? ''} onChange={(e) => set('username', e.target.value)} />
      </Field>
      <Field label="Password">
        <div className="login-pass">
          <input
            type={show ? 'text' : 'password'}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            value={d.password ?? ''}
            onChange={(e) => set('password', e.target.value)}
          />
          <button type="button" className="btn ghost small" onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </Field>
      <Field label="Notes">
        <textarea rows={2} value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} />
      {item && (
        <button
          className="btn ghost small danger"
          onClick={() => {
            if (confirm(`Delete the ${item.data.name} login?`)) void removeItem(item.id).then(onClose)
          }}
        >
          Delete login
        </button>
      )}
    </Sheet>
  )
}
