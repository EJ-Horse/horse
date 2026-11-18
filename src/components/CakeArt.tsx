import type { ReactElement } from 'react'
import type { Cake } from '../lib/cakes'

/** Small drawings of each horse-safe cake, made from its real shape and ingredients (no stock photos). */

type Shape =
  | 'round' | 'layer' | 'dome' | 'loaf' | 'cupcake' | 'cookie' | 'ring' | 'slice' | 'rainbow' | 'heart' | 'horseshoe' | 'number'
  | 'apple' | 'pie' | 'stack' | 'balls' | 'bar' | 'tower' | 'bowl' | 'pops' | 'block' | 'icecake' | 'sunflower'

const SHAPE: Record<string, Shape> = {
  'carrot-candle': 'layer', 'oat-carrot': 'round', 'banana-cupcakes': 'cupcake', 'frozen-ring': 'ring', watermelon: 'slice', 'beet-pulp': 'dome',
  pumpkin: 'round', 'hay-cube': 'dome', 'classic-carrot': 'layer', 'apple-crumble': 'round', 'pear-oat': 'round', 'sweet-potato': 'round',
  butternut: 'round', 'zucchini-loaf': 'loaf', 'orange-cranberry': 'round', horseshoe: 'horseshoe', number: 'number', 'oat-cookies': 'cookie',
  gingerbread: 'cookie', 'stuffed-apples': 'apple', 'mini-apple-pies': 'pie', 'pumpkin-muffins': 'cupcake', 'peppermint-cupcakes': 'cupcake',
  'rice-cake-tower': 'stack', 'date-bites': 'balls', 'granola-bars': 'bar', 'berry-blast': 'dome', tropical: 'dome', rainbow: 'rainbow',
  heart: 'heart', 'carrot-tower': 'tower', 'garden-veg': 'dome', 'salad-stack': 'layer', 'mint-fresh': 'dome', 'cheerio-crown': 'round',
  'popcorn-party': 'dome', sunflower: 'sunflower', meadow: 'dome', 'sweet-corn': 'dome', 'melon-tower': 'stack', 'bran-mash': 'bowl',
  'senior-soft': 'bowl', 'chamomile-calm': 'dome', 'carrot-pops': 'pops', 'cucumber-cooler': 'icecake', 'berry-ice-cups': 'pops',
  'ice-block': 'block', 'watermelon-ice': 'ring',
}

