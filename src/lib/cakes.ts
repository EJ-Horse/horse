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

export const CAKES: Cake[] = [
  {
    key: 'carrot-candle',
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

export const SUGAR_LABEL: Record<Cake['sugar'], string> = { low: '🟢 Low sugar', medium: '🟡 Some sugar', higher: '🟠 Sweet' }
