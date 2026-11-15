import { useState } from 'react'
import { AddedBy, Chips, ErrorText, Screen, Segmented } from '../components/ui'
import { formatDate, today } from '../lib/dates'
import { addItem, removeItem, updateItem, useItems, useSingle, type Item } from '../lib/store'
import { amazonSearch, inSeason, SUGGESTIONS, suggestionState, type Suggestion } from '../lib/suggestions'
import { host, nameFromUrl } from '../lib/shop'
import { SHOP_CATEGORIES, SHOP_ICON, type Profile, type ShopCategory, type ShopItem } from '../lib/types'

const catOf = (s: ShopItem): ShopCategory => s.category ?? 'Other'

export function Shopping() {
  const [tab, setTab] = useState<'list' | 'ideas'>('list')
  const list = useItems<ShopItem>('shop')
  const profile = useSingle<Profile>('profile')
  const open = openSuggestions(list.map((x) => x.data), profile?.data.haveItems ?? [])
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [category, setCategory] = useState<ShopCategory>('Tack')
  const [filter, setFilter] = useState<ShopCategory | 'all'>('all')
  const [err, setErr] = useState('')
  const shown = list.filter((s) => filter === 'all' || catOf(s.data) === filter)
  const toBuy = shown.filter((s) => !s.data.bought)
  const bought = shown.filter((s) => s.data.bought)
  const usedCats = SHOP_CATEGORIES.filter((c) => list.some((s) => catOf(s.data) === c))

  async function add() {
    const clean = url.trim()
    if (!/^https?:\/\//.test(clean)) return setErr('Paste a full link starting with https://')
    setErr('')
    await addItem('shop', { url: clean, note: note.trim() || undefined, category })
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

  const tabs = (
    <Segmented
      value={tab}
      options={['list', 'ideas'] as const}
      labels={{ list: `🛒 List (${list.filter((x) => !x.data.bought).length})`, ideas: `💡 Suggestions (${open.length})` }}
      onChange={setTab}
    />
  )
  if (tab === 'ideas') {
    return (
      <Screen title="Shopping">
        {tabs}
        <Suggestions items={list.map((x) => x.data)} profile={profile} />
      </Screen>
    )
  }

  return (
    <Screen title="Shopping">
      {tabs}
      <div className="card soft">
        <div className="input-row">
          <input type="url" inputMode="url" placeholder="Paste an Amazon link" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="btn ghost small" onClick={() => void paste()}>
            Paste
          </button>
        </div>
        <input placeholder="Note (optional): size, colour, why…" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="chips" role="radiogroup" aria-label="Category">
          {SHOP_CATEGORIES.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={category === c} className={category === c ? 'chip on' : 'chip'} onClick={() => setCategory(c)}>
              {SHOP_ICON[c]} {c}
            </button>
          ))}
        </div>
        <button className="btn" onClick={() => void add()} disabled={!url.trim()}>
          Add to {category}
        </button>
        <ErrorText error={err} />
      </div>

      {usedCats.length > 1 && <Chips value={filter} options={usedCats} onChange={setFilter} all="All" />}

      <h3 className="section-title">To buy ({toBuy.length})</h3>
      {toBuy.length === 0 && <p className="empty">Nothing on the list.</p>}
      {SHOP_CATEGORIES.map((c) => {
        const group = toBuy.filter((s) => catOf(s.data) === c)
        if (!group.length) return null
        return (
          <section key={c} className="shop-group">
            <h4 className="shop-cat">
              {SHOP_ICON[c]} {c} <span className="muted">· {group.length}</span>
            </h4>
            <ul className="list">
              {group.map((s) => (
                <ShopRow key={s.id} row={s} />
              ))}
            </ul>
          </section>
        )
      })}

      {bought.length > 0 && (
        <>
          <h3 className="section-title">Bought</h3>
          <ul className="list">
            {bought.map((s) => (
              <ShopRow key={s.id} row={s} />
            ))}
          </ul>
        </>
      )}
    </Screen>
  )
}