/** Colour of each food, used for the cake body and its toppings. */
const COLOR: Record<string, string> = {
  'Timothy pellets': '#9aa35c', 'Beet pulp (soaked)': '#7d5a43', 'Oatmeal (plain)': '#d8b47a', Pumpkin: '#e88a2e', 'Sweet potato': '#df7a38',
  'Butternut squash': '#efa24c', Watermelon: '#ef476f', 'Cantaloupe / melon': '#f8a35b', 'Honeydew melon': '#c9e8a8', 'Plain rice cakes': '#efe0bd',
  'Chaff (chopped hay)': '#c9b26b', 'Horse feed (pellets / sweet feed)': '#b08a5a', 'Romaine lettuce': '#8ac926', Apples: '#d64045',
  'Dates (pitted)': '#6f4518', 'Granola (no chocolate)': '#c58b4b', Zucchini: '#4c956c', Carrots: '#f28c28', Strawberries: '#e63946',
  Blueberries: '#3a5ba0', Raspberries: '#d62860', Blackberries: '#3b1f3b', 'Mint leaves': '#4caf50', Bananas: '#f6e27f', Mango: '#ffb627',
  'Grapes (seedless)': '#7b3f8c', Cucumber: '#8cc084', 'Plain Cheerios / oat cereal': '#e6c278', 'Plain popcorn': '#fff4cf',
  'Sunflower seeds (black oil)': '#2e2a26', 'Pumpkin seeds': '#7fa650', Raisins: '#5a3a2a', Cranberries: '#b0203a', Coconut: '#fbf7ee',
  Pineapple: '#f6d55c', Papaya: '#f4845f', Dandelions: '#ffd60a', Clover: '#f2c1d1', Celery: '#a7c957', 'Peas & snap peas': '#6a994e',
  'Sweet corn': '#ffd23f', Parsley: '#2d6a4f', 'Beets (beetroot)': '#a0204f', 'Green beans': '#4f772d', 'Orange segments': '#f9844a',
  'Carrot tops': '#52b788', Pears: '#c9d76b', Peppermints: '#f4f4f4', 'Peanut butter': '#b07a3c', Chamomile: '#fff3b0', Ginger: '#e8c07a',
  'Alfalfa cubes': '#7f9a46', 'Applesauce (unsweetened)': '#f1d9a0', 'Wheat bran': '#b98b55',
}
/** Ingredients mixed into the cake rather than showing on top. */
const HIDDEN = new Set(['Coconut oil', 'Ground flaxseed', 'Wheat bran', 'Molasses', 'Applesauce (unsweetened)', 'Oatmeal (plain)', 'Ginger', 'Chamomile'])
const BODY: Record<string, string> = { heart: '#e56b8f', 'apple-crumble': '#d8b47a', 'pear-oat': '#dcc58a', 'orange-cranberry': '#e9b77a', 'classic-carrot': '#e0a35c', 'salad-stack': '#8ac926', 'carrot-tower': '#f28c28', 'cheerio-crown': '#9aa35c' }
const ICE = '#cfeefb'

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`
}

/** Deterministic spread of dots over an ellipse, so every cake always looks the same. */
function spots(n: number, cx: number, cy: number, rx: number, ry: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = i * 2.39996 // golden angle
    const r = Math.sqrt((i + 0.5) / n)
    return [cx + Math.cos(a) * r * rx, cy + Math.sin(a) * r * ry] as const
  })
}

function Candles({ n, x, y }: { n: number; x: number; y: number }) {
  const xs = n === 1 ? [x] : Array.from({ length: n }, (_, i) => x - 9 + (18 / (n - 1)) * i)
  return (
    <g>
      {xs.map((cx, i) => (
        <g key={i}>
          <rect x={cx - 1.6} y={y - 11} width={3.2} height={11} rx={1.4} fill="#f28c28" stroke="#c96a12" strokeWidth={0.5} />
          {/* carrot-top leaves instead of a flame: carrot candles are never lit */}
          <path d={`M${cx} ${y - 11} q-3 -4 -2 -7 M${cx} ${y - 11} q0 -5 1 -8 M${cx} ${y - 11} q3 -3 3 -6`} stroke="#3f9d4b" strokeWidth={1.3} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

export function CakeArt({ cake, age, size = 56 }: { cake: Cake; age?: number; size?: number }) {
  const shape = SHAPE[cake.key] ?? (cake.kind === 'frozen' ? 'icecake' : cake.kind === 'mini' ? 'cupcake' : 'dome')
  const foods = cake.ingredients.map((i) => i.food).filter((f): f is string => !!f)
  const frozen = cake.kind === 'frozen'
  const bodyFood = foods[0]
  const body = BODY[cake.key] ?? (frozen ? ICE : (bodyFood && COLOR[bodyFood]) || '#d8b47a')
  const tops = [...new Set(foods.slice(1).filter((f) => !HIDDEN.has(f) && COLOR[f] && f !== bodyFood))].map((f) => COLOR[f])
  if (!tops.length && bodyFood === 'Oatmeal (plain)') tops.push('#f28c28')
  const text = cake.ingredients.map((i) => i.text).join(' ').toLowerCase()
  const candles = /single candle|1 carrot candle|one carrot candle|carrot candle$/.test(text) ? 1 : /candle/.test(text) ? 3 : 0
  const dark = shade(body, -0.18)
  const light = shade(body, 0.1)
  const dots = (cx: number, cy: number, rx: number, ry: number, n = 9, r = 2.3) =>
    spots(Math.max(n, tops.length), cx, cy, rx, ry).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={tops[i % tops.length] ?? dark} stroke="rgba(0,0,0,.15)" strokeWidth={0.4} />)

  let art: ReactElement
  let candleY = 30
  switch (shape) {
    case 'round':
    case 'layer':
    case 'icecake': {
      const fill = shape === 'icecake' ? ICE : body
      art = (
        <g opacity={shape === 'icecake' ? 0.92 : 1}>
          <rect x={10} y={30} width={44} height={20} fill={shade(fill, -0.05)} />
          <ellipse cx={32} cy={50} rx={22} ry={5.5} fill={shade(fill, -0.15)} />
          <rect x={10} y={30} width={44} height={20} fill={fill} />
          {shape === 'layer' && <rect x={10} y={39} width={44} height={3.5} fill={tops[0] ?? light} />}
          {shape === 'icecake' && dots(32, 41, 17, 6, 8, 2.4)}
          <ellipse cx={32} cy={30} rx={22} ry={6} fill={shape === 'icecake' ? '#e8f8ff' : light} />
          {shape !== 'icecake' && dots(32, 30, 17, 3.8)}
        </g>
      )
      break
    }
    case 'dome':
      candleY = 22
      art = (
        <g>
          <path d="M9 50 Q9 20 32 18 Q55 20 55 50 Z" fill={body} />
          <path d="M9 50 Q9 20 32 18 Q20 24 18 50 Z" fill={light} opacity={0.45} />
          <ellipse cx={32} cy={50} rx={23} ry={4} fill={dark} />
          {dots(32, 34, 15, 11, 11)}
        </g>
      )
      break
    case 'loaf':
      candleY = 28
      art = (
        <g>
          <rect x={7} y={30} width={50} height={20} rx={4} fill={body} />
          <path d="M7 34 Q32 20 57 34 L57 36 L7 36 Z" fill={light} />
          {dots(32, 30, 18, 2.5, 7, 2)}
        </g>
      )
      break
    case 'cupcake':
      candleY = 26
      art = (
        <g>
          <path d="M16 36 L48 36 L44 54 L20 54 Z" fill="#f5d5b5" />
          {[20, 26, 32, 38, 44].map((x) => (
            <line key={x} x1={x} y1={36} x2={x - (x - 32) * 0.12} y2={54} stroke="#e2b88f" strokeWidth={1.2} />
          ))}
          <path d="M13 37 Q14 22 32 22 Q50 22 51 37 Z" fill={body} />
          {dots(32, 30, 11, 4, 5, 2.4)}
        </g>
      )
      break
    case 'cookie':
      art = (
        <g>
          <ellipse cx={24} cy={44} rx={15} ry={9} fill={dark} />
          <ellipse cx={24} cy={42} rx={15} ry={9} fill={body} />
          <ellipse cx={42} cy={36} rx={14} ry={8} fill={dark} />
          <ellipse cx={42} cy={34} rx={14} ry={8} fill={light} />
          {spots(6, 24, 42, 10, 5).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.4} fill={tops[i % Math.max(1, tops.length)] ?? dark} />
          ))}
          {spots(5, 42, 34, 9, 4).map(([x, y], i) => (
            <circle key={'b' + i} cx={x} cy={y} r={1.3} fill={dark} />
          ))}
        </g>
      )
      break
    case 'ring':
      art = (
        <g opacity={frozen ? 0.92 : 1}>
          <rect x={9} y={32} width={46} height={16} fill={shade(body, -0.06)} />
          <ellipse cx={32} cy={48} rx={23} ry={6} fill={dark} />
          <ellipse cx={32} cy={32} rx={23} ry={7} fill={frozen ? '#e8f8ff' : light} />
          {dots(32, 40, 20, 5, 10, 2.3)}
          <ellipse cx={32} cy={32} rx={7} ry={2.5} fill="#ffffff" stroke={dark} strokeWidth={0.6} />
        </g>
      )
      break
    case 'slice':
      art = (
        <g>
          <ellipse cx={32} cy={44} rx={24} ry={9} fill="#3a8d3f" />
          <ellipse cx={32} cy={41} rx={23} ry={8.5} fill="#bfe3a3" />
          <ellipse cx={32} cy={40} rx={21} ry={7.5} fill={body} />
          {dots(32, 40, 15, 4.5, 9, 2.4)}
        </g>
      )
      candleY = 38
      break
    case 'rainbow': {
      const bands = ['#e63946', '#f28c28', '#ffb627', '#8cc084', '#3a5ba0', '#7b3f8c']
      art = (
        <g>
          <ellipse cx={32} cy={46} rx={24} ry={8} fill={dark} />
          <ellipse cx={32} cy={43} rx={24} ry={8} fill={body} />
          {bands.map((c, i) => (
            <path key={c} d={`M${12 + i * 2.2} 45 Q32 ${30 + i * 2.4} ${52 - i * 2.2} 45`} stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          ))}
        </g>
      )
      candleY = 40
      break
    }
    case 'heart':
      art = (
        <g>
          <path d="M32 54 C10 40 8 26 18 21 C25 18 30 22 32 26 C34 22 39 18 46 21 C56 26 54 40 32 54 Z" fill={dark} transform="translate(0 2)" />
          <path d="M32 54 C10 40 8 26 18 21 C25 18 30 22 32 26 C34 22 39 18 46 21 C56 26 54 40 32 54 Z" fill={body} />
          {spots(8, 32, 34, 13, 8).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.3} fill={tops[i % Math.max(1, tops.length)] ?? '#e63946'} />
          ))}
        </g>
      )
      candleY = 24
      break
    case 'horseshoe':
      art = (
        <g>
          <path d="M14 22 L14 36 A18 16 0 0 0 50 36 L50 22 L41 22 L41 36 A9 8 0 0 1 23 36 L23 22 Z" fill={dark} transform="translate(0 3)" />
          <path d="M14 22 L14 36 A18 16 0 0 0 50 36 L50 22 L41 22 L41 36 A9 8 0 0 1 23 36 L23 22 Z" fill={body} />
          {[
            [18.5, 27], [18.5, 36], [24, 45], [40, 45], [45.5, 36], [45.5, 27],
          ].map(([x, y], i) => (
            <rect key={i} x={x - 1.4} y={y - 2.5} width={2.8} height={5} rx={1} fill="#f28c28" />
          ))}
        </g>
      )
      candleY = 0
      break
    case 'number':
      art = (
        <g>
          <text x={32} y={52} textAnchor="middle" fontSize={34} fontWeight={900} fontFamily="system-ui, sans-serif" fill={dark} transform="translate(0 2)">
            {age ?? 13}
          </text>
          <text x={32} y={52} textAnchor="middle" fontSize={34} fontWeight={900} fontFamily="system-ui, sans-serif" fill={body} stroke={dark} strokeWidth={0.8}>
            {age ?? 13}
          </text>
          <circle cx={20} cy={22} r={2.2} fill="#e63946" />
          <circle cx={44} cy={22} r={2.2} fill="#3a5ba0" />
          <circle cx={32} cy={20} r={2.2} fill="#e63946" />
        </g>
      )
      candleY = 0
      break
    case 'apple':
      art = (
        <g>
          {[20, 44].map((x, k) => (
            <g key={x} transform={`translate(${x} ${k ? 36 : 40})`}>
              <path d="M0 -12 C-12 -14 -14 2 -8 10 C-5 14 -2 13 0 12 C2 13 5 14 8 10 C14 2 12 -14 0 -12 Z" fill="#d64045" />
              <ellipse cx={0} cy={-10} rx={6} ry={2.5} fill="#d8b47a" />
              <circle cx={-2} cy={-11} r={1.2} fill="#f28c28" />
              <circle cx={2} cy={-10} r={1.2} fill="#f28c28" />
              <path d="M0 -12 q1 -4 3 -5" stroke="#5a3a2a" strokeWidth={1.4} fill="none" />
            </g>
          ))}
        </g>
      )
      candleY = 0
      break
    case 'pie':
      art = (
        <g>
          {[20, 44].map((x, k) => (
            <g key={x} transform={`translate(${x} ${k ? 38 : 44})`}>
              <path d="M-11 -4 L11 -4 L8 7 L-8 7 Z" fill="#c9995a" />
              <ellipse cx={0} cy={-4} rx={11} ry={4} fill="#d8b47a" />
              <ellipse cx={0} cy={-4} rx={8} ry={2.6} fill="#e9d48b" />
              <circle cx={-3} cy={-4.3} r={1.3} fill="#c8e06b" />
              <circle cx={2.5} cy={-3.6} r={1.3} fill="#d64045" />
            </g>
          ))}
        </g>
      )
      candleY = 0
      break
    case 'stack':
      art = (
        <g>
          <ellipse cx={32} cy={48} rx={20} ry={6} fill={dark} />
          <rect x={12} y={40} width={40} height={8} fill={body} />
          <ellipse cx={32} cy={40} rx={20} ry={6} fill={light} />
          <rect x={16} y={33} width={32} height={7} fill={tops[0] ?? light} />
          <ellipse cx={32} cy={40} rx={16} ry={4.5} fill={shade(tops[0] ?? light, -0.12)} />
          <ellipse cx={32} cy={33} rx={16} ry={4.5} fill={shade(tops[0] ?? light, 0.08)} />
          {spots(5, 32, 33, 10, 2.5).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.1} fill={tops[(i + 1) % Math.max(1, tops.length)] ?? dark} />
          ))}
        </g>
      )
      candleY = 32
      break
    case 'balls':
      art = (
        <g>
          {[
            [20, 46], [33, 47], [46, 45], [26, 36], [40, 36],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={7} fill={body} />
              <circle cx={x - 2} cy={y - 2.5} r={2} fill={light} />
              <circle cx={x + 2} cy={y + 1} r={0.9} fill={tops[i % Math.max(1, tops.length)] ?? dark} />
            </g>
          ))}
        </g>
      )
      candleY = 0
      break
    case 'bar':
      art = (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${8 + i * 4} ${24 + i * 9})`}>
              <rect width={40} height={9} rx={2} fill={dark} transform="translate(0 2)" />
              <rect width={40} height={9} rx={2} fill={body} />
              {spots(6, 20, 4.5, 17, 2.5).map(([x, y], j) => (
                <circle key={j} cx={x} cy={y} r={1.2} fill={j % 2 ? '#7fa650' : light} />
              ))}
            </g>
          ))}
        </g>
      )
      candleY = 0
      break
    case 'tower':
      art = (
        <g>
          <ellipse cx={32} cy={52} rx={22} ry={4} fill="#9aa35c" />
          {[0, 1, 2, 3, 4].map((i) =>
            i % 2 ? (
              <g key={i}>
                <rect x={18} y={44 - i * 6} width={4} height={5} rx={1.5} fill="#e07a1f" />
                <rect x={42} y={44 - i * 6} width={4} height={5} rx={1.5} fill="#e07a1f" />
              </g>
            ) : (
              <g key={i}>
                <rect x={12} y={44 - i * 6} width={40} height={4.5} rx={2} fill="#f28c28" />
                <rect x={12} y={44 - i * 6} width={40} height={1.6} rx={1} fill="#f7a65a" />
              </g>
            ),
          )}
          <path d="M32 20 q-4 -6 -2 -10 M32 20 q1 -7 4 -9 M32 20 q5 -3 7 -7" stroke="#3f9d4b" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )
      candleY = 0
      break
    case 'bowl':
      art = (
        <g>
          <path d="M20 34 Q32 22 44 34 Z" fill={body} />
          {dots(32, 31, 8, 2.5, 5, 1.8)}
          <path d="M10 34 L54 34 Q52 52 32 53 Q12 52 10 34 Z" fill="#6c8ebf" />
          <ellipse cx={32} cy={34} rx={22} ry={4} fill="#88a8d6" />
          <ellipse cx={32} cy={34} rx={18} ry={2.8} fill={body} />
        </g>
      )
      candleY = 30
      break
    case 'pops':
      art = (
        <g>
          {[
            [18, 46], [34, 48], [48, 42], [26, 34], [42, 31],
          ].map(([x, y], i) => (
            <g key={i} opacity={0.93}>
              <rect x={x - 6} y={y - 5} width={12} height={8} fill="#bfe6f7" />
              <ellipse cx={x} cy={y + 3} rx={6} ry={2} fill="#a6dbf2" />
              <ellipse cx={x} cy={y - 5} rx={6} ry={2.2} fill="#e8f8ff" />
              <circle cx={x - 2} cy={y - 1} r={1.6} fill={tops[i % Math.max(1, tops.length)] ?? '#f28c28'} />
              <circle cx={x + 2.2} cy={y + 1} r={1.4} fill={tops[(i + 1) % Math.max(1, tops.length)] ?? '#4caf50'} />
            </g>
          ))}
        </g>
      )
      candleY = 0
      break
    case 'block':
      art = (
        <g opacity={0.94}>
          <path d="M14 18 L50 18 L46 54 L18 54 Z" fill="#bfe6f7" />
          <ellipse cx={32} cy={18} rx={18} ry={4} fill="#e8f8ff" />
          {[0, 1, 2].map((k) =>
            spots(4, 32, 26 + k * 10, 11, 3).map(([x, y], i) => (
              <rect key={k + '-' + i} x={x - 1.3} y={y - 3} width={2.6} height={6} rx={1} fill={tops[(i + k) % Math.max(1, tops.length)] ?? '#f28c28'} transform={`rotate(${(i * 47) % 60 - 30} ${x} ${y})`} />
            )),
          )}
          <path d="M18 22 L20 50" stroke="#ffffff" strokeWidth={1.5} opacity={0.7} />
        </g>
      )
      candleY = 0
      break
    case 'sunflower':
      art = (
        <g>
          <ellipse cx={32} cy={44} rx={24} ry={8} fill={dark} />
          <ellipse cx={32} cy={41} rx={24} ry={8} fill={body} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <ellipse key={i} cx={32 + Math.cos(a) * 13} cy={41 + Math.sin(a) * 4.6} rx={4} ry={1.6} fill="#f28c28" transform={`rotate(${(a * 180) / Math.PI * 0.35} ${32 + Math.cos(a) * 13} ${41 + Math.sin(a) * 4.6})`} />
          })}
          <ellipse cx={32} cy={41} rx={7} ry={2.8} fill="#2e2a26" />
        </g>
      )
      candleY = 0
      break
    default:
      art = <g />
  }

  return (
    <svg className="cake-art" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`Drawing of ${cake.name}`}>
      <ellipse cx={32} cy={56} rx={28} ry={5} fill="#ffffff" stroke="#d9d2c5" strokeWidth={1} />
      {art}
      {candles > 0 && candleY > 0 && <Candles n={candles} x={32} y={candleY} />}
    </svg>
  )
}
