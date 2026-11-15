import { addItem, addMany, type Item } from './store'
import { youtubeSearch } from './beautify'
import type { CareTask, Food, Hairstyle, Skill, Todo } from './types'

const yt = youtubeSearch

export const STARTER_CARE: CareTask[] = [
  { title: 'Farrier (trim / shoes)', everyDays: 42, notes: 'Usually every 6 weeks.' },
  { title: 'Winter clipping', everyDays: 30, seasonal: 'winter', notes: 'Only in the cold months. Rug after clipping.' },
  { title: 'Deworming', everyDays: 90, notes: 'Ask the vet about a fecal egg count first.' },
  { title: 'Dental check', everyDays: 365, notes: 'Teeth floated by the vet or equine dentist.' },
]

export const STARTER_FOODS: Food[] = [
  { name: 'Hay', status: 'allowed', notes: 'The base of the diet. Always available if possible.' },
  { name: 'Carrots', status: 'limit', limit: 'Up to 1 kg a day, cut lengthwise' },
  { name: 'Apples', status: 'limit', limit: '1–2 a day, cut in pieces' },
  { name: 'Sugar cubes', status: 'limit', limit: '2 a day' },
  { name: 'Peppermints', status: 'limit', limit: '2–3 a day' },
  { name: 'Bananas', status: 'limit', limit: '1 a day' },
  { name: 'Watermelon', status: 'limit', limit: 'A few slices, no seeds' },
  { name: 'Celery', status: 'allowed', notes: 'Cut small to avoid choking.' },
  { name: 'Pears', status: 'limit', limit: '1 a day' },
  { name: 'Chocolate', status: 'forbidden', notes: 'Contains theobromine, toxic to horses.' },
  { name: 'Avocado', status: 'forbidden', notes: 'Toxic.' },
  { name: 'Onions & garlic', status: 'forbidden', notes: 'Can damage red blood cells.' },
  { name: 'Potatoes & tomatoes', status: 'forbidden', notes: 'Nightshade family.' },
  { name: 'Lawn clippings', status: 'forbidden', notes: 'Ferment fast and can cause colic.' },
  { name: 'Bread & pastries', status: 'forbidden', notes: 'Can form a doughy mass and cause colic.' },
  { name: 'Meat & dairy', status: 'forbidden', notes: 'Horses are herbivores and can’t digest them.' },
  { name: 'Stone fruit pits', status: 'forbidden', notes: 'Cherry, peach and plum pits are toxic.' },
  { name: 'Cabbage & broccoli', status: 'forbidden', notes: 'Cause gas and colic.' },
  // Added Nov 2026
  { name: 'Strawberries', status: 'limit', limit: '3–5 a day', notes: 'Wash first; tops are fine.' },
  { name: 'Blueberries', status: 'limit', limit: 'A small handful', notes: 'Easy bite-size reward.' },
  { name: 'Grapes (seedless)', status: 'limit', limit: '5–10 a day', notes: 'Safe for horses in small amounts.' },
  { name: 'Orange segments', status: 'limit', limit: '1 orange a day, peeled', notes: 'Peel and split into segments.' },
  { name: 'Pineapple', status: 'limit', limit: '2–3 small chunks', notes: 'No skin or core.' },
  { name: 'Cantaloupe / melon', status: 'limit', limit: '2–3 slices', notes: 'Remove seeds; small pieces of rind are OK.' },
  { name: 'Mango', status: 'limit', limit: '2–3 slices', notes: 'Never give the pit.' },
  { name: 'Peaches & plums', status: 'limit', limit: '1 a day', notes: 'Always remove the pit (pits are toxic).' },
  { name: 'Dates (pitted)', status: 'limit', limit: '2–3 a day', notes: 'Very sweet; pits removed.' },
  { name: 'Raisins', status: 'limit', limit: 'A small handful', notes: 'Sugary; great for hiding a pill.' },
  { name: 'Pumpkin', status: 'limit', limit: 'A few chunks', notes: 'Fresh, plain pumpkin; seeds are fine. Not carved or rotting ones.' },
  { name: 'Sweet potato', status: 'limit', limit: 'A few small pieces', notes: 'Raw or cooked plain, cut small.' },
  { name: 'Cucumber', status: 'allowed', notes: 'Refreshing on hot days; slice it.' },
  { name: 'Zucchini', status: 'allowed', notes: 'Cut into sticks or slices.' },
  { name: 'Romaine lettuce', status: 'allowed', notes: 'A few leaves; avoid lots of iceberg.' },
  { name: 'Alfalfa cubes', status: 'limit', limit: 'A few cubes as treats', notes: 'Soak if he bolts his food.' },
  { name: 'Beet pulp (soaked)', status: 'allowed', notes: 'Always soak before feeding; ask the barn about his feed.' },
  { name: 'Store-bought horse treats', status: 'limit', limit: 'Follow the bag (usually 2–5)', notes: 'Choose low-sugar ones if possible.' },
]