function ShopRow({ row }: { row: Item<ShopItem> }) {
  const { id, data: item } = row
  const title = nameFromUrl(item.url) || item.note || host(item.url)
  return (
    <li className={'card' + (item.bought ? ' faded' : '')}>
      <a href={item.url} target="_blank" rel="noreferrer" className="shop-link">
        <strong>{title}</strong>
        <span className="muted small">{host(item.url)} ↗</span>
      </a>
      {item.note && title !== item.note && <p className="small">{item.note}</p>}
      {item.bought && item.boughtOn && <p className="muted small">Bought {formatDate(item.boughtOn)}</p>}
      {!item.bought && <AddedBy item={row} />}
      <div className="quick-row">
        <button className="btn small" onClick={() => void updateItem(id, { ...item, bought: !item.bought, boughtOn: item.bought ? undefined : today() })}>
          {item.bought ? '↩︎ Back to list' : '✓ Bought'}
        </button>
        <select
          className="cat-select"
          aria-label="Category"
          value={catOf(item)}
          onChange={(e) => void updateItem(id, { ...item, category: e.target.value as ShopCategory })}
        >
          {SHOP_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {SHOP_ICON[c]} {c}
            </option>
          ))}
        </select>
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

function openSuggestions(items: ShopItem[], have: string[]) {
  const month = new Date().getMonth() + 1
  return SUGGESTIONS.filter((s) => inSeason(s, month) && suggestionState(s, items, have) === 'open')
}

/** Things worth buying that aren't on the list yet. */
function Suggestions({ items, profile }: { items: ShopItem[]; profile: Item<Profile> | undefined }) {
  const have = profile?.data.haveItems ?? []
  const [showCovered, setShowCovered] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const month = new Date().getMonth() + 1
  const relevant = SUGGESTIONS.filter((s) => inSeason(s, month))
  const state = new Map(relevant.map((s) => [s.key, suggestionState(s, items, have)]))
  const open = relevant.filter((s) => state.get(s.key) === 'open')
  const covered = relevant.filter((s) => state.get(s.key) !== 'open')

  async function add(s: Suggestion) {
    setBusy(s.key)
    try {
      await addItem('shop', { url: amazonSearch(s.name), note: s.name, category: s.category })
    } finally {
      setBusy(null)
    }
  }
  function setHave(key: string, on: boolean) {
    if (!profile) return
    const next = on ? [...new Set([...have, key])] : have.filter((k) => k !== key)
    void updateItem(profile.id, { ...profile.data, haveItems: next })
  }

  return (
    <>
      <p className="muted small">
        Things most horse owners need, checked against your list. Tap <strong>+ Add</strong> to put one on the list, or <strong>Have it</strong> if you already own it.
      </p>
      {open.length === 0 && <p className="empty">🎉 You’ve got everything on our list covered.</p>}
      {SHOP_CATEGORIES.map((c) => {
        const group = open.filter((s) => s.category === c)
        if (!group.length) return null
        return (
          <section key={c} className="shop-group">
            <h4 className="shop-cat">
              {SHOP_ICON[c]} {c}
            </h4>
            <ul className="list">
              {group.map((s) => (
                <li key={s.key} className="card idea">
                  <div className="idea-text">
                    <strong>
                      {s.name}
                      {s.essential && <span className="tag">essential</span>}
                      {s.months && <span className="tag">seasonal</span>}
                    </strong>
                    <span className="muted small">{s.why}</span>
                  </div>
                  <div className="idea-actions">
                    <button className="btn small" disabled={busy === s.key} onClick={() => void add(s)}>
                      + Add
                    </button>
                    <button className="btn ghost small" onClick={() => setHave(s.key, true)}>
                      Have it
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {covered.length > 0 && (
        <div className="card soft">
          <button className="row-between link-block" onClick={() => setShowCovered(!showCovered)}>
            <strong className="small">✓ Already covered · {covered.length}</strong>
            <span>{showCovered ? '−' : '+'}</span>
          </button>
          {showCovered && (
            <ul className="list compact">
              {covered.map((s) => {
                const st = state.get(s.key)
                return (
                  <li key={s.key} className="row-between">
                    <span>
                      {s.name} <span className="muted small">· {st === 'bought' ? 'bought' : st === 'listed' ? 'on your list' : 'have it'}</span>
                    </span>
                    {st === 'have' && (
                      <button className="link small" onClick={() => setHave(s.key, false)}>
                        Undo
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </>
  )
}
