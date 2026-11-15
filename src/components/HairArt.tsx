import type { Hairstyle } from '../lib/types'

/**
 * Small hand-drawn illustration of a mane or tail style on a gray horse (like EJ).
 * Original artwork drawn in code, so no outside photos are needed.
 */
type Kind =
  | 'bands'
  | 'bubble'
  | 'buttons'
  | 'running'
  | 'fishtail'
  | 'hunter'
  | 'continental'
  | 'halloween'
  | 'christmas'
  | 'rainbow'
  | 'tail-plait'
  | 'tail-french'
  | 'tail-mud'
  | 'tail-web'
  | 'loops'
  | 'ribbons'
  | 'flowers'
  | 'valentine'
  | 'usa'
  | 'rope'
  | 'tail-bubble'
  | 'tail-ribbon'
  | 'mane'
  | 'tail'

const BY_NAME: Record<string, Kind> = {
  'Banded mane': 'bands',
  'Bubble mane': 'bubble',
  'Button braids': 'buttons',
  'Running braid': 'running',
  'Fishtail mane braid': 'fishtail',
  'Hunter braids': 'hunter',
  'Continental (macramé) braid': 'continental',
  'Halloween pumpkin bands': 'halloween',
  'Christmas ribbon braid': 'christmas',
  'Rainbow bubble mane': 'rainbow',
  'Simple tail plait': 'tail-plait',
  'French tail braid': 'tail-french',
  'Mud knot': 'tail-mud',
  'Spider-web tail': 'tail-web',
  'Rope twist mane': 'rope',
  'Dutch braid': 'running',
  'Loop braids (scallops)': 'loops',
  'Ribbon braids': 'ribbons',
  'Flower rosettes': 'flowers',
  'Valentine heart bands': 'valentine',
  'Stars & stripes bands': 'usa',
  'Tail bubbles': 'tail-bubble',
  'Ribbon tail braid': 'tail-ribbon',
  'Fishtail tail braid': 'tail-plait',
}

export function hairKind(h: Hairstyle): Kind {
  const known = BY_NAME[h.name]
  if (known) return known
  const n = h.name.toLowerCase()
  if (h.area === 'tail') {
    if (n.includes('knot')) return 'tail-mud'
    if (n.includes('french')) return 'tail-french'
    if (n.includes('bubble')) return 'tail-bubble'
    if (n.includes('ribbon')) return 'tail-ribbon'
    return n.includes('braid') || n.includes('plait') ? 'tail-plait' : 'tail'
  }
  if (n.includes('loop') || n.includes('scallop')) return 'loops'
  if (n.includes('ribbon')) return 'ribbons'
  if (n.includes('flower') || n.includes('rosette')) return 'flowers'
  if (n.includes('rope') || n.includes('twist')) return 'rope'
  if (n.includes('bubble')) return 'bubble'
  if (n.includes('band')) return 'bands'
  if (n.includes('button') || n.includes('rosette')) return 'buttons'
  if (n.includes('running') || n.includes('french')) return 'running'
  if (n.includes('fishtail')) return 'fishtail'
  if (n.includes('hunter')) return 'hunter'
  if (n.includes('macram') || n.includes('continental') || n.includes('diamond')) return 'continental'
  return 'mane'
}

const COAT = '#e9e6e1'
const COAT_SHADE = '#cfcac2'
const HAIR = '#8e8b86'
const HAIR_DARK = '#6d6a66'
const RAINBOW = ['#e5484d', '#f08c2b', '#f2c94c', '#3fae5b', '#3b82c4', '#7c5cc4']

/** Points along the crest (top edge of the neck), from withers (left) to poll (right). nx/ny point down into the neck. */
function crest(n: number, t0 = 0.1, t1 = 0.9) {
  const P0 = [-2, 44]
  const P1 = [24, 10]
  const P2 = [74, 8]
  return Array.from({ length: n }, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / Math.max(1, n - 1)
    const x = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t ** 2 * P2[0]
    const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t ** 2 * P2[1]
    const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])
    const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1])
    const len = Math.hypot(dx, dy)
    let nx = -dy / len
    let ny = dx / len
    if (ny < 0) {
      nx = -nx
      ny = -ny
    }
    // lean the hair a little toward the withers, like a real mane
    return { x, y, nx: nx * 0.9 - 0.25, ny }
  })
}

