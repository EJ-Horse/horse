import { stem } from '../lib/foodGuide'

/**
 * Shown when someone searches Nutrition for something that isn't food (fingers, rainbows…).
 * Original cartoon horses drawn in code.
 */

const QUIPS: { words: string[]; line: string }[] = [
  { words: ['finger', 'hand', 'thumb', 'toe', 'foot', 'feet', 'arm', 'leg', 'ear', 'nose', 'hair', 'people', 'human', 'person', 'kid', 'child', 'sofia', 'dad', 'mom', 'mum'], line: 'Fingers are for brushing EJ, not for snacks. 🖐️' },
  { words: ['rainbow', 'unicorn', 'cloud', 'moon', 'sky', 'magic', 'glitter', 'sparkle'], line: 'Rainbows are for unicorns. EJ is a very real horse. 🌈' },
  { words: ['homework', 'book', 'paper', 'school', 'pencil', 'test'], line: 'Nice try. The dog already used that excuse. 📚' },
  { words: ['phone', 'iphone', 'ipad', 'laptop', 'remote', 'money', 'cash', 'keys', 'car'], line: 'EJ does not need screen time. 📵' },
  { words: ['shoe', 'boot', 'sock', 'helmet', 'saddle', 'bridle', 'rope', 'blanket'], line: 'That’s his outfit, not his lunch. 👢' },
  { words: ['dog', 'cat', 'hamster', 'fish', 'goat', 'cow', 'pig', 'chicken', 'duck', 'pony'], line: 'EJ wants a friend, not a snack. 🐐' },
  { words: ['rock', 'stone', 'dirt', 'sand', 'mud', 'poop', 'manure', 'lego', 'plastic', 'bag', 'toy'], line: 'His stomach is not a trash can. 🪨' },
]

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

function words(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
    .map(stem)
}

/** A specific joke when a whole word in the search is obviously not food; otherwise null. */
export function quipFor(query: string): string | null {
  const ws = words(query)
  const hit = QUIPS.find((x) => x.words.some((w) => ws.includes(stem(w))))
  return hit?.line ?? null
}

export function psychoLine(query: string) {
  const q = query.toLowerCase()
  const generic = ['EJ is a horse, not a garbage disposal. 🗑️', 'Not food. Not even close. 😐', 'EJ looked at you and said "neigh". 🐴', 'Hay. Just give him hay. 🌾']
  return quipFor(q) ?? generic[hash(q) % generic.length]
}

const COAT = '#ece8e2'
const SHADE = '#cfc8be'
const MANE = '#8e8b86'
const INK = '#2b2421'

