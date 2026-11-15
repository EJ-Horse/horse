export type Profile = {
  name: string
  birthDate?: string
  breed?: string
  color?: string
  height?: string
  stable?: string
  vetName?: string
  vetClinic?: string
  vetPhone?: string
  farrierPhone?: string
  photo?: string
  currency?: string
  maneLength?: Length
  tailLength?: Length
}

export type Vaccine = { name: string; date: string; nextDue?: string; vet?: string; notes?: string }

/** dueOn overrides the computed date (e.g. the vet says it's due now); it clears when marked done. */
export type CareTask = { title: string; lastDone?: string; everyDays: number; notes?: string; seasonal?: string; dueOn?: string }

export type VetVisit = { date: string; vet?: string; reason: string; findings?: string; nextSteps?: string; files?: string[] }

export type Symptom = {
  date: string
  what: string
  where?: string
  severity: 'mild' | 'moderate' | 'serious'
  photos?: string[]
  notes?: string
  resolved?: boolean
  vetCalled?: boolean
}

export const BODY_PARTS = [
  'Face',
  'Teeth',
  'Front',
  'Left side',
  'Right side',
  'Front legs',
  'Back legs',
  'Hooves',
  'Back',
  'Belly – front',
  'Belly – back',
  'Tail',
  'Other',
] as const
export type BodyPart = (typeof BODY_PARTS)[number]

export type HorsePhoto = { part: BodyPart; date: string; path: string; note?: string; issue?: string }

export type Food = {
  name: string
  status: 'allowed' | 'limit' | 'forbidden'
  limit?: string
  liking?: 'loves' | 'likes' | 'meh' | 'dislikes'
  notes?: string
}

export type Length = 'short' | 'medium' | 'long'
export type Difficulty = 'easy' | 'medium' | 'hard'

export type Hairstyle = {
  name: string
  area: 'mane' | 'tail' | 'both'
  lengths: Length[]
  difficulty: Difficulty | 'auto'
  steps: string
  video?: string
  theme?: string
  favorite?: boolean
}

export const SHOP_CATEGORIES = ['Tack', 'Grooming', 'Fun', 'Health & first aid', 'Feed & treats', 'Rider gear', 'Barn & stable', 'Other'] as const
export type ShopCategory = (typeof SHOP_CATEGORIES)[number]
export const SHOP_ICON: Record<ShopCategory, string> = {
  Tack: '🏇',
  Grooming: '🪮',
  Fun: '🎀',
  'Health & first aid': '🩹',
  'Feed & treats': '🥕',
  'Rider gear': '🪖',
  'Barn & stable': '🏠',
  Other: '📦',
}
export type ShopItem = { url: string; note?: string; bought?: boolean; boughtOn?: string; category?: ShopCategory }

export const COST_CATEGORIES = ['Stable', 'Vet', 'Farrier', 'Feed', 'Equipment', 'Lessons', 'Shows', 'Transport', 'Grooming', 'Purchase', 'Other'] as const
/** pending = expected but not paid yet; kept out of the spent totals. */
export type Cost = { date: string; category: string; amount: number; description?: string; invoice?: string; recurring?: boolean; pending?: boolean }

export type Level = 'beginner' | 'intermediate' | 'advanced'
export type Discipline = 'dressage' | 'jumping'
export type Rating = 'needs work' | 'good' | 'excellent'
export type Skill = {
  name: string
  level: Level
  discipline: Discipline
  rating?: Rating
  cues?: string
  video?: string
  ratedOn?: string
}

export type RideType = 'lesson' | 'solo'
export const ACTIVITIES = ['Walk', 'Trot', 'Canter', 'Jumping', 'Poles', 'Flatwork', 'Dressage test', 'Lunging', 'Bareback', 'Trail', 'Groundwork'] as const
export type Feel = 'great' | 'ok' | 'tough'

/** One ride: a lesson with the teacher or a solo ride. Stored as kind 'coach' (older entries are lessons). */
export type CoachEntry = {
  date: string
  title: string
  type?: RideType
  time?: string
  activities?: string[]
  feel?: Feel
  clip?: string
  link?: string
  skills?: string[]
  notes?: string
  feedback?: string
}

/** Weekly plan. day: 0 = Monday … 6 = Sunday; time 'HH:MM'. */
export type RideSlot = { day: number; time: string; type: RideType }
export type RideSchedule = { slots: RideSlot[] }

export type Todo = { text: string; doneWeek?: string; doneBy?: string; oneOff?: boolean }

export const REACTIONS = ['curious', 'bothered', 'freaks out'] as const
export type Reaction = (typeof REACTIONS)[number]

/** Older entries used mild/spooks/big spook. */
export function normalizeReaction(r: string): Reaction {
  if (r === 'mild') return 'curious'
  if (r === 'spooks') return 'bothered'
  if (r === 'big spook') return 'freaks out'
  return (REACTIONS as readonly string[]).includes(r) ? (r as Reaction) : 'bothered'
}

export type Fear = {
  what: string
  firstSeen: string
  reaction: Reaction
  status: 'scared' | 'improving' | 'fine now'
  notes?: string
  history?: { date: string; note: string }[]
}

/** Something one of you flagged by hand; shows on Home until marked done. */
export type Attention = { text: string; area: 'horse' | 'rider'; due?: string; done?: boolean; doneOn?: string; doneBy?: string }