function s(
  name: string,
  area: Hairstyle['area'],
  lengths: Hairstyle['lengths'],
  difficulty: Hairstyle['difficulty'],
  steps: string[],
  theme?: string,
): Hairstyle {
  return { name, area, lengths, difficulty, steps: steps.join('\n'), video: yt(`horse ${name} tutorial`), theme }
}

export const STARTER_STYLES: Hairstyle[] = [
  s('Banded mane', 'mane', ['short', 'medium'], 'easy', [
    'Brush and dampen the mane.',
    'Split it into equal sections about 2 fingers wide.',
    'Wrap a small rubber band tightly around each section.',
    'Smooth flyaways with a little gel.',
  ]),
  s('Bubble mane', 'mane', ['medium', 'long'], 'easy', [
    'Make sections like a banded mane.',
    'Add a second band lower down each section.',
    'Gently pull the hair between bands to puff it into a bubble.',
    'Repeat down the neck.',
  ]),
  s('Button braids', 'mane', ['short', 'medium'], 'medium', [
    'Dampen and split the mane into even sections.',
    'Braid each section tightly to the end.',
    'Secure the end with a band.',
    'Fold the braid under itself into a ball.',
    'Sew or band it in place at the crest.',
    'Spray to hold.',
  ]),
  s('Running braid', 'mane', ['long'], 'medium', [
    'Start at the poll with a small section and split it in three.',
    'Braid one cross, then pick up a new piece of mane each time the top strand crosses.',
    'Keep the braid running along the crest down the neck.',
    'At the withers, braid the rest normally and band the end.',
    'Tuck the tail end under.',
  ]),
  s('Fishtail mane braid', 'mane', ['long'], 'medium', [
    'Split a section into two halves.',
    'Take a thin piece from the outside of the left half and cross it to the right.',
    'Repeat from the right side to the left.',
    'Keep alternating until the end.',
    'Band the end.',
  ]),
  s('Hunter braids', 'mane', ['short'], 'hard', [
    'Pull or thin the mane to an even 10–12 cm.',
    'Dampen and split into 30+ small sections.',
    'Braid each section tightly to the end.',
    'Thread yarn into the end of each braid.',
    'Use a pull-through to fold the braid up under itself.',
    'Tie the yarn in a knot under the braid.',
    'Trim the yarn ends.',
    'Check that every braid sits at the same height.',
    'Spray to hold.',
  ]),
  s('Continental (macramé) braid', 'mane', ['long'], 'hard', [
    'Band the mane into small sections along the crest.',
    'Split each section in half.',
    'Join the right half of one with the left half of the next, and band them.',
    'Repeat along the neck to make diamonds.',
    'Make a second row lower down the same way.',
    'Add a third row for very long manes.',
    'Let the ends hang or braid them.',
    'Smooth with gel.',
  ]),
  s('Simple tail plait', 'tail', ['medium', 'long'], 'easy', [
    'Brush the tail out.',
    'Split the tail below the bone into three.',
    'Braid to the end and band it.',
    'Fold up and secure for mud or wash days.',
  ]),
  s('French tail braid', 'tail', ['medium', 'long'], 'hard', [
    'Dampen the top of the tail.',
    'Take thin pieces from each side at the top of the dock.',
    'Cross them over a centre piece.',
    'Keep adding thin side pieces as you braid down.',
    'Stop at the end of the dock.',
    'Braid the remaining hair normally.',
    'Loop the end up and sew it in.',
    'Spray to hold.',
  ]),
  s('Mud knot', 'tail', ['long'], 'medium', [
    'Braid the tail below the dock.',
    'Fold the braid up into a loop.',
    'Wrap the loop with tape or vet wrap.',
    'Check it isn’t tight on the dock.',
    'Take it out after riding.',
  ]),
  s('Halloween pumpkin bands', 'mane', ['short', 'medium'], 'easy', [
    'Make a banded mane using orange and black bands.',
    'Alternate colours along the neck.',
    'Add small felt pumpkins or bats with clips.',
    'Finish with glitter spray (keep it away from the eyes).',
  ], 'Halloween'),
  s('Spider-web tail', 'tail', ['medium', 'long'], 'medium', [
    'Make small sections at the top of the tail.',
    'Connect them diagonally with bands like a macramé.',
    'Add a second row to build a web pattern.',
    'Clip a toy spider in the middle.',
    'Spray to hold.',
  ], 'Halloween'),
  s('Christmas ribbon braid', 'mane', ['long'], 'easy', [
    'Start a running braid at the poll.',
    'Braid a red or green ribbon in as one of the strands.',
    'Tie a bow at the end.',
    'Add small bells to the bands if you like.',
  ], 'Christmas'),
  s('Rainbow bubble mane', 'mane', ['medium', 'long'], 'easy', [
    'Make a bubble mane.',
    'Use bands in rainbow order down the neck.',
    'Puff out each bubble.',
    'Great for birthdays and fun shows.',
  ], 'Birthday'),
  // Added Nov 2026
  s('Rope twist mane', 'mane', ['long'], 'easy', [
    'Start at the poll with a small section and split it in two.',
    'Twist both strands the same way, then cross them over each other.',
    'Add a little mane to each strand as you go down the neck.',
    'Band the end and tuck it under.',
  ]),
  s('Dutch braid', 'mane', ['long'], 'medium', [
    'Start at the poll with three small strands.',
    'Cross each outside strand UNDER the middle one (not over).',
    'Add a bit of new mane each time you cross, like a running braid.',
    'The braid sits on top of the mane like a raised rope.',
    'Band the end at the withers and tuck it under.',
  ]),
  s('Loop braids (scallops)', 'mane', ['medium', 'long'], 'medium', [
    'Band the mane into sections about 3 fingers wide.',
    'Braid each section to the end and band it.',
    'Fold each braid up into a loop.',
    'Band the end of the loop to the base of the next section.',
    'You get a row of scallops along the neck.',
    'Spray to hold.',
  ]),
  s('Ribbon braids', 'mane', ['medium', 'long'], 'medium', [
    'Split the mane into 8–12 sections.',
    'Tie a thin ribbon at the top of each section.',
    'Braid the ribbon in as one of the three strands.',
    'Tie the ribbon ends in a small bow.',
    'Use show colours or Sofía’s favourite colour.',
  ]),
  s('Flower rosettes', 'mane', ['short', 'medium'], 'medium', [
    'Make button braids along the neck.',
    'Tuck a small fabric or silk flower into each button.',
    'Secure each flower with a band or a hair pin.',
    'Check nothing pokes EJ’s skin.',
    'Remove the flowers before turnout.',
  ], 'Spring'),
  s('Valentine heart bands', 'mane', ['short', 'medium'], 'easy', [
    'Make a banded mane with red and pink bands.',
    'Alternate the colours down the neck.',
    'Clip small felt hearts onto a few bands.',
    'Finish with a little glitter spray (away from the eyes).',
  ], 'Valentine’s'),
  s('Stars & stripes bands', 'mane', ['short', 'medium'], 'easy', [
    'Make a banded mane using red, white and blue bands.',
    'Repeat the colours in order down the neck.',
    'Add small star clips on a few sections.',
    'Great for the 4th of July.',
  ], '4th of July'),
  s('Tail bubbles', 'tail', ['medium', 'long'], 'easy', [
    'Brush the tail and gather it below the dock.',
    'Put a band every hand-width down the tail.',
    'Gently pull the hair between bands to puff each bubble.',
    'Use coloured bands to match a theme.',
  ]),
  s('Ribbon tail braid', 'tail', ['medium', 'long'], 'easy', [
    'Brush the tail out.',
    'Tie a ribbon just below the dock.',
    'Braid the tail with the ribbon as one strand.',
    'Tie a bow at the end.',
  ]),
  s('Fishtail tail braid', 'tail', ['long'], 'medium', [
    'Brush the tail and split it in two halves below the dock.',
    'Take a thin piece from the outside of the left half and cross it to the right half.',
    'Do the same from the right side to the left.',
    'Keep alternating all the way down.',
    'Band the end.',
  ]),
]