/** Close-up of the side of a gray neck; the mane hangs down onto it. */
function Neck({ children }: { children: React.ReactNode }) {
  return (
    <>
      <path d="M-2 44 Q24 10 74 8 L74 72 L-2 72 Z" fill={COAT} />
      <path d="M74 40 Q46 44 34 72" stroke={COAT_SHADE} strokeWidth="2" fill="none" />
      <path d="M-2 44 Q24 10 74 8" stroke={COAT_SHADE} strokeWidth="1.2" fill="none" />
      {children}
      {/* ear at the poll */}
      <path d="M61 9 L67 -1 L71 8 Z" fill={COAT_SHADE} />
    </>
  )
}

function Rump({ children }: { children: React.ReactNode }) {
  // shifted left so the tail hangs in the middle of the picture
  return (
    <g transform="translate(-14 2)">
      <path d="M-6 30 Q20 6 52 14 Q60 18 58 34 L58 72 L-6 72 Z" fill={COAT} />
      <path d="M40 14 Q50 12 54 20" stroke={COAT_SHADE} strokeWidth="3" fill="none" />
      {children}
    </g>
  )
}

function Braid({ x1, y1, x2, y2, n, color = HAIR, w = 3.4 }: { x1: number; y1: number; x2: number; y2: number; n: number; color?: string; w?: number }) {
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const x = x1 + (x2 - x1) * t
        const y = y1 + (y2 - y1) * t
        return <ellipse key={i} cx={x} cy={y} rx={(Math.hypot(x2 - x1, y2 - y1) / n) * 0.62} ry={w / 2} fill={i % 2 ? HAIR_DARK : color} transform={`rotate(${ang + (i % 2 ? 22 : -22)} ${x} ${y})`} />
      })}
    </g>
  )
}

function maneStrands(n: number, len: number, color = HAIR) {
  return crest(n).map((p, i) => (
    <line key={i} x1={p.x} y1={p.y} x2={p.x + p.nx * len} y2={p.y + p.ny * len} stroke={color} strokeWidth="4.4" strokeLinecap="round" />
  ))
}

