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

  // ===== More fruit =====
  lim('Fruit', 'Gooseberries', 'A small handful', undefined, ['gooseberry']),
  lim('Fruit', 'Mulberries', 'A small handful', undefined, ['mulberry']),
  lim('Fruit', 'Blackcurrants & redcurrants', 'A small handful', undefined, ['currants', 'blackcurrant', 'redcurrant']),
  lim('Fruit', 'Guava', '1–2 pieces', undefined),
  lim('Fruit', 'Passion fruit', 'Half a fruit (pulp only)', 'No hard rind.'),
  lim('Fruit', 'Dragon fruit', 'A few chunks', 'Peeled.', ['pitaya']),
  lim('Fruit', 'Lychee', '2–3, peeled and pitted', 'Remove the stone.', ['lychees', 'litchi']),
  lim('Fruit', 'Quince', 'A few pieces', 'Seeds removed.'),
  lim('Fruit', 'Plantain (banana)', 'A few slices', 'Cooking banana; small amounts.', ['plantains']),
  lim('Fruit', 'Crab apples', 'A few', 'Fallen fruit can ferment; don’t let him gorge on them.', ['crabapple']),
  lim('Fruit', 'Dried figs', '1–2', 'Very sweet.'),
  lim('Fruit', 'Dried mango', '1–2 slices', 'Very sweet.'),
  lim('Fruit', 'Banana chips', 'A few', 'Choose unsweetened.'),
  lim('Fruit', 'Citrus peel', 'A small piece', 'Some horses like it; wash first.', ['orange peel', 'lemon peel']),
  lim('Fruit', 'Apple peels & cores', 'From 1–2 apples', 'A few seeds are fine.'),
  no('Fruit', 'Elderberries', 'Leaves, stems and unripe berries are toxic.', ['elderberry', 'elder']),
  no('Fruit', 'Star fruit', 'High in oxalates; can harm the kidneys.', ['starfruit', 'carambola']),
  no('Fruit', 'Olives', 'Salty and the pits are a choking risk.', ['olive']),
  no('Fruit', 'Canned fruit in syrup', 'Far too much sugar.', ['fruit cocktail', 'canned fruit']),

  // ===== More vegetables =====
  lim('Vegetables', 'Swiss chard', 'A few leaves', undefined, ['chard']),
  lim('Vegetables', 'Endive & escarole', 'A few leaves', undefined, ['endive', 'escarole', 'chicory']),
  lim('Vegetables', 'Fennel bulb', 'A few slices', undefined, ['fennel']),
  lim('Vegetables', 'Celery root (celeriac)', 'A few pieces', undefined, ['celeriac']),
  lim('Vegetables', 'Acorn & spaghetti squash', 'A few chunks', undefined, ['acorn squash', 'spaghetti squash']),
  lim('Vegetables', 'Asparagus', 'A spear or two', 'Not a favourite for most horses.'),
  ok('Vegetables', 'Carrot tops', 'The leafy greens are fine.', ['carrot greens']),
  lim('Vegetables', 'Beet greens', 'A few leaves', 'High in oxalates.'),
  lim('Vegetables', 'Corn husks', 'A few', 'Clean and dry; no cob.'),
  lim('Vegetables', 'Ginger', 'A small slice', 'Sometimes used for digestion (ask the vet).'),
  lim('Vegetables', 'Turmeric', 'As a supplement only', 'Ask the vet for a dose.'),
  no('Vegetables', 'Bok choy', 'Cabbage family; gas and colic.', ['pak choi']),
  no('Vegetables', 'Collard greens', 'Cabbage family; gas and colic.', ['collards']),
  no('Vegetables', 'Arugula & watercress', 'Mustard family; gas and colic.', ['arugula', 'rocket', 'watercress']),
  no('Vegetables', 'Mustard greens & radish greens', 'Mustard family; gas and colic.', ['mustard greens']),
  no('Vegetables', 'Raw beans', 'Kidney, lima and other raw beans contain toxins (lectins).', ['kidney beans', 'lima beans', 'beans', 'black beans']),
  no('Vegetables', 'Soybeans (raw) & edamame', 'Raw soy blocks digestion of protein.', ['edamame', 'soybeans']),
  no('Vegetables', 'Lentils & chickpeas', 'Gassy legumes; not suitable for horses.', ['lentil', 'chickpea', 'hummus']),
  no('Vegetables', 'Horseradish & wasabi', 'Burns the mouth and gut.', ['horseradish', 'wasabi']),

  // ===== More herbs, grasses & plants =====
  ok('Herbs & plants', 'Timothy grass', 'Great low-sugar grass/hay.', ['timothy']),
  ok('Herbs & plants', 'Orchard grass', 'Good hay grass.', ['orchardgrass', 'orchard grass hay']),
  ok('Herbs & plants', 'Bermuda grass', 'Common hay grass in warm areas.', ['bermuda hay']),
  ok('Herbs & plants', 'Oat hay', 'Fine hay; check for seed heads.'),
  lim('Herbs & plants', 'Alfalfa hay', 'Part of the hay ration', 'Rich in protein and calcium; ask the barn.', ['lucerne hay']),
  lim('Herbs & plants', 'Ryegrass', 'Mixed pasture', 'Some ryegrass can cause "staggers".', ['rye grass']),
  lim('Herbs & plants', 'Fescue', 'Mixed pasture', 'Some fescue carries a fungus; mainly a risk for pregnant mares.', ['tall fescue']),
  lim('Herbs & plants', 'Red clover', 'Mixed in with grass', 'Moldy clover causes drooling.'),
  ok('Herbs & plants', 'Plantain (weed)', 'The leafy weed is fine to graze.', ['ribwort']),
  ok('Herbs & plants', 'Chickweed', 'Safe to graze.'),
  lim('Herbs & plants', 'Thyme', 'A sprig'),
  lim('Herbs & plants', 'Oregano', 'A pinch'),
  lim('Herbs & plants', 'Sage', 'A leaf or two'),
  lim('Herbs & plants', 'Fennel seeds', 'A pinch', 'Sometimes used for digestion.'),
  lim('Herbs & plants', 'Dried nettles', 'A small handful', 'Fresh nettles sting; dried is fine.', ['nettle', 'nettles']),
  lim('Herbs & plants', 'Rose hips', 'A few', 'Often in supplements.', ['rosehip']),
  lim('Herbs & plants', 'Seaweed / kelp', 'As a supplement only', 'High in iodine; ask the vet.', ['kelp', 'seaweed']),
  lim('Herbs & plants', 'Milk thistle', 'As a supplement only', 'Ask the vet.'),
  lim('Herbs & plants', 'Echinacea', 'As a supplement only', 'Ask the vet.'),
  lim('Herbs & plants', 'Straw', 'Bedding, not food', 'Some nibbling is fine; lots can cause impaction.', ['bedding straw']),
  no('Herbs & plants', 'Alsike clover', 'Damages the liver and causes sunburn-like skin.', ['alsike']),
  no('Herbs & plants', 'Moldy sweet clover', 'Causes dangerous bleeding.', ['sweet clover']),
  no('Herbs & plants', 'Comfrey', 'Damages the liver.'),
  no('Herbs & plants', 'St John’s wort', 'Makes pink skin burn badly in the sun.', ['st johns wort', 'saint johns wort']),
  no('Herbs & plants', 'Horsetail', 'Causes vitamin B1 deficiency.', ['mare’s tail']),

  // ===== More grains, feed & supplements =====
  lim('Grains & feed', 'Wheat (grain)', 'Small amounts only', 'Easy to overfeed; ask the barn.', ['wheat']),
  lim('Grains & feed', 'Rye (grain)', 'Small amounts only', 'Check for ergot (black fungus).', ['rye']),
  lim('Grains & feed', 'Oatmeal (plain)', 'A small handful', 'No sugar, raisins or chocolate.', ['porridge', 'rolled oats']),
  lim('Grains & feed', 'Soybean meal', 'Only in his feed', 'A protein source in many feeds.'),
  lim('Grains & feed', 'Brewer’s grains / brewer’s yeast', 'As a supplement', 'Ask the vet.', ['brewers yeast', 'brewers grains']),
  lim('Grains & feed', 'Senior feed', 'Only his own ration', 'For older horses; follow the bag.'),
  lim('Grains & feed', 'Ration balancer', 'Only his own ration', 'Vitamins and minerals in a small amount.'),
  ok('Grains & feed', 'Chaff (chopped hay)', 'Good for slowing down fast eaters.', ['chaff']),
  lim('Grains & feed', 'Haylage', 'As part of the hay ration', 'Must be fresh and made for horses.'),
  lim('Grains & feed', 'Vegetable oil', 'A small splash on feed', 'Adds calories; ask the vet.', ['corn oil', 'canola oil', 'oil']),
  lim('Grains & feed', 'Coconut oil', 'A spoonful', 'Adds calories.'),
  lim('Grains & feed', 'Fish oil', 'As a supplement', 'Omega-3s; ask the vet.', ['omega 3']),
  lim('Grains & feed', 'Electrolyte powder', 'As directed', 'On hot days or after hard work; always with water.', ['electrolytes']),
  lim('Grains & feed', 'Apple cider vinegar', 'A splash in water', 'Some owners use it; not required.', ['vinegar']),
  ok('Grains & feed', 'Fresh clean water', 'Always available; about 25–45 litres a day.', ['water']),
  no('Grains & feed', 'Cottonseed meal', 'Contains gossypol, which can poison horses.', ['cottonseed']),
  no('Grains & feed', 'Cattle silage', 'Risk of botulism and mold.', ['silage']),
  no('Grains & feed', 'Pig feed', 'May contain additives that harm horses.', ['hog feed', 'swine feed']),
  no('Grains & feed', 'Rabbit or guinea pig food', 'May contain additives; not balanced for horses.', ['rabbit food', 'guinea pig pellets']),
  no('Grains & feed', 'Birdseed', 'Can be dusty, moldy or treated.', ['bird seed']),

  // ===== More snacks & people food =====
  lim('Snacks & other', 'Plain rice cakes', '1 cake, broken up', 'No salt or flavouring.', ['rice cake']),
  lim('Snacks & other', 'Granola (no chocolate)', 'A small handful', 'Check there’s no chocolate or raisins with sugar coating.', ['granola']),
  lim('Snacks & other', 'Maple syrup', 'A drizzle', 'Sugary.'),
  lim('Snacks & other', 'Licorice horse treats', 'A few', 'Only treats made for horses.', ['licorice', 'liquorice']),
  lim('Snacks & other', 'Pumpkin seeds', 'A small handful', 'Plain and unsalted.', ['pepitas']),
  no('Snacks & other', 'Pasta & noodles', 'Like bread, can cause colic.', ['pasta', 'noodles', 'spaghetti', 'macaroni']),
  no('Snacks & other', 'Pizza, sandwiches & leftovers', 'Bread, meat, cheese, onion and salt: all bad.', ['pizza', 'sandwich', 'leftovers', 'burger']),
  no('Snacks & other', 'Ketchup & sauces', 'Tomato, onion, salt and sugar.', ['ketchup', 'sauce', 'mayonnaise']),
  no('Snacks & other', 'Chewing gum', 'Sticky, and sugar-free gum has sweeteners.', ['gum', 'xylitol']),
  no('Snacks & other', 'Jello & sweets', 'Pure sugar and additives.', ['jello', 'jelly', 'gelatin']),
  no('Snacks & other', 'Sports & energy drinks', 'Sugar and caffeine; use horse electrolytes instead.', ['gatorade', 'red bull']),
  no('Snacks & other', 'Eggs', 'Animal protein; not part of a horse’s diet.', ['egg']),
  no('Snacks & other', 'Salty snacks', 'Too much salt.', ['salted crackers', 'salted nuts']),
  no('Snacks & other', 'People medicine', 'Ibuprofen, acetaminophen, aspirin etc. can poison horses. Only what the vet prescribes.', ['ibuprofen', 'tylenol', 'acetaminophen', 'aspirin', 'advil', 'medicine', 'pills']),
  no('Snacks & other', 'Rat poison & chemicals', 'Deadly. Keep all chemicals, fertilizer and antifreeze away.', ['rat poison', 'fertilizer', 'antifreeze', 'pesticide', 'weed killer']),

  // ===== More toxic plants =====
  no('Toxic plants', 'Boxwood', 'Toxic hedge plant.', ['box hedge']),
  no('Toxic plants', 'Privet', 'Toxic hedge plant.'),
  no('Toxic plants', 'Cherry laurel', 'Leaves contain cyanide.', ['laurel']),
  no('Toxic plants', 'Wild cherry leaves', 'Wilted leaves release cyanide.', ['chokecherry', 'black cherry tree']),
  no('Toxic plants', 'Black locust', 'Bark, seeds and leaves are toxic.', ['locust tree']),
  no('Toxic plants', 'Horse chestnut / buckeye', 'Nuts and leaves are toxic.', ['conkers', 'buckeye', 'horse chestnut']),
  no('Toxic plants', 'Mountain laurel', 'Toxic to the heart.'),
  no('Toxic plants', 'Lantana', 'Damages the liver.'),
  no('Toxic plants', 'Castor bean', 'Seeds are deadly.', ['castor']),
  no('Toxic plants', 'Larkspur / delphinium', 'Toxic to nerves and heart.', ['larkspur', 'delphinium']),
  no('Toxic plants', 'Lupine', 'Toxic seeds and pods.', ['lupin']),
  no('Toxic plants', 'Milkweed', 'Toxic to the heart.'),
  no('Toxic plants', 'Jimsonweed', 'Very toxic.', ['datura', 'thorn apple']),
  no('Toxic plants', 'Tobacco', 'Nicotine is toxic.', ['cigarettes']),
  no('Toxic plants', 'Daffodils & tulips', 'Bulbs and leaves are toxic.', ['daffodil', 'tulip', 'bulbs']),
  no('Toxic plants', 'Hydrangea', 'Toxic leaves and flowers.'),
  no('Toxic plants', 'Wisteria', 'Toxic seeds and pods.'),
  no('Toxic plants', 'White snakeroot', 'Causes trembling and heart damage.', ['snakeroot']),
  no('Toxic plants', 'Russian knapweed', 'Causes a fatal brain disease, like star thistle.', ['knapweed']),
  no('Toxic plants', 'Fiddleneck', 'Damages the liver.'),
  no('Toxic plants', 'Hoary alyssum', 'Causes leg swelling and fever.', ['alyssum']),
  no('Toxic plants', 'Holly', 'Berries and leaves are toxic.'),
  no('Toxic plants', 'Mistletoe', 'Toxic.'),
  no('Toxic plants', 'Poinsettia', 'Irritates the mouth and gut.'),
  no('Toxic plants', 'Pine & evergreen needles', 'Can cause colic; some (like yew) are deadly.', ['pine', 'christmas tree', 'juniper', 'cedar']),
  no('Toxic plants', 'English ivy', 'Toxic leaves and berries.', ['ivy']),
  no('Toxic plants', 'Morning glory', 'Seeds are toxic.'),
  no('Toxic plants', 'Cocklebur', 'Seedlings are very toxic.'),
  no('Toxic plants', 'Arrowgrass', 'Contains cyanide.'),
  no('Toxic plants', 'Field bindweed', 'Can cause colic.', ['bindweed']),
  no('Toxic plants', 'Bracken & other ferns', 'Causes vitamin B1 deficiency.', ['ferns']),
  no('Toxic plants', 'Water hemlock', 'One of the most toxic plants; deadly fast.', ['cowbane']),
  no('Toxic plants', 'Ornamental plants & house plants', 'Many garden and house plants are toxic. Don’t let him graze gardens.', ['house plant', 'houseplant', 'garden plants', 'flowers']),
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
export function stem(w: string) {
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
    const words = t.split(' ')
    if (t === q) best = Math.max(best, 100)
    else if (words.some((w) => w === q) || q.split(' ').every((qw) => words.includes(qw))) best = Math.max(best, 80)
    // a prefix only counts as an answer when most of the word is typed ("appl" → apples, but not "rock" → rocket)
    else if (words.some((w) => w.startsWith(q) && q.length / w.length >= 0.75)) best = Math.max(best, 80)
    else if (words.some((w) => w.startsWith(q))) best = Math.max(best, 60)
    else if (q.length >= 3 && t.includes(q)) best = Math.max(best, 40)
    else if (q.length >= 4 && q.includes(t) && t.length >= 4) best = Math.max(best, 30)
  }
  return best
}

export function searchFoods<T extends { name: string; aliases?: string[] }>(query: string, foods: T[]): T[] {
  return foods
    .map((f) => ({ f, s: matchScore(query, f) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.f.name.length - b.f.name.length || a.f.name.localeCompare(b.f.name))
    .map((x) => x.f)
}

export function sameFood(a: string, b: string) {
  const na = normalizeFood(a).split(/[ /&-]+/).map(stem).join(' ')
  const nb = normalizeFood(b).split(/[ /&-]+/).map(stem).join(' ')
  return na === nb
}

/** Best match and how sure we are: 'answer' (show yes/no), 'maybe' (did you mean…), 'none'. */
export function lookupFood<T extends { name: string; aliases?: string[] }>(query: string, foods: T[]) {
  const scored = foods
    .map((f) => ({ f, s: matchScore(query, f) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.f.name.length - b.f.name.length || a.f.name.localeCompare(b.f.name))
  const top = scored[0]
  const kind: 'answer' | 'maybe' | 'none' = !top ? 'none' : top.s >= 80 ? 'answer' : 'maybe'
  return { kind, top: top?.f, topScore: top?.s ?? 0, matches: scored.map((x) => x.f) }
}