function sk(name: string, level: Skill['level'], discipline: Skill['discipline'], cues: string[]): Skill {
  return { name, level, discipline, cues: cues.join('\n'), video: yt(`${discipline} ${name} riding lesson`) }
}

export const STARTER_SKILLS: Skill[] = [
  // Dressage
  sk('Correct position & seat', 'beginner', 'dressage', ['Ear–shoulder–hip–heel in one line.', 'Sit on your seat bones, not your thighs.', 'Soft elbows, thumbs on top.']),
  sk('Walk–trot transitions', 'beginner', 'dressage', ['Prepare with a half-halt.', 'Squeeze with both legs, don’t kick.', 'Keep the contact soft as EJ moves up.']),
  sk('20 m circle', 'beginner', 'dressage', ['Look a quarter of the circle ahead.', 'Inside leg at the girth, outside leg behind.', 'Outside rein controls the size.']),
  sk('Rising trot on the correct diagonal', 'beginner', 'dressage', ['Rise when the outside shoulder goes forward.', 'Change diagonal by sitting one extra beat.']),
  sk('Square halt', 'beginner', 'dressage', ['Close your seat and legs into a still hand.', 'Breathe out and stay tall.', 'Count 3 seconds of stillness.']),
  sk('Leg yield', 'intermediate', 'dressage', ['Inside leg pushes sideways at the girth.', 'Keep EJ almost straight, slight flexion away.', 'Outside rein stops the shoulder escaping.']),
  sk('Shoulder-in', 'intermediate', 'dressage', ['Bring the shoulders in about 30°.', 'Inside leg at the girth keeps the bend.', 'Outside rein controls the angle.']),
  sk('Canter transitions', 'intermediate', 'dressage', ['Half-halt, then inside leg at the girth.', 'Outside leg slides back to ask.', 'Sit deep and allow with the inside hand.']),
  sk('Trot lengthening', 'intermediate', 'dressage', ['Build energy in the corner first.', 'Ask with both legs, allow the hands forward a little.', 'Half-halt to come back.']),
  sk('Turn on the forehand', 'intermediate', 'dressage', ['Halt first.', 'Leg back on one side moves the hindquarters.', 'Keep the front legs marking time.']),
  sk('Half-pass', 'advanced', 'dressage', ['Start from shoulder-in.', 'Outside leg pushes sideways, bend toward the direction of travel.', 'Shoulders slightly lead.']),
  sk('Flying change', 'advanced', 'dressage', ['Have a straight, balanced canter first.', 'Change your leg position cleanly in one moment.', 'Don’t throw your upper body.']),
  sk('Collected canter', 'advanced', 'dressage', ['Repeated half-halts to shorten the stride.', 'Keep the impulsion with your seat.', 'More jump, not slower.']),
  sk('Walk pirouette', 'advanced', 'dressage', ['Collect the walk.', 'Outside leg back keeps the hind legs stepping.', 'Small circle with the hind legs, shoulders turn around.']),
  sk('Extended trot', 'advanced', 'dressage', ['Gather energy in the short side.', 'Allow the frame to lengthen.', 'Keep the rhythm, don’t rush.']),
  // Jumping
  sk('Two-point position', 'beginner', 'jumping', ['Shorten stirrups 2–3 holes.', 'Hips back, chest forward, weight in the heels.', 'Hands press into the neck.']),
  sk('Ground poles', 'beginner', 'jumping', ['Look up, not at the pole.', 'Keep a steady rhythm.', 'Ride to the middle of the pole.']),
  sk('Crossrail', 'beginner', 'jumping', ['Come in straight from a good corner.', 'Fold with EJ’s jump, don’t jump ahead.', 'Release with your hands up the neck.']),
  sk('Straight approach', 'beginner', 'jumping', ['Pick a point behind the jump and ride to it.', 'Use both legs evenly.', 'Turn early, not at the last second.']),
  sk('Landing & riding away', 'beginner', 'jumping', ['Look to your next point in the air.', 'Sit up on landing and keep a soft contact.', 'Ride a straight line after the fence.']),
  sk('Grid work', 'intermediate', 'jumping', ['Keep the same position through the whole grid.', 'Let the grid set the distance.', 'Hands steady, eyes up.']),
  sk('Related distances', 'intermediate', 'jumping', ['Walk and count the strides first.', 'Land and keep the canter the same.', 'Count out loud 1–2–3.']),
  sk('Oxers', 'intermediate', 'jumping', ['Come in with more energy than a vertical.', 'Aim for the middle of the back rail.', 'Bigger release.']),
  sk('Course memory & lines', 'intermediate', 'jumping', ['Walk the course twice.', 'Say the course out loud.', 'Plan each turn, not just each jump.']),
  sk('Rollback turns', 'intermediate', 'jumping', ['Land and look to the next fence right away.', 'Outside rein and leg turn the horse.', 'Keep the canter while turning.']),
  sk('Jump-off turns', 'advanced', 'jumping', ['Cut inside the turn while keeping balance.', 'Angle fences slightly to save strides.', 'Don’t sacrifice the canter for speed.']),
  sk('Combinations (doubles & triples)', 'advanced', 'jumping', ['Strong, balanced canter in.', 'Keep your leg on between elements.', 'Look to the last element.']),
  sk('Water / Liverpool', 'advanced', 'jumping', ['Ride positively, look up and over.', 'Keep the leg on strongly at take-off.', 'Practise first with a tarp at home.']),
  sk('Bending lines', 'advanced', 'jumping', ['Plan the track before you ride it.', 'Land on the right lead.', 'Use the line you planned to fit the strides.']),
  sk('Full course at height', 'advanced', 'jumping', ['Warm up over the same height.', 'Keep one rhythm the whole way round.', 'Breathe in the corners.']),
  // Added Nov 2026
  sk("Free walk on a long rein", 'beginner', 'dressage', ["Let the reins slide out slowly, keep a light contact.", "Ask for a big, marching walk with your seat.", "EJ should stretch his nose forward and down."]),
  sk("Stretchy trot circle", 'beginner', 'dressage', ["Rising trot on a 20 m circle.", "Gradually let the reins out as EJ reaches down.", "Keep the rhythm the same; take the reins back smoothly."]),
  sk("Serpentines & changes of rein", 'beginner', 'dressage', ["Plan each loop before you ride it.", "Straighten for a stride when you cross the centre line.", "Change your bend and diagonal as you change direction."]),
  sk("Turn on the haunches", 'intermediate', 'dressage', ["Start from a walk or halt, with slight bend into the turn.", "Outside leg behind the girth keeps the hind legs from swinging out.", "Inside leg at the girth keeps him walking; outside rein moves the shoulders around."]),
  sk("Rein back", 'intermediate', 'dressage', ["Start from a square, relaxed halt.", "Lighten your seat, close both legs and resist softly with the hands.", "Count the steps and walk forward right after."]),
  sk("Counter canter", 'intermediate', 'dressage', ["Keep the bend over the leading leg, not the direction of travel.", "Start with shallow loops off the track.", "Sit still and keep your outside leg back."]),
  sk("Haunches-in (travers)", 'intermediate', 'dressage', ["Bend EJ around your inside leg.", "Outside leg behind the girth brings the hindquarters in.", "Shoulders stay on the track; about 30° angle."]),
  sk("Simple change", 'intermediate', 'dressage', ["Canter, transition to walk for 3–5 clean steps.", "Re-bend, then pick up the new lead.", "Prepare each transition with a half-halt."]),
  sk("Medium trot", 'intermediate', 'dressage', ["Build energy on the short side.", "Allow the frame to lengthen a little, same rhythm.", "Half-halt to come back before the corner."]),
  sk("Renvers", 'advanced', 'dressage', ["Like travers, but with the tail to the wall.", "Bend toward the direction of travel.", "Keep the angle steady along the whole long side."]),
  sk("Canter half-pass", 'advanced', 'dressage', ["Start from a balanced, collected canter.", "Bend toward the direction of travel; outside leg pushes sideways.", "Shoulders lead slightly; keep the jump in the canter."]),
  sk("Trot poles & cavaletti", 'beginner', 'jumping', ["Look past the poles, not down at them.", "Keep a steady rhythm and soft hands.", "Rise or two-point over them as your coach asks."]),
  sk("Landing on the correct lead", 'intermediate', 'jumping', ["Look in the direction of the turn in the air.", "Open the inside rein slightly over the fence.", "Weight the inside stirrup a little on landing."]),
  sk("Seeing a distance", 'intermediate', 'jumping', ["Keep the same canter rhythm all the way to the fence.", "Count 1–2–3 for the last strides.", "Don't chase or pull; trust the canter."]),
  sk("Adjusting the canter (lengthen / shorten)", 'intermediate', 'jumping', ["Practise on the flat: 5 strides then 6 strides on the same line.", "Lengthen with your leg and a softer hand.", "Shorten with half-halts and a taller body."]),
  sk("Bounces", 'intermediate', 'jumping', ["Come in with an active, balanced canter.", "Stay in your jumping position through the whole line.", "Hands forward, eyes up to the end."]),
  sk("Jumping on an angle", 'intermediate', 'jumping', ["Start with a small fence at a slight angle.", "Pick your line and keep both legs on so he stays straight.", "Look at your landing point, not the fence."]),
  sk("Skinny fences & corners", 'advanced', 'jumping', ["Channel EJ between your hands and legs.", "Pick an exact line and look past the fence.", "Plenty of leg and a steady canter; no surprises."]),
]

export const STARTER_TODOS: Todo[] = [
  { text: 'Clean and condition tack' },
  { text: 'Check hooves and shoes' },
  { text: 'Check rugs / blankets' },
  { text: 'Take this week’s photos (Photos)' },
  { text: 'Scrub water buckets' },
  { text: 'Restock treats and feed' },
  { text: 'Check the first-aid kit' },
]

/** Fills empty lists with starter content once. Safe to call every launch. */
let seeding = false
export async function seedIfNeeded(all: Item[]) {
  if (seeding || all.some((x) => x.kind === 'seeded')) return
  seeding = true
  await addItem('seeded', { at: new Date().toISOString() })
  const has = (k: string) => all.some((x) => x.kind === k)
  if (!has('profile')) await addItem('profile', { name: 'EJ', currency: '$' })
  if (!has('care')) await addMany('care', STARTER_CARE)
  if (!has('food')) await addMany('food', STARTER_FOODS)
  if (!has('style')) await addMany('style', STARTER_STYLES)
  if (!has('skill')) await addMany('skill', STARTER_SKILLS)
  if (!has('todo')) await addMany('todo', STARTER_TODOS)
}
