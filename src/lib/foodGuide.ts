import type { Food } from './types'

/**
 * Reference guide of foods (and common barn plants) horses can and cannot eat.
 * General guidance only: horses with metabolic issues (insulin resistance, Cushing's)
 * should avoid sugary fruit and treats. When in doubt, ask the vet.
 */
export type GuideFood = Food & { aliases?: string[]; group: 'Fruit' | 'Vegetables' | 'Herbs & plants' | 'Grains & feed' | 'Snacks & other' | 'Toxic plants' }

const ok = (group: GuideFood['group'], name: string, notes?: string, aliases?: string[]): GuideFood => ({ group, name, status: 'allowed', notes, aliases })
const lim = (group: GuideFood['group'], name: string, limit: string, notes?: string, aliases?: string[]): GuideFood => ({ group, name, status: 'limit', limit, notes, aliases })
const no = (group: GuideFood['group'], name: string, notes: string, aliases?: string[]): GuideFood => ({ group, name, status: 'forbidden', notes, aliases })

export const FOOD_GUIDE: GuideFood[] = [
  // ---------- Fruit ----------
  lim('Fruit', 'Apples', '1–2 a day, cut in pieces', 'A few seeds are fine; cut to avoid choking.', ['apple']),
  lim('Fruit', 'Applesauce (unsweetened)', 'A spoonful', 'Handy for hiding medicine.'),
  lim('Fruit', 'Apricots', '1–2, pit removed', 'The pit is toxic.', ['apricot']),
  lim('Fruit', 'Dried apricots', '2–3, pitted', 'Very sweet.'),
  lim('Fruit', 'Bananas', '1 a day', 'Peel is OK too.', ['banana']),
  lim('Fruit', 'Blackberries', 'A small handful'),
  lim('Fruit', 'Blueberries', 'A small handful', 'Easy bite-size reward.', ['blueberry']),
  lim('Fruit', 'Cantaloupe / melon', '2–3 slices', 'Remove seeds.', ['cantaloupe', 'melon', 'rockmelon']),
  lim('Fruit', 'Cherries', 'A few, pits removed', 'Cherry pits and stems are toxic.', ['cherry']),
  lim('Fruit', 'Clementines / mandarins', '1–2, peeled', undefined, ['clementine', 'mandarin', 'tangerine', 'satsuma']),
  lim('Fruit', 'Coconut', 'A few small pieces of flesh', 'No shell.'),
  lim('Fruit', 'Cranberries', 'A small handful', 'Fresh or dried (no added sugar).', ['cranberry']),
  lim('Fruit', 'Dates (pitted)', '2–3 a day', 'Very sweet; pits removed.', ['date']),
  lim('Fruit', 'Figs', '1–2', undefined, ['fig']),
  lim('Fruit', 'Grapefruit', 'A few segments, peeled', 'Some horses don’t like the taste.'),
  lim('Fruit', 'Grapes (seedless)', '5–10 a day', 'Safe for horses in small amounts.', ['grape']),
  lim('Fruit', 'Honeydew melon', '2–3 slices', 'Remove seeds.', ['honeydew']),
  lim('Fruit', 'Kiwi', '1, cut up', undefined, ['kiwifruit']),
  lim('Fruit', 'Lemons & limes', 'A slice at most', 'Too sour for most horses.', ['lemon', 'lime']),
  lim('Fruit', 'Mango', '2–3 slices', 'Never give the pit.'),
  lim('Fruit', 'Nectarines', '1, pit removed', 'The pit is toxic.', ['nectarine']),
  lim('Fruit', 'Orange segments', '1 orange a day, peeled', 'Peel and split into segments.', ['orange', 'oranges']),
  lim('Fruit', 'Papaya', '2–3 chunks', 'Remove seeds and skin.'),
  lim('Fruit', 'Peaches & plums', '1 a day', 'Always remove the pit (pits are toxic).', ['peach', 'plum']),
  lim('Fruit', 'Pears', '1 a day', undefined, ['pear']),
  lim('Fruit', 'Pineapple', '2–3 small chunks', 'No skin or core.'),
  lim('Fruit', 'Pomegranate', 'A few seeds', 'Small amounts only.'),
  lim('Fruit', 'Prunes', '2–3', 'Can loosen manure.', ['prune']),
  lim('Fruit', 'Raisins', 'A small handful', 'Sugary; great for hiding a pill.', ['raisin', 'sultanas']),
  lim('Fruit', 'Raspberries', 'A small handful', undefined, ['raspberry']),
  lim('Fruit', 'Strawberries', '3–5 a day', 'Wash first; tops are fine.', ['strawberry']),
  lim('Fruit', 'Watermelon', 'A few slices, no seeds', 'Rind in small pieces is OK.'),
  no('Fruit', 'Persimmons', 'Can form a hard ball in the stomach (impaction).', ['persimmon']),
  no('Fruit', 'Avocado', 'Toxic to horses (persin), including the skin and pit.', ['avocados', 'guacamole']),
  no('Fruit', 'Fruit pits & stones', 'Cherry, peach, plum, apricot and mango pits are toxic and a choking risk.', ['pit', 'pits', 'stones', 'seed']),
  no('Fruit', 'Rotten or moldy fruit', 'Mold can cause colic and poisoning.', ['rotten', 'moldy fruit']),

  // ---------- Vegetables ----------
  lim('Vegetables', 'Carrots', 'Up to 1 kg a day, cut lengthwise', undefined, ['carrot']),
  ok('Vegetables', 'Celery', 'Cut small to avoid choking.'),
  ok('Vegetables', 'Cucumber', 'Refreshing on hot days; slice it.', ['cucumbers']),
  ok('Vegetables', 'Zucchini', 'Cut into sticks or slices.', ['courgette', 'zucchinis']),
  ok('Vegetables', 'Romaine lettuce', 'A few leaves.', ['lettuce', 'romaine']),
  lim('Vegetables', 'Iceberg lettuce', 'A few leaves', 'Mostly water; little nutrition.'),
  ok('Vegetables', 'Green beans', 'Fresh, cut up.', ['green bean', 'string beans']),
  lim('Vegetables', 'Beets (beetroot)', 'A few slices', 'May turn urine red – that’s normal.', ['beet', 'beetroot']),
  lim('Vegetables', 'Bell peppers', 'A few slices', 'Some horses love them; small amounts only.', ['bell pepper', 'capsicum', 'sweet pepper']),
  lim('Vegetables', 'Peas & snap peas', 'A small handful', 'Fresh, pods are fine.', ['pea', 'peas', 'snap peas', 'snow peas']),
  lim('Vegetables', 'Sweet corn', 'A small handful of kernels', 'Not the whole cob (choking risk).', ['corn', 'corn on the cob']),
  lim('Vegetables', 'Pumpkin', 'A few chunks', 'Plain and fresh; seeds are fine. Not carved or rotting.', ['pumpkins']),
  lim('Vegetables', 'Butternut squash', 'A few chunks', undefined, ['squash']),
  lim('Vegetables', 'Sweet potato', 'A few small pieces', 'Raw or plain cooked, cut small.', ['sweet potatoes', 'yam']),
  lim('Vegetables', 'Parsnips', 'A few pieces', 'Cut lengthwise like carrots.', ['parsnip']),
  lim('Vegetables', 'Turnips', 'A few pieces', undefined, ['turnip', 'swede', 'rutabaga']),
  lim('Vegetables', 'Radishes', 'A few', undefined, ['radish']),
  lim('Vegetables', 'Spinach', 'A few leaves', 'High in oxalates; small amounts.'),
  no('Vegetables', 'Potatoes', 'Nightshade family; raw or green potatoes are toxic.', ['potato', 'spuds', 'fries', 'french fries', 'chips']),
  no('Vegetables', 'Tomatoes', 'Nightshade family; leaves and green tomatoes are toxic.', ['tomato']),
  no('Vegetables', 'Eggplant', 'Nightshade family.', ['aubergine']),
  no('Vegetables', 'Onions', 'Damage red blood cells (anemia).', ['onion', 'shallots', 'scallions']),
  no('Vegetables', 'Garlic', 'Same family as onions; can cause anemia in large amounts.'),
  no('Vegetables', 'Leeks & chives', 'Onion family.', ['leek', 'chive']),
  no('Vegetables', 'Cabbage', 'Causes gas and colic.', ['cabbages']),
  no('Vegetables', 'Broccoli', 'Causes gas and colic.'),
  no('Vegetables', 'Cauliflower', 'Causes gas and colic.'),
  no('Vegetables', 'Brussels sprouts', 'Causes gas and colic.', ['brussel sprouts', 'sprouts']),
  no('Vegetables', 'Kale', 'Cabbage family; can cause gas and colic.'),
  no('Vegetables', 'Rhubarb', 'The leaves are toxic (oxalic acid).'),
  no('Vegetables', 'Mushrooms', 'Some are toxic and it’s hard to tell which.', ['mushroom', 'fungi']),
  no('Vegetables', 'Hot peppers', 'Irritate the mouth and gut.', ['chili', 'chilli', 'jalapeno', 'jalapeño']),

  // ---------- Herbs & plants ----------
  ok('Herbs & plants', 'Grass', 'Fresh pasture; introduce slowly in spring.', ['pasture']),
  ok('Herbs & plants', 'Hay', 'The base of the diet.', ['timothy hay']),
  ok('Herbs & plants', 'Mint leaves', 'Most horses love it.', ['mint', 'peppermint leaves']),
  ok('Herbs & plants', 'Dandelions', 'Leaves and flowers are fine.', ['dandelion']),
  lim('Herbs & plants', 'Clover', 'Mixed in with grass', 'Moldy or "slobbers" clover can cause drooling.'),
  lim('Herbs & plants', 'Parsley', 'A small bunch'),
  lim('Herbs & plants', 'Basil', 'A few leaves'),
  lim('Herbs & plants', 'Rosemary', 'A sprig'),
  lim('Herbs & plants', 'Chamomile', 'A little dried', 'Sometimes used for calm horses (ask the vet).'),
  no('Herbs & plants', 'Lawn clippings', 'Ferment fast and can cause colic and laminitis.', ['grass clippings', 'mowed grass']),

  // ---------- Grains & feed ----------
  lim('Grains & feed', 'Oats', 'As part of his feed plan', 'Ask the barn how much he gets.', ['oat']),
  lim('Grains & feed', 'Barley', 'As part of his feed plan', 'Usually rolled or cooked.'),
  lim('Grains & feed', 'Corn (feed)', 'As part of his feed plan', 'High energy; easy to overdo.', ['cracked corn']),
  lim('Grains & feed', 'Wheat bran', 'Small amounts', 'Not every day; ask the vet.', ['bran', 'bran mash']),
  lim('Grains & feed', 'Rice bran', 'As advised', 'Adds fat for weight.'),
  ok('Grains & feed', 'Beet pulp (soaked)', 'Always soak before feeding.', ['beet pulp']),
  lim('Grains & feed', 'Alfalfa cubes', 'A few cubes as treats', 'Soak if he bolts his food.', ['alfalfa', 'lucerne', 'hay cubes']),
  ok('Grains & feed', 'Timothy pellets', 'Good low-sugar treat or feed.', ['hay pellets']),
  lim('Grains & feed', 'Ground flaxseed', 'A small scoop', 'Ground, not whole.', ['flax', 'linseed']),
  lim('Grains & feed', 'Sunflower seeds (black oil)', 'A small handful', 'Shells on, unsalted.', ['sunflower seeds']),
  lim('Grains & feed', 'Horse feed (pellets / sweet feed)', 'Only his own ration', 'Never let him into the feed room – overeating causes colic.', ['pellets', 'sweet feed', 'grain']),
  no('Grains & feed', 'Cattle or poultry feed', 'Can contain monensin (rumensin), which is deadly to horses.', ['cow feed', 'chicken feed', 'cattle feed', 'poultry feed', 'goat feed', 'monensin']),
  no('Grains & feed', 'Moldy hay or feed', 'Mold and dust cause colic and breathing problems.', ['moldy hay', 'mouldy', 'moldy']),
  no('Grains & feed', 'Dog or cat food', 'Meat-based; horses can’t digest it.', ['dog food', 'cat food', 'pet food']),

  // ---------- Snacks & other ----------
  lim('Snacks & other', 'Sugar cubes', '2 a day', undefined, ['sugar']),
  lim('Snacks & other', 'Peppermints', '2–3 a day', undefined, ['mints', 'peppermint', 'candy cane']),
  lim('Snacks & other', 'Store-bought horse treats', 'Follow the bag (usually 2–5)', 'Choose low-sugar ones if possible.', ['horse cookies', 'horse treats', 'treats']),
  lim('Snacks & other', 'Honey', 'A teaspoon', 'Sugary.'),
  lim('Snacks & other', 'Molasses', 'A drizzle on feed', 'Sugary.'),
  lim('Snacks & other', 'Peanuts (unsalted)', 'A few', 'Shelled; no salt or coating.', ['peanut']),
  lim('Snacks & other', 'Peanut butter', 'A lick', 'Can be sticky; good for hiding pills.'),
  lim('Snacks & other', 'Plain popcorn', 'A small handful', 'Air-popped, no butter or salt.', ['popcorn']),
  lim('Snacks & other', 'Plain Cheerios / oat cereal', 'A small handful', 'No chocolate or frosting.', ['cheerios', 'cereal']),
  lim('Snacks & other', 'Salt', 'A salt lick, free choice', 'Don’t add extra salt to treats.', ['salt lick']),
  no('Snacks & other', 'Chocolate', 'Contains theobromine, toxic to horses.', ['cocoa', 'brownies', 'chocolate chips']),
  no('Snacks & other', 'Coffee & tea (caffeine)', 'Caffeine is harmful and banned at shows.', ['coffee', 'tea', 'caffeine', 'energy drink', 'soda']),
  no('Snacks & other', 'Alcohol', 'Toxic.', ['beer', 'wine']),
  no('Snacks & other', 'Bread & pastries', 'Can form a doughy mass and cause colic.', ['bread', 'cake', 'cookies (people)', 'donuts', 'pastry']),
  no('Snacks & other', 'Meat & fish', 'Horses are herbivores and can’t digest them.', ['meat', 'chicken', 'beef', 'fish', 'ham', 'bacon', 'hot dog']),
  no('Snacks & other', 'Dairy', 'Horses are lactose intolerant.', ['milk', 'cheese', 'yogurt', 'ice cream', 'butter']),
  no('Snacks & other', 'Junk food & candy', 'Salt, sugar and fat upset his gut.', ['candy', 'chips (crisps)', 'crisps', 'pretzels', 'gummies', 'marshmallows']),
  no('Snacks & other', 'Nuts with shells / salted nuts', 'Choking risk and too much salt.', ['almonds', 'walnuts', 'cashews', 'pistachios']),

  // ---------- Toxic plants (around the barn) ----------
  no('Toxic plants', 'Yew', 'Extremely toxic: a small mouthful can kill a horse.'),
  no('Toxic plants', 'Oleander', 'Extremely toxic to the heart.'),
  no('Toxic plants', 'Red maple leaves', 'Wilted or dry leaves destroy red blood cells.', ['maple leaves', 'maple']),
  no('Toxic plants', 'Acorns & oak leaves', 'Can damage the kidneys and gut.', ['acorn', 'oak']),
  no('Toxic plants', 'Black walnut', 'Even walnut shavings in bedding cause laminitis.', ['walnut shavings']),
  no('Toxic plants', 'Foxglove', 'Toxic to the heart.'),
  no('Toxic plants', 'Ragwort / groundsel', 'Causes liver damage over time.', ['ragwort', 'groundsel', 'tansy ragwort']),
  no('Toxic plants', 'Buttercups', 'Irritate the mouth and gut (fine once dried in hay).', ['buttercup']),
  no('Toxic plants', 'Bracken fern', 'Causes vitamin B1 deficiency.', ['bracken', 'fern']),
  no('Toxic plants', 'Nightshade plants', 'Toxic leaves and berries.', ['deadly nightshade', 'belladonna']),
  no('Toxic plants', 'Hemlock', 'Very toxic.', ['poison hemlock', 'water hemlock']),
  no('Toxic plants', 'Azalea & rhododendron', 'Toxic to the heart and gut.', ['azalea', 'rhododendron']),
  no('Toxic plants', 'Lily of the valley', 'Toxic to the heart.'),
  no('Toxic plants', 'Sorghum / Sudan grass', 'Can cause urinary and nerve problems.', ['sorghum', 'sudan grass', 'johnson grass']),
  no('Toxic plants', 'Yellow star thistle', 'Causes a fatal brain disease ("chewing disease").', ['star thistle']),
  no('Toxic plants', 'Locoweed', 'Causes nerve damage; horses can get addicted.', ['loco weed']),
]

