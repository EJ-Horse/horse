import { useState } from 'react'
import { daysBetween, formatDate, nextBirthday, ordinal, parseDate, today } from '../lib/dates'
import { downloadIcs } from '../lib/ics'
import { useItems, useSingle } from '../lib/store'
import type { FunPhoto, Profile } from '../lib/types'
import { CAKES, CAKE_SAFETY, SUGAR_LABEL, type Cake } from '../lib/cakes'
import { go } from '../lib/router'
import { Lightbox, MediaImg, Sheet } from './ui'

const PARTY_IDEAS = [
  '🥕 A horse-safe “cake”: grated carrot and apple pressed into a bowl of his usual feed, with a carrot “candle”. Keep it small, and check Nutrition for what he can have.',
  '📸 A birthday photo shoot: bow in his mane, a bandana, everyone in the picture. Add the best ones to Fun photos.',
  '🛁 A full spa day: bath, mane and tail brushed out, hooves oiled.',
  '🌳 His favourite thing: an easy trail ride, a long hand-graze, or a day off with friends.',
  '🎁 A present: a new halter, a lick, a toy ball, or a brush he likes.',
]

/** Days between two dates' month-day, ignoring the year (for "around his birthday" memories). */
function daysFromBirthday(date: string, birth: string) {
  const d = parseDate(date)
  const b = parseDate(birth)
  return Math.abs(daysBetween(date, `${d.getFullYear()}-${String(b.getMonth() + 1).padStart(2, '0')}-${String(b.getDate()).padStart(2, '0')}`))
}