/** Horse head facing you, with a mood. */
function Head({ mood }: { mood: 'shock' | 'side-eye' | 'cool' | 'nope' }) {
  return (
    <g>
      {/* ears */}
      <path d="M38 22 L46 4 L54 26 Z" fill={COAT} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M82 26 L90 4 L98 22 Z" fill={COAT} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M43 19 L46 10 L50 22 Z M86 22 L90 10 L93 19 Z" fill="#f2b8c6" />
      {/* forelock */}
      <path d="M56 22 Q68 8 80 22 Q74 30 68 26 Q62 32 56 22 Z" fill={MANE} />
      {/* head */}
      <path d="M36 40 Q36 18 68 18 Q100 18 100 40 L94 92 Q92 110 68 112 Q44 110 42 92 Z" fill={COAT} stroke={INK} strokeWidth="2.4" />
      {/* muzzle */}
      <ellipse cx="68" cy="96" rx="24" ry="16" fill={SHADE} stroke={INK} strokeWidth="2.2" />
      <ellipse cx="59" cy="95" rx="3.2" ry="4.6" fill={INK} />
      <ellipse cx="77" cy="95" rx="3.2" ry="4.6" fill={INK} />
      {/* eyes & mouth by mood */}
      {mood === 'shock' && (
        <>
          <circle cx="54" cy="52" r="11" fill="#fff" stroke={INK} strokeWidth="2.2" />
          <circle cx="82" cy="52" r="11" fill="#fff" stroke={INK} strokeWidth="2.2" />
          <circle cx="54" cy="53" r="4" fill={INK} />
          <circle cx="82" cy="53" r="4" fill={INK} />
          <ellipse cx="68" cy="106" rx="6" ry="4.5" fill="#7a2f2f" />
          <path d="M44 36 L58 40 M92 36 L78 40" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      {mood === 'side-eye' && (
        <>
          <path d="M44 52 Q54 44 64 52 Q54 58 44 52 Z" fill="#fff" stroke={INK} strokeWidth="2.2" />
          <path d="M72 52 Q82 44 92 52 Q82 58 72 52 Z" fill="#fff" stroke={INK} strokeWidth="2.2" />
          <circle cx="60" cy="52" r="3.4" fill={INK} />
          <circle cx="88" cy="52" r="3.4" fill={INK} />
          <path d="M44 44 L64 47 M72 47 L92 44" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 106 L76 104" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      {mood === 'cool' && (
        <>
          <path d="M40 46 L96 46 L92 60 Q84 66 74 58 L70 52 L66 52 L62 58 Q52 66 44 60 Z" fill={INK} />
          <path d="M48 50 L56 50" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M58 104 Q68 110 80 102" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'nope' && (
        <>
          <path d="M46 48 L60 56 M60 48 L46 56 M76 48 L90 56 M90 48 L76 56" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M58 106 Q68 100 78 106" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M80 104 Q84 112 80 116" stroke="#ec7aa0" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  )
}

/** One of four cartoons, picked from the search so the same word always gets the same one. */
export function PsychoArt({ query, size = 150 }: { query: string; size?: number }) {
  const n = hash(query.toLowerCase().trim()) % 4
  return (
    <svg viewBox="0 0 200 140" width={size * (200 / 140)} height={size} role="img" aria-label="Cartoon of EJ reacting" className="psycho-art">
      <rect width="200" height="140" rx="16" fill="#fff4d6" />
      {n === 0 && (
        <g>
          <g transform="translate(32 14)">
            <Head mood="shock" />
          </g>
          <text x="150" y="44" fontSize="34" fontWeight="900" fill="#e5484d" fontFamily="system-ui, sans-serif">?!</text>
          <path d="M140 70 l6 -10 M152 74 l10 -6 M150 86 l12 0" stroke="#e5484d" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {n === 1 && (
        <g>
          <g transform="translate(8 14)">
            <Head mood="side-eye" />
          </g>
          <g transform="translate(118 26)">
            <path d="M0 10 Q0 0 10 0 L64 0 Q74 0 74 10 L74 40 Q74 50 64 50 L22 50 L8 62 L12 50 L10 50 Q0 50 0 40 Z" fill="#fff" stroke={INK} strokeWidth="2.2" />
            <text x="37" y="32" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK} fontFamily="system-ui, sans-serif">
              …really?
            </text>
          </g>
        </g>
      )}
      {n === 2 && (
        <g>
          <g transform="translate(14 14)">
            <Head mood="cool" />
          </g>
          {/* NOPE sign on a stick */}
          <path d="M150 128 L150 60" stroke="#8a5a2b" strokeWidth="6" strokeLinecap="round" />
          <rect x="118" y="26" width="66" height="40" rx="6" fill="#e5484d" stroke={INK} strokeWidth="2.2" transform="rotate(-6 151 46)" />
          <text x="151" y="54" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff" fontFamily="system-ui, sans-serif" transform="rotate(-6 151 46)">
            NOPE
          </text>
        </g>
      )}
      {n === 3 && (
        <g>
          <g transform="translate(32 14)">
            <Head mood="nope" />
          </g>
          {/* little hay bale he'd rather have */}
          <g transform="translate(148 86)">
            <rect x="0" y="0" width="40" height="28" rx="4" fill="#e7c868" stroke="#a8862f" strokeWidth="2" />
            <path d="M0 10 L40 10 M0 18 L40 18 M12 0 L12 28 M28 0 L28 28" stroke="#a8862f" strokeWidth="1.5" />
          </g>
          <text x="168" y="74" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="system-ui, sans-serif">
            hay pls
          </text>
          <text x="150" y="36" fontSize="22" fill={INK}>💤</text>
        </g>
      )}
    </svg>
  )
}