export function normalizeFood(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[()]/g, ' ')
    .replace(/[^a-z0-9 /&-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Singular-ish form so "apple" finds "Apples" and "strawberries" finds "Strawberries". */
function stem(w: string) {
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y'
  if (w.endsWith('oes')) return w.slice(0, -2)
  if (w.endsWith('es') && /(ch|sh|s|x)es$/.test(w)) return w.slice(0, -2)
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1)
  return w
}

function terms(f: { name: string; aliases?: string[] }) {
  return [f.name, ...(f.aliases ?? [])].map((t) => normalizeFood(t).split(/[ /&-]+/).map(stem).join(' '))
}

/** 0 = no match; higher is better. */
export function matchScore(query: string, f: { name: string; aliases?: string[] }) {
  const q = normalizeFood(query).split(/[ /&-]+/).filter(Boolean).map(stem).join(' ')
  if (!q) return 0
  let best = 0
  for (const t of terms(f)) {
    if (t === q) best = Math.max(best, 100)
    else if (t.startsWith(q) || t.split(' ').some((w) => w === q)) best = Math.max(best, 80)
    else if (t.split(' ').some((w) => w.startsWith(q))) best = Math.max(best, 60)
    else if (q.length >= 3 && t.includes(q)) best = Math.max(best, 40)
    else if (q.length >= 4 && q.includes(t) && t.length >= 4) best = Math.max(best, 30)
  }
  return best
}

export function searchFoods<T extends { name: string; aliases?: string[] }>(query: string, foods: T[]): T[] {
  return foods
    .map((f) => ({ f, s: matchScore(query, f) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.f.name.localeCompare(b.f.name))
    .map((x) => x.f)
}

export function sameFood(a: string, b: string) {
  const na = normalizeFood(a).split(/[ /&-]+/).map(stem).join(' ')
  const nb = normalizeFood(b).split(/[ /&-]+/).map(stem).join(' ')
  return na === nb
}