/** Horse → countdown to EJ's birthday, with party ideas and birthday photos from past years. */
export function BirthdayCard() {
  const p = useSingle<Profile>('profile')?.data
  const fun = useItems<FunPhoto>('funphoto')
  const [ideas, setIdeas] = useState(false)
  const [big, setBig] = useState<string | null>(null)
  const [cakes, setCakes] = useState(false)
  if (!p?.birthDate) return null
  const name = p.name || 'EJ'
  const now = today()
  const { date, days, turning } = nextBirthday(p.birthDate, now)
  const lastBirthday = nextBirthday(p.birthDate, `${parseDate(date).getFullYear() - 1}-01-01`).date
  const yearDone = Math.min(1, Math.max(0, daysBetween(lastBirthday, now) / daysBetween(lastBirthday, date)))
  const memories = fun
    // photos from earlier years taken within 3 days of his birthday
    .filter((f) => parseDate(f.data.date).getFullYear() < parseDate(date).getFullYear() && daysFromBirthday(f.data.date, p.birthDate!) <= 3)
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
  const weekday = parseDate(date).toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className={'card bday-card' + (days === 0 ? ' today' : days <= 7 ? ' soon' : '')}>
      {days === 0 ? (
        <div className="bday-today">
          <div className="bday-confetti" aria-hidden>
            🎉🎂🎈🥕🎉
          </div>
          <strong className="bday-big">
            Happy {ordinal(turning)} birthday, {name}!
          </strong>
          <span className="muted small">Born {formatDate(p.birthDate)}</span>
        </div>
      ) : (
        <div className="bday-row">
          <span className="bday-icon" aria-hidden>
            {days <= 7 ? '🎈' : '🎂'}
          </span>
          <div className="bday-text">
            <span className="muted small">{days <= 7 ? 'Almost party time!' : `${name}’s birthday`}</span>
            <strong className="bday-big">{days === 1 ? 'Tomorrow!' : `${days} days`}</strong>
            <span className="small">
              until he turns <strong>{turning}</strong> · {weekday}, {formatDate(date)}
            </span>
          </div>
        </div>
      )}
      {days > 0 && (
        <span className="progress-track bday-track" aria-label={`${Math.round(yearDone * 100)}% of the way to his birthday`}>
          <span className="bday-fill" style={{ width: `${yearDone * 100}%` }} />
        </span>
      )}
      <div className="quick-row">
        <button className="btn small" onClick={() => setCakes(true)}>
          🍰 Horse-safe cakes
        </button>
        <button className="btn ghost small" onClick={() => setIdeas(!ideas)}>
          🎁 {ideas ? 'Hide' : 'Party'} ideas
        </button>
        <button className="btn ghost small" onClick={() => downloadIcs(`🎂 ${name}’s birthday`, date, `${name} was born ${formatDate(p.birthDate)}.`, true)}>
          📅 Add to calendar
        </button>
      </div>
      {ideas && (
        <ul className="bullets small">
          {PARTY_IDEAS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
      {memories.length > 0 && (
        <>
          <span className="field-label">🎂 Birthday memories</span>
          <div className="bday-memories">
            {memories.map((m) => (
              <button key={m.id} className="bday-memory" onClick={() => setBig(m.data.path)} aria-label={m.data.caption || formatDate(m.data.date)}>
                <MediaImg path={m.data.path} className="bday-memory-img" />
                <span className="small muted">{parseDate(m.data.date).getFullYear()}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <Lightbox path={big} onClose={() => setBig(null)} />
      {cakes && <CakesSheet name={name} onClose={() => setCakes(false)} />}
    </div>
  )
}

type CakeFilter = 'all' | 'no oven' | 'baked' | 'mini' | 'frozen' | 'low sugar' | 'quick'
const FILTERS: [CakeFilter, string][] = [
  ['all', 'All'],
  ['no oven', '🚫🔥 No oven'],
  ['baked', '🔥 Baked'],
  ['mini', '🧁 Mini & cookies'],
  ['frozen', '🧊 Frozen'],
  ['low sugar', '🟢 Low sugar'],
  ['quick', '⚡ Quick'],
]
const KIND_TITLE: Record<Cake['kind'], string> = { 'no-bake': '🥕 No-bake cakes', baked: '🎂 Baked cakes', mini: '🧁 Cupcakes, cookies & bites', frozen: '🧊 Frozen cakes' }

function matches(c: Cake, f: CakeFilter, q: string) {
  const okFilter =
    f === 'all' || (f === 'no oven' ? !c.oven : f === 'baked' ? c.kind === 'baked' : f === 'mini' ? c.kind === 'mini' : f === 'frozen' ? c.kind === 'frozen' : f === 'low sugar' ? c.sugar === 'low' : !!c.quick)
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hay = (c.name + ' ' + c.about + ' ' + c.ingredients.map((i) => i.text).join(' ')).toLowerCase()
  return okFilter && words.every((w) => hay.includes(w))
}

/** Birthday → horse-safe cake recipes, with step-by-step instructions. */
function CakesSheet({ name, onClose }: { name: string; onClose: () => void }) {
  const [filter, setFilter] = useState<CakeFilter>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const shown = CAKES.filter((c) => matches(c, filter, q))
  function surprise() {
    const pick = shown[Math.floor(Math.random() * shown.length)] ?? CAKES[0]
    setOpen(pick.key)
    setTimeout(() => document.getElementById('cake-' + pick.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }
  return (
    <Sheet open title="🍰 Horse-safe cakes" onClose={onClose}>
      <p className="small">Birthday cakes {name} can actually eat. No flour, chocolate or icing: just oats, fruit, veggies and his usual feed.</p>
      <details className="card soft cake-safety">
        <summary>
          <strong>⚠️ Read first: cake safety</strong>
        </summary>
        <ul className="bullets small">
          {CAKE_SAFETY.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button className="link small" onClick={() => go('horse/nutrition')}>
          Check any ingredient in Nutrition →
        </button>
      </details>
      <div className="cake-search">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${CAKES.length} cakes…`} />
        <button className="btn small" onClick={surprise} disabled={!shown.length}>
          🎲 Surprise me
        </button>
      </div>
      <div className="chips cake-filters">
        {FILTERS.map(([k, label]) => (
          <button key={k} className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
      </div>
      <p className="muted small">{shown.length === CAKES.length ? `${CAKES.length} cakes` : `${shown.length} of ${CAKES.length} cakes`}</p>
      {shown.length === 0 && <p className="empty">No cakes match. Try another word or filter.</p>}
      {(['no-bake', 'baked', 'mini', 'frozen'] as const).map((kind) => {
        const group = shown.filter((c) => c.kind === kind)
        if (!group.length) return null
        return (
          <section key={kind}>
            <h3 className="section-title">
              {KIND_TITLE[kind]} <span className="muted">· {group.length}</span>
            </h3>
            <ul className="list cake-list">
              {group.map((c) => (
                <CakeCard key={c.key} cake={c} open={open === c.key} onToggle={() => setOpen(open === c.key ? null : c.key)} />
              ))}
            </ul>
          </section>
        )
      })}
    </Sheet>
  )
}

function CakeCard({ cake: c, open, onToggle }: { cake: Cake; open: boolean; onToggle: () => void }) {
  const [done, setDone] = useState<number[]>([])
  return (
    <li id={'cake-' + c.key} className={'card cake-card' + (open ? ' open' : '')}>
      <button className="cake-head" onClick={onToggle} aria-expanded={open}>
        <span className="cake-emoji" aria-hidden>
          {c.emoji}
        </span>
        <span className="cake-title">
          <strong>{c.name}</strong>
          <span className="small muted">{c.about}</span>
          <span className="cake-tags small">
            {c.quick && <span className="tag">⚡ Quick</span>}
            <span className="tag">⏱ {c.time}</span>
            <span className="tag">{c.oven ? '🔥 Oven' : '🚫🔥 No oven'}</span>
            <span className="tag">{SUGAR_LABEL[c.sugar]}</span>
          </span>
        </span>
        <span className="muted" aria-hidden>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div className="cake-body">
          <p className="small muted">Makes: {c.serves}</p>
          <span className="field-label">You need</span>
          <ul className="bullets small">
            {c.ingredients.map((i) => (
              <li key={i.text}>{i.text}</li>
            ))}
          </ul>
          <span className="field-label">How to make it (tap a step when done)</span>
          <ol className="steps">
            {c.steps.map((s, i) => (
              <li key={i} className={done.includes(i) ? 'done' : ''} onClick={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}>
                {s}
              </li>
            ))}
          </ol>
          {c.tip && <p className="hint">💡 {c.tip}</p>}
        </div>
      )}
    </li>
  )
}
