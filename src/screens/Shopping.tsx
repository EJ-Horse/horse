import { useState } from 'react'
import { AddedBy, ErrorText, Screen } from '../components/ui'
import { formatDate, today } from '../lib/dates'
import { addItem, removeItem, updateItem, useItems } from '../lib/store'
import { host, nameFromUrl } from '../lib/shop'
import type { ShopItem } from '../lib/types'

export function Shopping() {
  const list = useItems<ShopItem>('shop')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  const toBuy = list.filter((s) => !s.data.bought)
  const bought = list.filter((s) => s.data.bought)

  async function add() {
    const clean = url.trim()
    if (!/^https?:\/\//.test(clean)) return setErr('Paste a full link starting with https://')
    setErr('')
    await addItem('shop', { url: clean, note: note.trim() || undefined })
    setUrl('')
    setNote('')
  }

  async function paste() {
    try {
      const t = await navigator.clipboard.readText()
      if (t) setUrl(t.trim())
    } catch {
      setErr('Couldn’t read the clipboard. Long-press the box and choose Paste.')
    }
  }

  return (
    <Screen title="Shopping">
      <div className="card soft">
        <div className="input-row">
          <input type="url" inputMode="url" placeholder="Paste an Amazon link" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="btn ghost small" onClick={() => void paste()}>
            Paste
          </button>
        </div>
        <input placeholder="Note (optional): size, colour, why…" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="btn" onClick={() => void add()} disabled={!url.trim()}>
          Add to list
        </button>
        <ErrorText error={err} />
      </div>
      <h3 className="section-title">To buy ({toBuy.length})</h3>
      {toBuy.length === 0 && <p className="empty">Nothing on the list.</p>}
      <ul className="list">
        {toBuy.map((s) => (
          <ShopRow key={s.id} id={s.id} item={s.data} by={<AddedBy item={s} />} />
        ))}
      </ul>
      {bought.length > 0 && (
        <>
          <h3 className="section-title">Bought</h3>
          <ul className="list">
            {bought.map((s) => (
              <ShopRow key={s.id} id={s.id} item={s.data} />
            ))}
          </ul>
        </>
      )}
    </Screen>
  )
}

function ShopRow({ id, item, by }: { id: string; item: ShopItem; by?: React.ReactNode }) {
  const title = nameFromUrl(item.url) || item.note || host(item.url)
  return (
    <li className={'card' + (item.bought ? ' faded' : '')}>
      <a href={item.url} target="_blank" rel="noreferrer" className="shop-link">
        <strong>{title}</strong>
        <span className="muted small">{host(item.url)} ↗</span>
      </a>
      {item.note && title !== item.note && <p className="small">{item.note}</p>}
      {item.bought && item.boughtOn && <p className="muted small">Bought {formatDate(item.boughtOn)}</p>}
      {by}
      <div className="quick-row">
        <button className="btn small" onClick={() => void updateItem(id, { ...item, bought: !item.bought, boughtOn: item.bought ? undefined : today() })}>
          {item.bought ? '↩︎ Back to list' : '✓ Bought'}
        </button>
        <button
          className="btn ghost small danger"
          onClick={() => {
            if (confirm('Remove this from the list?')) void removeItem(id)
          }}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
