/**
 * Horse-safe birthday cakes. No flour, bread, chocolate, frosting or people-cake:
 * every ingredient is on the app's food guide as allowed or "limit" (see cakes.test.ts).
 */
export type Ingredient = { text: string; /** exact name in FOOD_GUIDE, checked by the tests */ food?: string }
export type Cake = {
  key: string
  emoji: string
  name: string
  about: string
  time: string
  oven: boolean
  /** main kind, for filters */
  kind: 'no-bake' | 'baked' | 'frozen' | 'mini'
  /** ready in about 20 minutes, no long soaking or freezing */
  quick?: boolean
  sugar: 'low' | 'medium' | 'higher'
  serves: string
  ingredients: Ingredient[]
  steps: string[]
  tip?: string
}

export const CAKE_SAFETY = [
  'It’s a treat, not a meal: EJ gets a slice or two. Save the rest for the next few days, or share with barn friends (ask their owners first).',
  'If the vet has said to limit sugar (insulin resistance, EMS, Cushing’s or laminitis), only make the 🟢 low-sugar cakes and skip molasses, banana and honey.',
  'Never people-cake, bread, flour, chocolate, frosting, sprinkles or anything with sweeteners.',
  'Grate carrots and apples or cut them in long sticks. Round chunks can make a horse choke.',
  'Always soak beet pulp and hay cubes until soft before they go in a cake.',
  'Carrot “candles” only: no lit candles, wrappers or plastic toppers near him.',
  'New foods slowly: if he’s never had something, give him a little first.',
  'Keep baked cakes in the fridge and use within 3 days. Throw away anything mouldy.',
]