function Art({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'bands':
    case 'halloween':
    case 'valentine':
    case 'usa': {
      const palette = { bands: ['#2f6fb0'], halloween: ['#f08c2b', '#1f1b18'], valentine: ['#e5484d', '#f49ac1'], usa: ['#c8372d', '#f4f1ec', '#2f5fb0'] }[kind]
      return (
        <Neck>
          {crest(6).map((p, i) => (
            <g key={i}>
              <line x1={p.x} y1={p.y} x2={p.x + p.nx * 14} y2={p.y + p.ny * 14} stroke={HAIR} strokeWidth="5" strokeLinecap="round" />
              <rect x={p.x + p.nx * 5 - 3.2} y={p.y + p.ny * 5 - 1.6} width="6.4" height="3.2" rx="1.4" fill={palette[i % palette.length]} stroke={kind === 'usa' ? '#9a948c' : 'none'} strokeWidth="0.5" />
            </g>
          ))}
          {kind === 'valentine' && <path d="M50 58 C42 50 44 44 50 48 C56 44 58 50 50 58 Z" fill="#e5484d" />}
          {kind === 'usa' && <path d="M50 44 l2.4 5 5.4 0.6 -4 3.7 1.1 5.3 -4.9 -2.7 -4.9 2.7 1.1 -5.3 -4 -3.7 5.4 -0.6 Z" fill="#2f5fb0" />}
          {kind === 'halloween' && (
            <g>
              <circle cx="50" cy="52" r="7" fill="#f08c2b" />
              <rect x="49" y="43" width="2" height="4" fill="#3fae5b" />
              <path d="M46.5 51 l1.6 -1.6 l1.6 1.6 M51.5 51 l1.6 -1.6 l1.6 1.6 M47 55 q3 2.4 6 0" stroke="#1f1b18" strokeWidth="1" fill="none" />
            </g>
          )}
        </Neck>
      )
    }
    case 'bubble':
    case 'rainbow':
      return (
        <Neck>
          {crest(5).map((p, i) => (
            <g key={i}>
              <circle cx={p.x + p.nx * 4.5} cy={p.y + p.ny * 4.5} r="4.2" fill={HAIR} />
              <circle cx={p.x + p.nx * 13} cy={p.y + p.ny * 13} r="4.6" fill={HAIR} />
              <rect x={p.x + p.nx * 8.7 - 3} y={p.y + p.ny * 8.7 - 1.4} width="6" height="2.8" rx="1.2" fill={kind === 'rainbow' ? RAINBOW[i % RAINBOW.length] : '#2f6fb0'} />
              {kind === 'rainbow' && <rect x={p.x + p.nx * 17.5 - 3} y={p.y + p.ny * 17.5 - 1.4} width="6" height="2.8" rx="1.2" fill={RAINBOW[(i + 3) % RAINBOW.length]} />}
            </g>
          ))}
        </Neck>
      )
    case 'buttons':
      return <Neck>{crest(6).map((p, i) => <circle key={i} cx={p.x + p.nx * 5} cy={p.y + p.ny * 5} r="4.6" fill={HAIR} stroke={HAIR_DARK} strokeWidth="1.2" />)}</Neck>
    case 'hunter':
      return (
        <Neck>
          {crest(10).map((p, i) => (
            <g key={i}>
              <ellipse cx={p.x + p.nx * 4} cy={p.y + p.ny * 4} rx="2.4" ry="3.6" fill={HAIR} stroke={HAIR_DARK} strokeWidth="0.6" />
              <circle cx={p.x + p.nx * 7.4} cy={p.y + p.ny * 7.4} r="1.1" fill="#2f6fb0" />
            </g>
          ))}
        </Neck>
      )
    case 'running':
    case 'christmas': {
      const pts = crest(7, 0.1, 0.9)
      return (
        <Neck>
          {pts.slice(1).map((p, i) => {
            const a = pts[i]
            return <Braid key={i} x1={a.x + a.nx * 5} y1={a.y + a.ny * 5} x2={p.x + p.nx * 5} y2={p.y + p.ny * 5} n={2} w={5.4} color={kind === 'christmas' ? (i % 2 ? '#c8372d' : '#2f8a4c') : HAIR} />
          })}
          {kind === 'christmas' && (
            <g transform={`translate(${pts[0].x + 6} ${pts[0].y + 14})`}>
              <path d="M0 0 l-7 -4.5 l0 9 Z M0 0 l7 -4.5 l0 9 Z" fill="#c8372d" />
              <circle r="2" fill="#f2c94c" />
            </g>
          )}
        </Neck>
      )
    }
    case 'fishtail':
      return (
        <Neck>
          {maneStrands(7, 7)}
          {crest(3, 0.22, 0.78).map((p, i) => (
            <Braid key={i} x1={p.x + p.nx * 2} y1={p.y + p.ny * 2} x2={p.x + p.nx * 30} y2={p.y + p.ny * 30} n={7} w={5} />
          ))}
        </Neck>
      )
    case 'continental': {
      const top = crest(5, 0.1, 0.9).map((p) => ({ x: p.x + p.nx * 4, y: p.y + p.ny * 4, nx: p.nx, ny: p.ny }))
      const mid = top.slice(1).map((p, i) => ({ x: (p.x + top[i].x) / 2 + p.nx * 13, y: (p.y + top[i].y) / 2 + p.ny * 13 }))
      return (
        <Neck>
          {top.map((p, i) => (
            <circle key={'t' + i} cx={p.x} cy={p.y} r="2.4" fill="#2f6fb0" />
          ))}
          {mid.map((m, i) => (
            <g key={'m' + i} stroke={HAIR} strokeWidth="3.2" strokeLinecap="round">
              <line x1={top[i].x} y1={top[i].y} x2={m.x} y2={m.y} />
              <line x1={top[i + 1].x} y1={top[i + 1].y} x2={m.x} y2={m.y} />
              <line x1={m.x} y1={m.y} x2={m.x + top[i].nx * 12} y2={m.y + top[i].ny * 12} />
              <circle cx={m.x} cy={m.y} r="2.2" fill="#2f6fb0" stroke="none" />
            </g>
          ))}
        </Neck>
      )
    }
    case 'loops': {
      const pts = crest(6, 0.1, 0.9).map((p) => ({ x: p.x + p.nx * 3, y: p.y + p.ny * 3, nx: p.nx, ny: p.ny }))
      return (
        <Neck>
          {pts.slice(1).map((p, i) => {
            const a = pts[i]
            const mx = (a.x + p.x) / 2 + p.nx * 20
            const my = (a.y + p.y) / 2 + p.ny * 20
            return <path key={i} d={`M${a.x} ${a.y} Q${mx} ${my} ${p.x} ${p.y}`} stroke={HAIR} strokeWidth="4.4" fill="none" strokeLinecap="round" />
          })}
          {pts.map((p, i) => (
            <circle key={'b' + i} cx={p.x} cy={p.y} r="2.2" fill="#2f6fb0" />
          ))}
        </Neck>
      )
    }
    case 'ribbons':
      return (
        <Neck>
          {crest(5, 0.12, 0.88).map((p, i) => (
            <g key={i}>
              <Braid x1={p.x + p.nx * 2} y1={p.y + p.ny * 2} x2={p.x + p.nx * 18} y2={p.y + p.ny * 18} n={4} w={4.6} />
              <g transform={`translate(${p.x + p.nx * 19} ${p.y + p.ny * 19})`}>
                <path d="M0 0 l-4 -2.6 l0 5.2 Z M0 0 l4 -2.6 l0 5.2 Z" fill={['#c8372d', '#7c5cc4', '#2f8a4c'][i % 3]} />
              </g>
            </g>
          ))}
        </Neck>
      )
    case 'flowers':
      return (
        <Neck>
          {crest(5).map((p, i) => {
            const cx = p.x + p.nx * 5
            const cy = p.y + p.ny * 5
            const petal = ['#f49ac1', '#f2c94c', '#ffffff', '#b99ae6', '#f49ac1'][i]
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="4.6" fill={HAIR} stroke={HAIR_DARK} strokeWidth="1" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={cx + Math.cos((a * Math.PI) / 180) * 2.6} cy={cy + Math.sin((a * Math.PI) / 180) * 2.6} r="1.7" fill={petal} />
                ))}
                <circle cx={cx} cy={cy} r="1.3" fill="#f08c2b" />
              </g>
            )
          })}
        </Neck>
      )
    case 'rope': {
      const pts = crest(8, 0.1, 0.9)
      return (
        <Neck>
          {pts.slice(1).map((p, i) => {
            const a = pts[i]
            const x1 = a.x + a.nx * 5
            const y1 = a.y + a.ny * 5
            const x2 = p.x + p.nx * 5
            const y2 = p.y + p.ny * 5
            return (
              <g key={i} stroke={i % 2 ? HAIR_DARK : HAIR} strokeWidth="4.6" strokeLinecap="round">
                <line x1={x1 + a.nx * 2} y1={y1 + a.ny * 2} x2={x2 - p.nx * 2} y2={y2 - p.ny * 2} />
              </g>
            )
          })}
        </Neck>
      )
    }
    case 'tail-bubble':
      return (
        <Rump>
          <path d="M52 16 Q60 18 60 26" stroke={HAIR} strokeWidth="5" fill="none" strokeLinecap="round" />
          {[31, 41, 51, 60].map((y, i) => (
            <g key={y}>
              <ellipse cx="60" cy={y} rx="5" ry="5.4" fill={HAIR} />
              <rect x="55.5" y={y + 4.4} width="9" height="2.4" rx="1" fill={['#2f6fb0', '#e5484d', '#3fae5b', '#f2c94c'][i]} />
            </g>
          ))}
        </Rump>
      )
    case 'tail-ribbon':
      return (
        <Rump>
          <path d="M52 16 Q60 18 60 26" stroke={HAIR} strokeWidth="5" fill="none" strokeLinecap="round" />
          <Braid x1={60} y1={26} x2={58} y2={58} n={8} w={5} />
          <path d="M62 28 Q56 36 62 44 Q56 50 60 56" stroke="#7c5cc4" strokeWidth="1.6" fill="none" />
          <g transform="translate(58 60)">
            <path d="M0 0 l-6 -3.6 l0 7.2 Z M0 0 l6 -3.6 l0 7.2 Z" fill="#7c5cc4" />
            <circle r="1.6" fill="#b99ae6" />
          </g>
        </Rump>
      )
    case 'tail-plait':
      return (
        <Rump>
          <path d="M52 16 Q60 18 60 26" stroke={HAIR} strokeWidth="5" fill="none" strokeLinecap="round" />
          <Braid x1={60} y1={26} x2={58} y2={66} n={9} w={5} />
          <rect x="55" y="64" width="6" height="2.6" rx="1" fill="#2f6fb0" />
          <path d="M58 66 l-3 6 M58 66 l0 6 M58 66 l3 6" stroke={HAIR} strokeWidth="1.6" strokeLinecap="round" />
        </Rump>
      )
    case 'tail-french':
      return (
        <Rump>
          <Braid x1={53} y1={15} x2={60} y2={38} n={5} w={4.6} />
          <path d="M57 38 Q50 56 56 70 M60 38 Q62 56 60 70 M62 38 Q70 54 66 70" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
        </Rump>
      )
    case 'tail-mud':
      return (
        <Rump>
          <path d="M52 16 Q60 18 60 28" stroke={HAIR} strokeWidth="5" fill="none" strokeLinecap="round" />
          <Braid x1={60} y1={28} x2={59} y2={44} n={4} w={5} />
          <ellipse cx="59" cy="50" rx="6" ry="8" fill={HAIR} />
          <rect x="53" y="46" width="12" height="4" rx="1.5" fill="#c8372d" />
          <rect x="53" y="52" width="12" height="3" rx="1.5" fill="#c8372d" />
        </Rump>
      )
    case 'tail-web':
      return (
        <Rump>
          <path d="M52 16 Q58 18 60 28 Q64 50 58 70 M56 24 Q52 50 50 70 M62 26 Q70 50 66 70" stroke={HAIR} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <g stroke="#f4f1ec" strokeWidth="0.8" fill="none">
            <path d="M58 46 l-8 -8 M58 46 l8 -8 M58 46 l-9 6 M58 46 l9 6 M58 46 l0 -12 M58 46 l0 12" />
            <circle cx="58" cy="46" r="4" />
            <circle cx="58" cy="46" r="8" />
          </g>
          <circle cx="58" cy="46" r="2.2" fill="#1f1b18" />
          <path d="M55.5 44.5 l-2 -1 M55.5 47.5 l-2 1 M60.5 44.5 l2 -1 M60.5 47.5 l2 1" stroke="#1f1b18" strokeWidth="0.8" />
        </Rump>
      )
    case 'tail':
      return (
        <Rump>
          <path d="M52 16 Q60 18 60 30 Q64 52 58 70 M56 24 Q52 50 50 70 M62 26 Q70 50 66 70" stroke={HAIR} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </Rump>
      )
    default:
      return <Neck>{maneStrands(8, 14)}</Neck>
  }
}

export function HairArt({ style, size = 56 }: { style: Hairstyle; size?: number }) {
  return (
    <svg viewBox="0 0 72 72" width={size} height={size} className="hair-art" role="img" aria-label={`Drawing of ${style.name}`}>
      <rect width="72" height="72" rx="12" fill="#bcd3e6" />
      <Art kind={hairKind(style)} />
    </svg>
  )
}
