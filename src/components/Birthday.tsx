import { useState } from 'react'
import { daysBetween, formatDate, nextBirthday, ordinal, parseDate, today } from '../lib/dates'
import { downloadIcs } from '../lib/ics'
import { useItems, useSingle } from '../lib/store'
import type { FunPhoto, Profile } from '../lib/types'
import { Lightbox, MediaImg } from './ui'

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
    </div>
  )
}