const FIRST_CAKES: Cake[] = [
  {
    key: 'carrot-candle',
    kind: 'no-bake',
    quick: true,
    emoji: '🥕',
    name: 'Carrot candle layer cake',
    about: 'The easiest one: no oven, ready in 10 minutes, and looks great in photos.',
    time: '10 min (+ soaking)',
    oven: false,
    sugar: 'low',
    serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '2 cups timothy pellets', food: 'Timothy pellets' },
      { text: '2 large carrots, grated, plus 3 carrots cut in long sticks for “candles”', food: 'Carrots' },
      { text: '1 apple, thinly sliced (core removed)', food: 'Apples' },
      { text: 'A few mint leaves to decorate', food: 'Mint leaves' },
    ],
    steps: [
      'Soak the pellets in about 1 cup of warm water for 10–15 minutes until soft and mushy.',
      'Line a small bowl with plastic wrap. Press half the soaked pellets in firmly.',
      'Add a layer of grated carrot, then the rest of the pellets, and press down hard.',
      'Turn the bowl upside down onto a plate or feed pan and lift it off.',
      'Cover the top with apple slices in a circle, stand the carrot sticks up as candles, and add mint leaves.',
    ],
    tip: 'Sing, take the photo, then let him eat the candles first.',
  },
  {
    key: 'oat-carrot',
    kind: 'baked',
    emoji: '🎂',
    name: 'Baked oat & carrot birthday cake',
    about: 'A real “cake” that slices nicely, made with oats instead of flour.',
    time: '15 min + 35 min baking',
    oven: true,
    sugar: 'medium',
    serves: '8 slices (1–2 for EJ)',
    ingredients: [
      { text: '2 cups rolled oats (plain)', food: 'Oatmeal (plain)' },
      { text: '1 cup grated carrot', food: 'Carrots' },
      { text: '1 apple, grated (core removed)', food: 'Apples' },
      { text: '½ cup unsweetened applesauce', food: 'Applesauce (unsweetened)' },
      { text: '1 ripe banana, mashed', food: 'Bananas' },
      { text: '1 tablespoon molasses (optional; leave out for less sugar)', food: 'Molasses' },
      { text: 'A little coconut oil to grease the pan', food: 'Coconut oil' },
    ],
    steps: [
      'Heat the oven to 350°F (175°C). Grease an 8-inch (20 cm) round cake pan with coconut oil.',
      'Mix everything in a big bowl until it holds together like thick cookie dough. Add a splash of water if it’s crumbly.',
      'Press it firmly into the pan and smooth the top.',
      'Bake 30–35 minutes until firm and golden at the edges.',
      'Cool completely in the pan (it firms up as it cools), then turn it out.',
      'Decorate with apple slices and carrot-stick candles. Cut into 8 slices.',
    ],
    tip: 'Ask an adult to help with the oven.',
  },
  {
    key: 'banana-cupcakes',
    kind: 'mini',
    emoji: '🧁',
    name: 'Banana-oat cupcakes',
    about: 'Little cupcakes: easy to share with friends and easy to hold out on your hand.',
    time: '10 min + 20 min baking',
    oven: true,
    sugar: 'medium',
    serves: '12 cupcakes (2–3 for EJ)',
    ingredients: [
      { text: '2 ripe bananas, mashed', food: 'Bananas' },
      { text: '1½ cups rolled oats (plain)', food: 'Oatmeal (plain)' },
      { text: '½ cup grated carrot', food: 'Carrots' },
      { text: '2 tablespoons ground flaxseed', food: 'Ground flaxseed' },
      { text: '1 tablespoon peanut butter (optional, plain)', food: 'Peanut butter' },
      { text: 'Unsweetened applesauce to spread on top', food: 'Applesauce (unsweetened)' },
      { text: 'Blueberries to decorate', food: 'Blueberries' },
    ],
    steps: [
      'Heat the oven to 350°F (175°C). Put paper cases in a 12-cup muffin tin (take the paper off before serving!).',
      'Mash the bananas, then stir in the oats, carrot, flax and peanut butter.',
      'Fill each case about ¾ full and press down.',
      'Bake 18–20 minutes until firm. Cool completely.',
      'Spread a thin layer of applesauce on top and press a blueberry into each.',
    ],
  },
  {
    key: 'frozen-ring',
    kind: 'frozen',
    emoji: '🧊',
    name: 'Frozen apple ring cake',
    about: 'A cool lick-cake for a warm May day. He licks and crunches his way through it.',
    time: '15 min + freezing overnight',
    oven: false,
    sugar: 'medium',
    serves: '1 horse, over an afternoon',
    ingredients: [
      { text: '2 apples, cut in thin slices (core removed)', food: 'Apples' },
      { text: '2 carrots, cut in long thin sticks', food: 'Carrots' },
      { text: '6–8 strawberries, halved', food: 'Strawberries' },
      { text: '½ cup unsweetened applesauce', food: 'Applesauce (unsweetened)' },
      { text: 'A handful of mint leaves', food: 'Mint leaves' },
      { text: 'Water' },
    ],
    steps: [
      'Spread the fruit, carrot and mint around a bundt (ring) pan.',
      'Stir the applesauce into about 4 cups of water and pour it over until everything is covered.',
      'Freeze overnight.',
      'To unmould, dip the pan in warm water for 30 seconds and flip it onto a feed pan.',
      'Serve in the shade and stay nearby while he works on it.',
    ],
    tip: 'Don’t hang it where he could swallow big frozen chunks; give it in a pan on the ground.',
  },
  {
    key: 'watermelon',
    kind: 'no-bake',
    quick: true,
    emoji: '🍉',
    name: 'Watermelon “cake”',
    about: 'No oven, no mixing: a thick watermelon round decorated like a cake.',
    time: '15 min',
    oven: false,
    sugar: 'higher',
    serves: '1 horse, a few wedges',
    ingredients: [
      { text: 'A 2-inch (5 cm) thick round of seedless watermelon, rind cut off', food: 'Watermelon' },
      { text: '5 strawberries', food: 'Strawberries' },
      { text: 'A handful of blueberries', food: 'Blueberries' },
      { text: '1 apple, sliced (core removed)', food: 'Apples' },
      { text: '2 carrots in long sticks for candles', food: 'Carrots' },
    ],
    steps: [
      'Cut a thick round slice from the middle of the watermelon and trim off the rind.',
      'Lay it on a plate. Decorate the top with a ring of apple slices, strawberries and blueberries.',
      'Push in carrot-stick candles.',
      'Cut into wedges to feed.',
    ],
    tip: 'Watermelon is sweet, so keep it to a few wedges.',
  },
  {
    key: 'beet-pulp',
    kind: 'no-bake',
    emoji: '🎉',
    name: 'Beet pulp party cake',
    about: 'Moist and full of fibre, shaped in a bowl like a dome cake.',
    time: '15 min + 2 hours soaking',
    oven: false,
    sugar: 'low',
    serves: '1 horse, 2–3 helpings',
    ingredients: [
      { text: '1 cup dry beet pulp, soaked in 4 cups water for 2+ hours', food: 'Beet pulp (soaked)' },
      { text: '1 cup rolled oats (plain)', food: 'Oatmeal (plain)' },
      { text: '1 carrot, grated, plus carrot sticks for candles', food: 'Carrots' },
      { text: '1 apple, grated (core removed)', food: 'Apples' },
      { text: '2 tablespoons ground flaxseed', food: 'Ground flaxseed' },
    ],
    steps: [
      'Soak the beet pulp until it is fluffy and has soaked up all the water (at least 2 hours). It swells to about 3 times its size.',
      'Squeeze out extra water, then mix in the oats, carrot, apple and flax.',
      'Pack it tightly into a bowl lined with plastic wrap and chill for 1 hour.',
      'Flip onto a plate, peel off the wrap and add carrot candles.',
    ],
    tip: 'Never feed beet pulp dry: it swells in the gut and can cause choke or colic.',
  },
  {
    key: 'pumpkin',
    kind: 'baked',
    emoji: '🎃',
    name: 'Pumpkin oat cake',
    about: 'A baked cake that’s a bit lower in sugar than banana or molasses ones.',
    time: '10 min + 30 min baking',
    oven: true,
    sugar: 'low',
    serves: '8 slices (1–2 for EJ)',
    ingredients: [
      { text: '1 cup plain canned pumpkin (not pie filling) or cooked mashed pumpkin', food: 'Pumpkin' },
      { text: '2 cups rolled oats (plain)', food: 'Oatmeal (plain)' },
      { text: '¼ cup ground flaxseed', food: 'Ground flaxseed' },
      { text: '1 carrot, grated', food: 'Carrots' },
      { text: '2 tablespoons pumpkin seeds (plain, unsalted) to decorate', food: 'Pumpkin seeds' },
      { text: 'A little coconut oil to grease the pan', food: 'Coconut oil' },
    ],
    steps: [
      'Heat the oven to 350°F (175°C) and grease an 8-inch (20 cm) pan.',
      'Mix the pumpkin, oats, flax and carrot. Add water a spoonful at a time until it sticks together.',
      'Press into the pan, sprinkle pumpkin seeds on top and press them in.',
      'Bake about 30 minutes until firm. Cool completely before cutting.',
    ],
    tip: 'Check the can says 100% pumpkin; pie filling has sugar and spices.',
  },
  {
    key: 'hay-cube',
    kind: 'no-bake',
    emoji: '🌾',
    name: 'Low-sugar hay cube cake',
    about: 'For horses watching their sugar: made from what he already eats.',
    time: '10 min + 30 min soaking',
    oven: false,
    sugar: 'low',
    serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '6–8 hay cubes, soaked until soft', food: 'Alfalfa cubes' },
      { text: '1 cup timothy pellets, soaked', food: 'Timothy pellets' },
      { text: '1 tablespoon ground flaxseed', food: 'Ground flaxseed' },
      { text: '2 celery sticks, cut small', food: 'Celery' },
      { text: 'Mint leaves and a few blueberries on top', food: 'Mint leaves' },
      { text: '1 carrot stick as the single candle', food: 'Carrots' },
    ],
    steps: [
      'Soak the hay cubes for about 30 minutes and the pellets for 15, until both are soft.',
      'Mix them with the flax and celery.',
      'Press into a small bowl, flip it onto a plate and decorate with mint and a few blueberries.',
      'Add one carrot candle.',
    ],
    tip: 'Ask the barn which hay cubes he’s used to (timothy, alfalfa or a mix).',
  },
]

