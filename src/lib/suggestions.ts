import { nameFromUrl } from './shop'
import type { ShopCategory, ShopItem } from './types'

export type Suggestion = {
  key: string
  name: string
  category: ShopCategory
  why: string
  /** Words that mean you already have it on your list (lowercase). */
  match: string[]
  /** Months (1–12) when it's worth suggesting; all year if missing. */
  months?: number[]
  essential?: boolean
}

const WINTER = [10, 11, 12, 1, 2, 3]
const FLY_SEASON = [3, 4, 5, 6, 7, 8, 9, 10]

export const SUGGESTIONS: Suggestion[] = [
  // Grooming
  { key: 'hoof-pick', name: 'Hoof pick', category: 'Grooming', why: 'Clean hooves before and after every ride.', match: ['hoof pick'], essential: true },
  { key: 'curry', name: 'Rubber curry comb', category: 'Grooming', why: 'Loosens dirt and hair; most horses love it.', match: ['curry'], essential: true },
  { key: 'dandy', name: 'Hard (dandy) brush', category: 'Grooming', why: 'Flicks off the dirt the curry loosens.', match: ['dandy', 'hard brush', 'stiff brush'], essential: true },
  { key: 'body-brush', name: 'Soft body brush', category: 'Grooming', why: 'For the face, legs and a shiny finish.', match: ['body brush', 'soft brush', 'finishing brush'], essential: true },
  { key: 'mane-comb', name: 'Mane & tail comb or brush', category: 'Grooming', why: 'Detangles before braiding.', match: ['mane comb', 'tail brush', 'mane brush', 'mane and tail brush'], essential: true },
  { key: 'detangler', name: 'Mane & tail detangler spray', category: 'Grooming', why: 'Keeps EJ’s white tail smooth and easy to brush.', match: ['detangler', 'show sheen', 'shine spray'] },
  { key: 'whitening-shampoo', name: 'Whitening shampoo', category: 'Grooming', why: 'Gray horses stain easily; brightens yellow spots.', match: ['whitening', 'purple shampoo', 'quicksilver', 'shampoo'] },
  { key: 'sweat-scraper', name: 'Sweat scraper', category: 'Grooming', why: 'Removes water after a bath so he dries faster.', match: ['sweat scraper', 'scraper'] },
  { key: 'grooming-tote', name: 'Grooming tote / bag', category: 'Grooming', why: 'Keeps all the brushes together at the barn.', match: ['tote', 'grooming bag', 'grooming box', 'caddy'] },
  { key: 'braiding-bands', name: 'Braiding bands (rubber)', category: 'Grooming', why: 'Needed for most styles in Beautify.', match: ['braiding band', 'rubber band', 'bands'] },
  // Health & first aid
  { key: 'first-aid', name: 'Equine first-aid kit', category: 'Health & first aid', why: 'For small cuts and scrapes until the vet arrives.', match: ['first aid', 'first-aid'], essential: true },
  { key: 'thermometer', name: 'Digital thermometer', category: 'Health & first aid', why: 'A fever is the first sign to call the vet (above 101.5 °F).', match: ['thermometer'], essential: true },
  { key: 'vet-wrap', name: 'Vet wrap', category: 'Health & first aid', why: 'Self-sticking bandage for legs and hooves.', match: ['vet wrap', 'cohesive bandage'] },
  { key: 'wound-spray', name: 'Wound spray / ointment', category: 'Health & first aid', why: 'Keeps small cuts clean while they heal.', match: ['wound', 'blu-kote', 'ointment', 'antiseptic'] },
  { key: 'fly-spray', name: 'Fly spray', category: 'Health & first aid', why: 'Keeps flies off during warm months.', match: ['fly spray', 'repellent'], months: FLY_SEASON },
  { key: 'fly-mask', name: 'Fly mask', category: 'Health & first aid', why: 'Protects his eyes from flies and sun.', match: ['fly mask'], months: FLY_SEASON },
  { key: 'dewormer', name: 'Dewormer (ask Dr. Novick which)', category: 'Health & first aid', why: 'His deworming history is unknown; ask the vet first.', match: ['dewormer', 'wormer', 'ivermectin', 'quest'] },
  // Tack
  { key: 'halter', name: 'Halter', category: 'Tack', why: 'His own halter for leading and tying.', match: ['halter'], essential: true },
  { key: 'lead-rope', name: 'Lead rope', category: 'Tack', why: 'Goes with the halter.', match: ['lead rope', 'lead line'], essential: true },
  { key: 'saddle-pad', name: 'Saddle pad', category: 'Tack', why: 'Protects his back; a spare is handy for wash days.', match: ['saddle pad', 'pad'] },
  { key: 'girth', name: 'Girth (fitted to EJ)', category: 'Tack', why: 'Check the size with Rachel before buying.', match: ['girth', 'cinch'] },
  { key: 'bridle', name: 'Bridle & bit (fitted)', category: 'Tack', why: 'Ask Rachel what fits him best.', match: ['bridle', 'bit'] },
  { key: 'boots', name: 'Brushing / jumping boots', category: 'Tack', why: 'Protect his legs, especially for jumping.', match: ['brushing boot', 'jumping boot', 'open front', 'splint boot', 'leg boot'] },
  { key: 'tack-cleaner', name: 'Tack cleaner & conditioner', category: 'Tack', why: 'Weekly task: clean and condition tack.', match: ['tack clean', 'saddle soap', 'leather conditioner', 'leather cleaner'] },
  // Winter
  { key: 'winter-rug', name: 'Winter turnout blanket (rug)', category: 'Tack', why: 'For cold, rainy days, especially if he’s clipped.', match: ['blanket', 'rug', 'turnout'], months: WINTER },
  { key: 'cooler', name: 'Cooler / fleece sheet', category: 'Tack', why: 'Helps him dry after riding in the cold.', match: ['cooler', 'fleece'], months: WINTER },
  { key: 'clippers', name: 'Clippers', category: 'Grooming', why: 'For winter clipping (see Care in Health).', match: ['clipper'], months: [9, 10, 11, 12, 1, 2] },
  // Feed & treats
  { key: 'treats', name: 'Horse treats', category: 'Feed & treats', why: 'Rewards; see Nutrition for healthy limits.', match: ['treat', 'cookie', 'stud muffin'] },
  { key: 'salt-lick', name: 'Salt / mineral lick', category: 'Feed & treats', why: 'Horses need salt every day.', match: ['salt', 'mineral', 'lick'] },
  { key: 'feed-bucket', name: 'Feed bucket', category: 'Barn & stable', why: 'His own bucket for feed or treats.', match: ['feed bucket', 'feeder', 'bucket'] },
  { key: 'hay-net', name: 'Hay net / slow feeder', category: 'Barn & stable', why: 'Slows eating and keeps hay off the ground.', match: ['hay net', 'haynet', 'slow feeder', 'hay bag'] },
  // Rider gear (Sofía)
  { key: 'helmet', name: 'Riding helmet (ASTM/SEI)', category: 'Rider gear', why: 'Replace after any fall or every ~5 years.', match: ['helmet'], essential: true },
  { key: 'riding-boots', name: 'Riding boots (with heel)', category: 'Rider gear', why: 'A heel stops the foot sliding through the stirrup.', match: ['paddock boot', 'riding boot', 'tall boot', 'jodhpur boot'] },
  { key: 'gloves', name: 'Riding gloves', category: 'Rider gear', why: 'Better grip on the reins, fewer blisters.', match: ['glove'] },
  { key: 'half-chaps', name: 'Half chaps', category: 'Rider gear', why: 'Grip and comfort with paddock boots.', match: ['half chap', 'chaps'] },
  { key: 'safety-vest', name: 'Safety vest (for jumping)', category: 'Rider gear', why: 'Extra protection as jumps get bigger.', match: ['safety vest', 'body protector', 'vest'] },
  // Fun
  { key: 'glitter', name: 'Hoof polish or glitter gel', category: 'Fun', why: 'For themed looks in Beautify.', match: ['glitter', 'hoof polish'] },
  { key: 'ribbons', name: 'Braiding ribbons', category: 'Fun', why: 'For ribbon braids and bows.', match: ['ribbon'] },
  { key: 'treat-toy', name: 'Stall toy / treat ball', category: 'Fun', why: 'Keeps him busy in the stall.', match: ['toy', 'treat ball', 'jolly ball', 'likit'] },
]

/** The words we compare against: the product name from the link, the note and the link itself. */
export function itemText(i: ShopItem) {
  return [nameFromUrl(i.url), i.note ?? '', decodeURIComponent(i.url)].join(' ').toLowerCase().replace(/[-_+]/g, ' ')
}

export type SuggestionState = 'bought' | 'listed' | 'have' | 'open'

export function suggestionState(s: Suggestion, items: ShopItem[], dismissed: string[]): SuggestionState {
  if (dismissed.includes(s.key)) return 'have'
  const words = s.match.map((m) => new RegExp(`(^|[^a-z])${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?([^a-z]|$)`))
  const hit = items.filter((i) => {
    const t = itemText(i)
    return words.some((w) => w.test(t))
  })
  if (hit.some((i) => i.bought)) return 'bought'
  if (hit.length) return 'listed'
  return 'open'
}

export function inSeason(s: Suggestion, month: number) {
  return !s.months || s.months.includes(month)
}

export function amazonSearch(name: string) {
  return 'https://www.amazon.com/s?k=' + encodeURIComponent(name.replace(/\(.*?\)/g, '').trim())
}
