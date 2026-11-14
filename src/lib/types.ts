export type Profile = {
  name: string
  birthDate?: string
  breed?: string
  color?: string
  height?: string
  stable?: string
  vetName?: string
  vetPhone?: string
  farrierPhone?: string
  photo?: string
  currency?: string
  maneLength?: Length
  tailLength?: Length
}

export type Vaccine = { name: string; date: string; nextDue?: string; vet?: string; notes?: string }

export type CareTask = { title: string; lastDone?: string; everyDays: number; notes?: string; seasonal?: string }

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

export type ShopItem = { url: string; note?: string; bought?: boolean; boughtOn?: string }

export const COST_CATEGORIES = ['Stable', 'Vet', 'Farrier', 'Feed', 'Equipment', 'Lessons', 'Shows', 'Grooming', 'Other'] as const
export type Cost = { date: string; category: string; amount: number; description?: string; invoice?: string; recurring?: boolean }

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

export type CoachEntry = {
  date: string
  title: string
  clip?: string
  link?: string
  skills?: string[]
  notes?: string
  feedback?: string
}

export type Todo = { text: string; doneWeek?: string; doneBy?: string; oneOff?: boolean }

export type Fear = {
  what: string
  firstSeen: string
  reaction: 'mild' | 'spooks' | 'big spook'
  status: 'scared' | 'improving' | 'fine now'
  notes?: string
  history?: { date: string; note: string }[]
}