const OAT = 'Oatmeal (plain)'
const SAUCE = 'Applesauce (unsweetened)'
const FLAX = 'Ground flaxseed'
const PELLETS = 'Timothy pellets'
const OVEN = 'Heat the oven to 350°F (175°C) and grease the pan with a little coconut oil.'
const COOL = 'Cool completely before cutting; it firms up as it cools.'
const SOAK_PELLETS = 'Soak the pellets in warm water (about half as much water as pellets) for 15 minutes until soft.'
const UNMOULD = 'Turn the bowl upside down onto a plate or feed pan and lift it off.'

const MORE_CAKES: Cake[] = [
  // ---------- baked ----------
  {
    key: 'classic-carrot', emoji: '🥕', name: 'Classic carrot cake (no flour)', kind: 'baked', oven: true, sugar: 'medium',
    about: 'The horse version of the famous cake: packed with carrots and a few raisins.', time: '15 min + 35 min baking', serves: '8 slices (1–2 for EJ)',
    ingredients: [
      { text: '2 cups rolled oats (plain)', food: OAT },
      { text: '2 cups grated carrot', food: 'Carrots' },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: '2 tablespoons raisins', food: 'Raisins' },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
      { text: 'Topping: 1 mashed banana and extra grated carrot', food: 'Bananas' },
    ],
    steps: [OVEN, 'Mix the oats, carrot, applesauce, raisins and flax. Add water a spoonful at a time until it holds together.', 'Press firmly into an 8-inch (20 cm) round pan.', 'Bake 30–35 minutes until firm and golden.', COOL, 'Spread the mashed banana on top and sprinkle with grated carrot.'],
  },
  {
    key: 'apple-crumble', emoji: '🍏', name: 'Apple crumble cake', kind: 'baked', oven: true, sugar: 'medium',
    about: 'Soft apple cake with a crunchy oat top.', time: '15 min + 30 min baking', serves: '8 slices',
    ingredients: [
      { text: '2 apples, grated (cores removed), plus 1 sliced for the top', food: 'Apples' },
      { text: '2 cups rolled oats, plus ½ cup for the crumble', food: OAT },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: '¼ cup wheat bran', food: 'Wheat bran' },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: '1 tablespoon coconut oil', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix the grated apple, 2 cups oats, applesauce, bran and flax. Press into an 8-inch pan.', 'Lay the apple slices on top.', 'Rub the extra ½ cup oats with the coconut oil and scatter it over.', 'Bake about 30 minutes until the top is golden.', COOL],
  },
  {
    key: 'pear-oat', emoji: '🍐', name: 'Pear & oat cake', kind: 'baked', oven: true, sugar: 'medium',
    about: 'Like the apple cake, but with juicy pears.', time: '10 min + 30 min baking', serves: '8 slices',
    ingredients: [
      { text: '2 ripe pears, grated (cores removed)', food: 'Pears' },
      { text: '2 cups rolled oats', food: OAT },
      { text: '¼ cup unsweetened applesauce', food: SAUCE },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix everything until it sticks together.', 'Press into an 8-inch pan.', 'Bake about 30 minutes until firm.', COOL],
  },
  {
    key: 'sweet-potato', emoji: '🍠', name: 'Sweet potato cake', kind: 'baked', oven: true, sugar: 'medium',
    about: 'Orange, soft and filling. Use plain cooked sweet potato.', time: '15 min + 30 min baking', serves: '8 slices',
    ingredients: [
      { text: '1 cup plain cooked sweet potato, mashed and cooled (no butter or salt)', food: 'Sweet potato' },
      { text: '2 cups rolled oats', food: OAT },
      { text: '1 carrot, grated', food: 'Carrots' },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mash the sweet potato and mix in the oats, carrot and flax.', 'Press into an 8-inch pan.', 'Bake about 30 minutes.', COOL],
  },
  {
    key: 'butternut', emoji: '🎃', name: 'Butternut squash cake', kind: 'baked', oven: true, sugar: 'low',
    about: 'A low-sugar baked cake with a seedy crunchy top.', time: '15 min + 30 min baking', serves: '8 slices',
    ingredients: [
      { text: '1 cup cooked, mashed butternut squash (plain)', food: 'Butternut squash' },
      { text: '2 cups rolled oats', food: OAT },
      { text: '¼ cup ground flaxseed', food: FLAX },
      { text: '2 tablespoons pumpkin seeds (plain, unsalted)', food: 'Pumpkin seeds' },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix the squash, oats and flax with a little water until it holds together.', 'Press into an 8-inch pan and press the pumpkin seeds on top.', 'Bake about 30 minutes.', COOL],
  },
  {
    key: 'zucchini-loaf', emoji: '🥒', name: 'Zucchini & carrot loaf', kind: 'baked', oven: true, sugar: 'low',
    about: 'A veggie loaf cake you cut into thick slices.', time: '15 min + 40 min baking', serves: '1 loaf, 10 slices',
    ingredients: [
      { text: '1 zucchini, grated and squeezed dry', food: 'Zucchini' },
      { text: '1 cup grated carrot', food: 'Carrots' },
      { text: '2 cups rolled oats', food: OAT },
      { text: '¼ cup unsweetened applesauce', food: SAUCE },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Squeeze the grated zucchini in a towel to get the water out.', 'Mix everything together and press into a loaf pan.', 'Bake about 40 minutes until firm.', COOL],
  },
  {
    key: 'orange-cranberry', emoji: '🍊', name: 'Orange & cranberry cake', kind: 'baked', oven: true, sugar: 'medium',
    about: 'Fresh and fruity, with little red cranberries.', time: '15 min + 30 min baking', serves: '8 slices',
    ingredients: [
      { text: '1 orange, peeled and chopped (no seeds)', food: 'Orange segments' },
      { text: '2 tablespoons dried cranberries (no added sugar)', food: 'Cranberries' },
      { text: '2 cups rolled oats', food: OAT },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix everything together.', 'Press into an 8-inch pan.', 'Bake about 30 minutes.', COOL],
  },
  {
    key: 'horseshoe', emoji: '🧲', name: 'Lucky horseshoe cake', kind: 'baked', oven: true, sugar: 'medium',
    about: 'Bake a round oat cake and cut it into a horseshoe. Carrot sticks are the nails.', time: '20 min + 35 min baking', serves: '6 slices',
    ingredients: [
      { text: '2 cups rolled oats', food: OAT },
      { text: '1 cup grated carrot, plus 6 thin carrot sticks', food: 'Carrots' },
      { text: '1 banana, mashed', food: 'Bananas' },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix the oats, grated carrot, banana and applesauce and press into a round pan.', 'Bake 30–35 minutes, then cool completely.', 'Cut a small circle out of the middle and a wedge out of one side to make a U shape.', 'Push in carrot sticks along the shoe as the “nails”.'],
    tip: 'Turn it the lucky way up (open end at the top) for the photo!',
  },
  {
    key: 'number', emoji: '🔢', name: 'Number cake (his age!)', kind: 'baked', oven: true, sugar: 'medium',
    about: 'Bake two loaf cakes and cut them into the numbers of his age, like 1 and 3.', time: '20 min + 40 min baking', serves: 'Lots: share with barn friends',
    ingredients: [
      { text: '4 cups rolled oats', food: OAT },
      { text: '2 cups grated carrot', food: 'Carrots' },
      { text: '1 cup unsweetened applesauce', food: SAUCE },
      { text: '2 bananas, mashed', food: 'Bananas' },
      { text: 'Strawberries and blueberries to decorate', food: 'Strawberries' },
      { text: 'Coconut oil for the pans', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix the oats, carrot, applesauce and banana. Split between two loaf pans and press down.', 'Bake about 40 minutes. Cool completely.', 'Cut the loaves into number shapes (a straight bar makes a 1; arrange pieces for other numbers).', 'Line the numbers with strawberries and blueberries.'],
    tip: 'This makes a lot. EJ gets one or two pieces; the rest keeps 3 days in the fridge.',
  },
  // ---------- mini (cupcakes, cookies, bites) ----------
  {
    key: 'oat-cookies', emoji: '🍪', name: 'Oat & molasses cookies', kind: 'mini', oven: true, sugar: 'medium',
    about: 'Crunchy cookies that keep for a week in a jar: great for party bags.', time: '15 min + 15 min baking', serves: 'About 20 cookies (2–3 a day)',
    ingredients: [
      { text: '2 cups rolled oats', food: OAT },
      { text: '1 cup grated carrot', food: 'Carrots' },
      { text: '1 tablespoon molasses', food: 'Molasses' },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: 'A few tablespoons of water' },
    ],
    steps: ['Heat the oven to 350°F (175°C) and line a tray with baking paper.', 'Mix everything, adding water until you can roll balls.', 'Roll walnut-sized balls and flatten them on the tray.', 'Bake 15 minutes, then leave them in the turned-off oven to dry and crisp.'],
  },
  {
    key: 'gingerbread', emoji: '🐴', name: 'Gingerbread horse cookies', kind: 'mini', oven: true, sugar: 'medium',
    about: 'Cut them out with a horse-shaped cookie cutter.', time: '20 min + 15 min baking', serves: 'About 15 cookies',
    ingredients: [
      { text: '2 cups rolled oats, blended into a coarse powder', food: OAT },
      { text: '1 small slice of fresh ginger, finely grated', food: 'Ginger' },
      { text: '1 tablespoon molasses', food: 'Molasses' },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: '1 tablespoon ground flaxseed', food: FLAX },
    ],
    steps: ['Heat the oven to 350°F (175°C).', 'Blend the oats in a blender until powdery, then mix in everything else to make a firm dough.', 'Press the dough flat between baking paper, about ½ cm thick.', 'Cut out horse shapes and bake 12–15 minutes.', 'Cool on a rack until crunchy.'],
  },
  {
    key: 'stuffed-apples', emoji: '🍎', name: 'Baked stuffed apples', kind: 'mini', oven: true, sugar: 'medium',
    about: 'Each apple is its own little cake.', time: '10 min + 25 min baking', serves: '4 apples (1–2 for EJ)',
    ingredients: [
      { text: '4 apples, cores scooped out', food: 'Apples' },
      { text: '½ cup rolled oats', food: OAT },
      { text: '½ cup grated carrot', food: 'Carrots' },
      { text: '1 tablespoon ground flaxseed', food: FLAX },
      { text: 'A drizzle of molasses (optional)', food: 'Molasses' },
    ],
    steps: ['Heat the oven to 350°F (175°C).', 'Scoop the cores out of the apples, leaving the bottoms on.', 'Mix the oats, carrot and flax and stuff the apples.', 'Stand them in a dish with a little water and bake about 25 minutes until soft.', 'Cool completely, then cut in halves or quarters to feed.'],
  },
  {
    key: 'mini-apple-pies', emoji: '🥧', name: 'Mini apple “pies”', kind: 'mini', oven: true, sugar: 'medium',
    about: 'Oat crust cups filled with apple, baked in a muffin tin.', time: '20 min + 20 min baking', serves: '12 mini pies',
    ingredients: [
      { text: '2 cups rolled oats', food: OAT },
      { text: '¾ cup unsweetened applesauce', food: SAUCE },
      { text: '2 apples, finely chopped (cores removed)', food: 'Apples' },
      { text: '1 tablespoon ground flaxseed', food: FLAX },
      { text: 'Coconut oil for the tin', food: 'Coconut oil' },
    ],
    steps: ['Heat the oven to 350°F (175°C) and grease a 12-cup muffin tin.', 'Mix the oats, flax and applesauce. Press a spoonful into each cup and up the sides.', 'Fill the middles with chopped apple.', 'Bake about 20 minutes. Cool in the tin, then pop them out.'],
  },
  {
    key: 'pumpkin-muffins', emoji: '🧁', name: 'Pumpkin muffins', kind: 'mini', oven: true, sugar: 'low',
    about: 'Low-sugar muffins: good for horses watching their sugar.', time: '10 min + 20 min baking', serves: '12 muffins',
    ingredients: [
      { text: '1 cup plain canned pumpkin (100% pumpkin)', food: 'Pumpkin' },
      { text: '1½ cups rolled oats', food: OAT },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: '1 tablespoon black oil sunflower seeds to sprinkle', food: 'Sunflower seeds (black oil)' },
    ],
    steps: ['Heat the oven to 350°F (175°C) and line a muffin tin (remove the paper before feeding).', 'Mix the pumpkin, oats and flax.', 'Fill the cups, press down and sprinkle with sunflower seeds.', 'Bake about 20 minutes. Cool completely.'],
  },
  {
    key: 'peppermint-cupcakes', emoji: '🍬', name: 'Peppermint cupcakes', kind: 'mini', oven: true, sugar: 'higher',
    about: 'For the horse who loves mints. Very much a once-a-year treat.', time: '15 min + 20 min baking', serves: '12 cupcakes (2 for EJ)',
    ingredients: [
      { text: '1½ cups rolled oats', food: OAT },
      { text: '1 banana, mashed', food: 'Bananas' },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: 'A few mint leaves, chopped', food: 'Mint leaves' },
      { text: '3 peppermints, crushed, to sprinkle on top', food: 'Peppermints' },
    ],
    steps: ['Heat the oven to 350°F (175°C) and line a muffin tin.', 'Mix the oats, banana, applesauce and mint.', 'Fill the cups and bake 18–20 minutes. Cool.', 'Just before serving, sprinkle a little crushed peppermint on top.'],
    tip: 'Use only about 3 mints for the whole batch.',
  },
  {
    key: 'rice-cake-tower', emoji: '🥜', name: 'Peanut butter banana stack', kind: 'mini', oven: false, quick: true, sugar: 'medium',
    about: 'A rice cake with a thin layer of peanut butter and banana: 5 minutes, done.', time: '5 min', serves: '1 horse',
    ingredients: [
      { text: '1 plain rice cake (unsalted)', food: 'Plain rice cakes' },
      { text: 'A thin smear of plain peanut butter', food: 'Peanut butter' },
      { text: 'Half a banana, sliced', food: 'Bananas' },
      { text: '1 carrot stick candle', food: 'Carrots' },
    ],
    steps: ['Spread a very thin layer of peanut butter on the rice cake.', 'Cover with banana slices.', 'Stand the carrot candle in the middle.', 'Break into pieces to feed.'],
    tip: 'Thin is key: thick peanut butter can stick in his mouth.',
  },
  {
    key: 'date-bites', emoji: '🟤', name: 'Date & oat energy bites', kind: 'mini', oven: false, sugar: 'higher',
    about: 'No-bake sticky balls: sweet, so just a couple each.', time: '15 min + 1 hour chilling', serves: '10 bites (2 for EJ)',
    ingredients: [
      { text: '3 pitted dates, finely chopped (check there are no pits!)', food: 'Dates (pitted)' },
      { text: '1 cup rolled oats', food: OAT },
      { text: '2 tablespoons ground flaxseed', food: FLAX },
      { text: '½ cup grated carrot', food: 'Carrots' },
      { text: '2–3 tablespoons unsweetened applesauce', food: SAUCE },
    ],
    steps: ['Mix everything together until sticky.', 'Roll into small balls.', 'Chill for an hour to firm up.'],
  },
  {
    key: 'granola-bars', emoji: '🍫', name: 'Granola birthday bars', kind: 'mini', oven: true, sugar: 'medium',
    about: 'Chewy bars. Check the granola has no chocolate!', time: '10 min + 25 min baking', serves: '12 bars',
    ingredients: [
      { text: '1 cup plain granola with NO chocolate', food: 'Granola (no chocolate)' },
      { text: '1 cup rolled oats', food: OAT },
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: '2 tablespoons pumpkin seeds (plain)', food: 'Pumpkin seeds' },
      { text: 'Coconut oil for the pan', food: 'Coconut oil' },
    ],
    steps: [OVEN, 'Mix everything and press firmly into a square pan.', 'Bake about 25 minutes.', 'Cool completely, then cut into bars.'],
  },
  // ---------- no-bake ----------
  {
    key: 'berry-blast', emoji: '🫐', name: 'Berry blast cake', kind: 'no-bake', oven: false, quick: true, sugar: 'medium',
    about: 'A pellet cake covered in colourful berries.', time: '20 min', serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: 'A small handful of blueberries', food: 'Blueberries' },
      { text: 'A small handful of raspberries', food: 'Raspberries' },
      { text: 'A small handful of blackberries', food: 'Blackberries' },
      { text: '3 strawberries, halved', food: 'Strawberries' },
    ],
    steps: [SOAK_PELLETS, 'Press the soft pellets into a small bowl lined with plastic wrap.', UNMOULD, 'Cover the top with the berries.'],
  },
  {
    key: 'tropical', emoji: '🍍', name: 'Tropical party cake', kind: 'no-bake', oven: false, sugar: 'higher',
    about: 'A beach-party cake with mango, pineapple and coconut.', time: '20 min + 2 hours soaking', serves: '1 horse, 2–3 helpings',
    ingredients: [
      { text: '1 cup dry beet pulp, soaked in 4 cups water for 2+ hours', food: 'Beet pulp (soaked)' },
      { text: '2–3 slices of mango (no stone)', food: 'Mango' },
      { text: '2–3 small chunks of pineapple (no skin or core)', food: 'Pineapple' },
      { text: '2–3 chunks of papaya (no seeds or skin)', food: 'Papaya' },
      { text: 'A few small pieces of fresh coconut', food: 'Coconut' },
    ],
    steps: ['Soak the beet pulp until it is fluffy and has soaked up all the water.', 'Squeeze out extra water and pack it into a bowl lined with plastic wrap.', UNMOULD, 'Decorate with the mango, pineapple, papaya and coconut.'],
  },
  {
    key: 'rainbow', emoji: '🌈', name: 'Rainbow cake', kind: 'no-bake', oven: false, quick: true, sugar: 'higher',
    about: 'Stripes of colour on a round pellet cake. Amazing in photos.', time: '20 min', serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: 'Red: 3 strawberries, sliced', food: 'Strawberries' },
      { text: 'Orange: 1 carrot, in thin coins cut lengthwise', food: 'Carrots' },
      { text: 'Yellow: 2 slices of mango', food: 'Mango' },
      { text: 'Green: a few cucumber slices', food: 'Cucumber' },
      { text: 'Blue: a few blueberries', food: 'Blueberries' },
      { text: 'Purple: 5 seedless grapes, halved', food: 'Grapes (seedless)' },
    ],
    steps: [SOAK_PELLETS, 'Press the pellets into a flat round on a plate.', 'Lay the fruit and veg in curved stripes across the top: red, orange, yellow, green, blue, purple.'],
  },
  {
    key: 'heart', emoji: '❤️', name: 'Heart cake', kind: 'no-bake', oven: false, sugar: 'medium',
    about: 'A pink heart-shaped cake. Beets make it naturally pink.', time: '20 min + 2 hours soaking', serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '1 cup dry beet pulp, soaked in 4 cups water for 2+ hours', food: 'Beet pulp (soaked)' },
      { text: '2 slices of fresh beet, grated', food: 'Beets (beetroot)' },
      { text: '3 strawberries, halved', food: 'Strawberries' },
      { text: 'A few raspberries', food: 'Raspberries' },
    ],
    steps: ['Soak the beet pulp until fluffy, then squeeze out extra water.', 'Mix in the grated beet: it turns everything pink.', 'Shape it into a heart on a plate (or press into a heart-shaped tin and flip it out).', 'Decorate the edge with strawberries and raspberries.'],
    tip: 'Beets can make his pee red for a day. That’s normal!',
  },
  {
    key: 'carrot-tower', emoji: '🏰', name: 'Carrot log tower', kind: 'no-bake', oven: false, quick: true, sugar: 'low',
    about: 'Carrot sticks stacked like a log cabin on a pellet base.', time: '15 min', serves: '1 horse',
    ingredients: [
      { text: '1 cup timothy pellets', food: PELLETS },
      { text: '4–5 carrots, cut lengthwise into long sticks', food: 'Carrots' },
      { text: 'Carrot tops (the leafy greens) for decoration', food: 'Carrot tops' },
    ],
    steps: [SOAK_PELLETS, 'Spread the soft pellets on a plate as the base.', 'Stack carrot sticks in a square, two at a time, crossing each layer like a log cabin.', 'Tuck carrot tops in the top like a flag.'],
  },
  {
    key: 'garden-veg', emoji: '🥬', name: 'Garden veggie cake', kind: 'no-bake', oven: false, sugar: 'low',
    about: 'Low-sugar and fresh, made from garden veggies.', time: '20 min + soaking', serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: '½ zucchini, grated', food: 'Zucchini' },
      { text: 'A few cucumber slices', food: 'Cucumber' },
      { text: '1 celery stick, cut small', food: 'Celery' },
      { text: 'A small bunch of parsley', food: 'Parsley' },
      { text: 'Carrot tops to decorate', food: 'Carrot tops' },
    ],
    steps: [SOAK_PELLETS, 'Mix the grated zucchini into the pellets and press into a bowl.', UNMOULD, 'Decorate with cucumber, celery, parsley and carrot tops.'],
  },
  {
    key: 'salad-stack', emoji: '🥗', name: 'Salad layer cake', kind: 'no-bake', oven: false, quick: true, sugar: 'low',
    about: 'Layers of crunchy leaves and veg. No soaking needed.', time: '10 min', serves: '1 horse',
    ingredients: [
      { text: '6 romaine lettuce leaves', food: 'Romaine lettuce' },
      { text: '1 carrot, grated', food: 'Carrots' },
      { text: 'A few cucumber slices', food: 'Cucumber' },
      { text: 'A small handful of green beans, cut up', food: 'Green beans' },
      { text: 'A small handful of peas', food: 'Peas & snap peas' },
    ],
    steps: ['Lay two lettuce leaves flat on a plate.', 'Add a layer of grated carrot, then more leaves, then cucumber and beans.', 'Keep layering and finish with peas on top.'],
  },
  {
    key: 'mint-fresh', emoji: '🌿', name: 'Minty fresh cake', kind: 'no-bake', oven: false, quick: true, sugar: 'medium',
    about: 'Apples and lots of fresh mint: most horses go crazy for mint.', time: '20 min', serves: '1 horse, 2 helpings',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: 'A big handful of mint leaves', food: 'Mint leaves' },
      { text: '1 apple, sliced (core removed)', food: 'Apples' },
      { text: '2 peppermints on top (optional)', food: 'Peppermints' },
    ],
    steps: [SOAK_PELLETS, 'Chop half the mint and mix it into the pellets.', 'Press into a bowl and turn out onto a plate.', 'Decorate with apple slices, the rest of the mint and the peppermints.'],
  },
  {
    key: 'cheerio-crown', emoji: '👑', name: 'Cheerio crown cake', kind: 'no-bake', oven: false, quick: true, sugar: 'low',
    about: 'A crown of plain Cheerios around a pellet cake. Birthday king!', time: '20 min', serves: '1 horse',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: 'A small handful of plain Cheerios (no honey or chocolate kinds)', food: 'Plain Cheerios / oat cereal' },
      { text: '3 carrot stick candles', food: 'Carrots' },
    ],
    steps: [SOAK_PELLETS, 'Press into a round on a plate.', 'Press Cheerios all around the top edge like a crown.', 'Add carrot candles.'],
  },
  {
    key: 'popcorn-party', emoji: '🍿', name: 'Popcorn party cake', kind: 'no-bake', oven: false, quick: true, sugar: 'low',
    about: 'Light, crunchy and low in sugar. Plain popcorn only.', time: '15 min', serves: '1 horse',
    ingredients: [
      { text: '2 cups chaff (chopped hay)', food: 'Chaff (chopped hay)' },
      { text: '1 cup timothy pellets, soaked', food: PELLETS },
      { text: 'A small handful of plain air-popped popcorn (no salt, butter or sugar)', food: 'Plain popcorn' },
      { text: '1 carrot candle', food: 'Carrots' },
    ],
    steps: ['Mix the chaff into the soaked pellets so it holds together.', 'Pack into a bowl and turn out onto a plate.', 'Pick out any hard, unpopped kernels, then sprinkle the popcorn on top.', 'Add the candle.'],
  },
  {
    key: 'sunflower', emoji: '🌻', name: 'Sunflower cake', kind: 'no-bake', oven: false, quick: true, sugar: 'low',
    about: 'Decorated like a big sunflower.', time: '20 min', serves: '1 horse',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: '1 tablespoon black oil sunflower seeds', food: 'Sunflower seeds (black oil)' },
      { text: '2 carrots, cut in long thin “petals”', food: 'Carrots' },
    ],
    steps: [SOAK_PELLETS, 'Press into a flat round on a plate.', 'Make a circle of sunflower seeds in the middle.', 'Lay carrot petals all around it.'],
  },
  {
    key: 'meadow', emoji: '🌼', name: 'Spring meadow cake', kind: 'no-bake', oven: false, quick: true, sugar: 'low',
    about: 'Hay and flowers he’d find in a field. Perfect for a May birthday.', time: '15 min', serves: '1 horse',
    ingredients: [
      { text: '2 cups chaff (chopped hay)', food: 'Chaff (chopped hay)' },
      { text: '1 cup timothy pellets, soaked', food: PELLETS },
      { text: 'Dandelion leaves and flowers from a field that isn’t sprayed', food: 'Dandelions' },
      { text: 'A few clover flowers (optional)', food: 'Clover' },
    ],
    steps: ['Mix the chaff into the soaked pellets.', 'Pack into a bowl and turn out onto a plate.', 'Cover with dandelion leaves and stick the flowers all over.'],
    tip: 'Only pick from places with no weed killer or road spray, and never near unknown plants.',
  },
  {
    key: 'sweet-corn', emoji: '🌽', name: 'Sweet corn & carrot cake', kind: 'no-bake', oven: false, quick: true, sugar: 'medium',
    about: 'Yellow and orange: a sunny, simple cake.', time: '20 min', serves: '1 horse',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: 'A small handful of sweet corn kernels (off the cob)', food: 'Sweet corn' },
      { text: '1 carrot, grated', food: 'Carrots' },
    ],
    steps: [SOAK_PELLETS, 'Mix in the grated carrot and press into a bowl.', UNMOULD, 'Scatter the corn kernels on top.'],
    tip: 'Kernels only: never give a whole cob.',
  },
  {
    key: 'melon-tower', emoji: '🍈', name: 'Melon tower', kind: 'no-bake', oven: false, quick: true, sugar: 'higher',
    about: 'Stacked rounds of melon: juicy and refreshing.', time: '15 min', serves: '1 horse, a few pieces',
    ingredients: [
      { text: '1 round slice of cantaloupe, seeds and rind removed', food: 'Cantaloupe / melon' },
      { text: '1 round slice of honeydew, seeds and rind removed', food: 'Honeydew melon' },
      { text: 'A few blueberries on top', food: 'Blueberries' },
    ],
    steps: ['Cut thick round slices from the middle of each melon and remove the seeds and rind.', 'Stack them on a plate, honeydew on top.', 'Put blueberries in the hole in the middle.', 'Cut into wedges to feed.'],
  },
  {
    key: 'bran-mash', emoji: '🥣', name: 'Warm birthday mash', kind: 'no-bake', oven: false, sugar: 'low',
    about: 'A warm, cosy “cake in a bowl” for a chilly day.', time: '10 min + soaking', serves: '1 horse',
    ingredients: [
      { text: '1 cup dry beet pulp, soaked for 2+ hours', food: 'Beet pulp (soaked)' },
      { text: '½ cup wheat bran', food: 'Wheat bran' },
      { text: '1 carrot, grated', food: 'Carrots' },
      { text: '1 apple, grated (core removed)', food: 'Apples' },
      { text: 'Warm water' },
    ],
    steps: ['Stir the bran into the soaked beet pulp with warm (not hot) water until it’s like porridge.', 'Mix in the carrot and apple.', 'Test it with your hand: it should feel warm, never hot.', 'Serve in his feed pan with a carrot candle.'],
    tip: 'Bran mash is a once-in-a-while treat. Ask the vet or barn if he can have it.',
  },
  {
    key: 'senior-soft', emoji: '🦷', name: 'Extra-soft cake', kind: 'no-bake', oven: false, sugar: 'medium',
    about: 'For older horses or anyone with sore teeth: everything is mushy.', time: '10 min + 20 min soaking', serves: '1 horse',
    ingredients: [
      { text: 'One meal of his own feed, soaked to a mush', food: 'Horse feed (pellets / sweet feed)' },
      { text: '¼ cup unsweetened applesauce', food: SAUCE },
      { text: '1 carrot, finely grated', food: 'Carrots' },
      { text: '½ banana, mashed', food: 'Bananas' },
    ],
    steps: ['Soak his normal feed in warm water until it is a soft mush.', 'Stir in the applesauce and grated carrot.', 'Shape into a mound on his pan and top with the mashed banana.'],
    tip: 'Use only his normal amount of feed. This replaces a meal; it isn’t extra.',
  },
  {
    key: 'chamomile-calm', emoji: '🌙', name: 'Calm & cosy chamomile cake', kind: 'no-bake', oven: false, sugar: 'low',
    about: 'A gentle cake for after a busy party day.', time: '20 min + soaking', serves: '1 horse',
    ingredients: [
      { text: '2 cups timothy pellets', food: PELLETS },
      { text: 'A pinch of dried chamomile flowers', food: 'Chamomile' },
      { text: '½ cup rolled oats', food: OAT },
      { text: '1 apple, grated (core removed)', food: 'Apples' },
    ],
    steps: [SOAK_PELLETS, 'Mix in the oats, apple and chamomile.', 'Press into a bowl and turn out onto a plate.', 'Sprinkle a few more chamomile flowers on top.'],
  },
  // ---------- frozen ----------
  {
    key: 'carrot-pops', emoji: '🍦', name: 'Carrot & apple ice pops', kind: 'frozen', oven: false, sugar: 'medium',
    about: 'Muffin-tin ice treats for a hot day.', time: '10 min + freezing overnight', serves: '12 pops (2–3 for EJ)',
    ingredients: [
      { text: '1 carrot, grated', food: 'Carrots' },
      { text: '1 apple, finely chopped (core removed)', food: 'Apples' },
      { text: 'A few mint leaves', food: 'Mint leaves' },
      { text: 'Water' },
    ],
    steps: ['Divide the carrot, apple and mint between the cups of a muffin tin.', 'Top up with water and freeze overnight.', 'Dip the tin in warm water to pop them out.', 'Serve in his feed pan.'],
  },
  {
    key: 'cucumber-cooler', emoji: '🥒', name: 'Cucumber cooler ice cake', kind: 'frozen', oven: false, sugar: 'low',
    about: 'A low-sugar frozen cake for hot weather.', time: '10 min + freezing overnight', serves: '1 horse, over an afternoon',
    ingredients: [
      { text: '1 cucumber, sliced', food: 'Cucumber' },
      { text: '2 celery sticks, cut small', food: 'Celery' },
      { text: 'A handful of mint leaves', food: 'Mint leaves' },
      { text: '3 strawberries for colour', food: 'Strawberries' },
      { text: 'Water' },
    ],
    steps: ['Put everything in a round cake tin or bowl.', 'Cover with water and freeze overnight.', 'Dip the tin in warm water to release it.', 'Serve in a pan in the shade.'],
  },
  {
    key: 'berry-ice-cups', emoji: '🧊', name: 'Berry ice cupcakes', kind: 'frozen', oven: false, sugar: 'medium',
    about: 'Little frozen cups with berries inside.', time: '10 min + freezing', serves: '12 cups (2–3 for EJ)',
    ingredients: [
      { text: '½ cup unsweetened applesauce', food: SAUCE },
      { text: 'A small handful of blueberries', food: 'Blueberries' },
      { text: 'A small handful of raspberries', food: 'Raspberries' },
      { text: 'Water' },
    ],
    steps: ['Stir the applesauce into 2 cups of water.', 'Put a few berries in each muffin cup and pour the mix over.', 'Freeze, then pop out by dipping the tin in warm water.'],
  },
  {
    key: 'ice-block', emoji: '🪣', name: 'Giant birthday ice block', kind: 'frozen', oven: false, sugar: 'medium',
    about: 'A bucket-sized ice block with treats frozen in layers: keeps him busy for ages.', time: '15 min + 2 days freezing', serves: '1 horse, over an afternoon',
    ingredients: [
      { text: '3 carrots, cut lengthwise into sticks', food: 'Carrots' },
      { text: '2 apples, sliced (cores removed)', food: 'Apples' },
      { text: '3 celery sticks, cut small', food: 'Celery' },
      { text: 'A handful of mint leaves', food: 'Mint leaves' },
      { text: 'Water' },
    ],
    steps: ['Put a third of the treats in a clean bucket, cover with water and freeze.', 'Add the next third and more water; freeze again. Repeat once more.', 'Run warm water over the outside of the bucket to slide the block out.', 'Put it in his paddock or a big tub and let him lick his way to the treats.'],
    tip: 'Layering stops all the treats floating to the top.',
  },
  {
    key: 'watermelon-ice', emoji: '🍉', name: 'Frozen watermelon cake', kind: 'frozen', oven: false, sugar: 'higher',
    about: 'Watermelon chunks frozen into a ring: sweet, so keep it small.', time: '10 min + freezing overnight', serves: '1 horse, a few pieces',
    ingredients: [
      { text: '2 cups seedless watermelon chunks', food: 'Watermelon' },
      { text: 'A few strawberries', food: 'Strawberries' },
      { text: 'A few mint leaves', food: 'Mint leaves' },
      { text: 'Water' },
    ],
    steps: ['Put the watermelon, strawberries and mint in a small bundt pan.', 'Top up with water and freeze overnight.', 'Dip in warm water to release and serve in a pan.'],
  },
]

export const CAKES: Cake[] = [...FIRST_CAKES, ...MORE_CAKES]

export const SUGAR_LABEL: Record<Cake['sugar'], string> = { low: '🟢 Low sugar', medium: '🟡 Some sugar', higher: '🟠 Sweet' }
