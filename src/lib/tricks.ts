/**
 * Tricks to teach EJ with positive reinforcement (a click or "yes!" + a small treat).
 * Keep sessions short (5–10 minutes), stop on a good try, and ask Rachel before the harder ones.
 */
export type Trick = {
  key: string
  name: string
  emoji: string
  level: 'easy' | 'medium' | 'hard'
  what: string
  steps: string[]
  safety?: string
  /** Learn these first. */
  needs?: string[]
}

export const TRICK_BASICS = [
  'Use a "marker": a clicker or a short word like "Yes!" the moment he does it right, then a small treat.',
  'Keep treats tiny (a piece of carrot or a pellet) and in a pouch, not in your hand.',
  '5–10 minutes is plenty. End on a good try.',
  'Never treat him for nibbling or pushing you. Manners come first.',
  'Stand on the safe side of the horse and keep your feet out of the way.',
]

const yt = (q: string) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`teach horse ${q} trick positive reinforcement`)

export const TRICKS: (Trick & { video: string })[] = [
  {
    key: 'manners',
    name: 'Treat manners (“face away”)',
    emoji: '🙇',
    level: 'easy',
    what: 'EJ learns to turn his head away and wait politely instead of mugging you for treats. Start here!',
    steps: [
      'Stand at his shoulder with a treat in your pouch, hands still.',
      'Wait. The moment he turns his head away from you, say "Yes!"',
      'Give the treat with a flat hand, away from your body, where his head is.',
      'Repeat until he turns away on his own whenever you stand there.',
      'Never reward pushing or nibbling: just wait it out.',
    ],
    safety: 'Do this one before any other trick so treats don’t make him pushy.',
    video: yt('treat manners face away'),
  },
  {
    key: 'target',
    name: 'Target (touch the cone)',
    emoji: '🎯',
    level: 'easy',
    what: 'He touches his nose to a target (a cone, a ball on a stick or a plastic lid). It’s the base for many other tricks.',
    steps: [
      'Hold the target a little in front of his nose.',
      'When he sniffs or touches it, say "Yes!" and treat.',
      'Move the target a bit to each side, then lower and higher.',
      'Add a word like "Touch" just before he touches it.',
      'Later, put the target on the ground or a fence and send him to it.',
    ],
    needs: ['manners'],
    video: yt('target training'),
  },
  {
    key: 'head-down',
    name: 'Head down',
    emoji: '⬇️',
    level: 'easy',
    what: 'He lowers his head on cue. Great for bridling, calming him and putting on fly masks.',
    steps: [
      'Put very light pressure on the lead rope straight down (or hold the target low).',
      'The moment his head drops even a little, release and say "Yes!"',
      'Ask for a little lower each time.',
      'Add a word: "Head down".',
    ],
    needs: ['manners'],
    video: yt('head down'),
  },
  {
    key: 'back-up',
    name: 'Back up',
    emoji: '↩️',
    level: 'easy',
    what: 'He steps backwards from a hand signal or word. Useful for space and respect on the ground.',
    steps: [
      'Face him, standing in front and to the side (never straight in front).',
      'Lift your hand, palm toward his chest, and say "Back".',
      'If needed, wiggle the lead rope gently.',
      'Reward one step back, then two, then more.',
    ],
    needs: ['manners'],
    video: yt('back up'),
  },
  {
    key: 'feet',
    name: 'Pick up feet on cue',
    emoji: '🦶',
    level: 'easy',
    what: 'He lifts each hoof when you touch the leg and say "Foot". The farrier will love you.',
    steps: [
      'Run your hand down his leg and squeeze gently above the fetlock.',
      'Say "Foot". The second he shifts weight or lifts it, "Yes!" and treat.',
      'Hold the foot a second longer each time before putting it down gently.',
      'Practise all four feet, always in the same order.',
    ],
    safety: 'Stand beside the leg, facing his tail, never behind the back legs.',
    video: yt('pick up feet'),
  },
  {
    key: 'ground-tie',
    name: 'Ground tie (stand and stay)',
    emoji: '🧍',
    level: 'medium',
    what: 'He stays standing still when you drop the rope and step away.',
    steps: [
      'Ask him to stand, drop the lead rope on the ground and say "Stand".',
      'Step back one step, then come back and reward.',
      'Slowly add more steps and more seconds.',
      'If he moves, calmly put him back in the same spot and make it easier.',
    ],
    needs: ['manners', 'head-down'],
    safety: 'Practise in a safe enclosed area only.',
    video: yt('ground tie'),
  },
  {
    key: 'kiss',
    name: 'Kiss',
    emoji: '😘',
    level: 'easy',
    what: 'He gently touches his nose to Sofía’s cheek. A favourite for photos!',
    steps: [
      'Teach target first.',
      'Hold the target next to your cheek.',
      'When he touches it, "Yes!" and treat.',
      'Make the target smaller over time, then just point to your cheek and say "Kiss".',
    ],
    needs: ['target'],
    safety: 'Only once he’s gentle and polite with treats. Stop if he gets mouthy.',
    video: yt('kiss'),
  },
  {
    key: 'smile',
    name: 'Smile',
    emoji: '😁',
    level: 'medium',
    what: 'He curls his top lip up (the “horse laugh”) on cue.',
    steps: [
      'Gently tickle his top lip with your fingers or a soft brush.',
      'The moment the lip moves up, "Yes!" and treat.',
      'Wait for a bigger curl before rewarding.',
      'Add a word ("Smile!") and a small hand signal, then fade the tickle.',
    ],
    needs: ['manners'],
    video: yt('smile'),
  },
  {
    key: 'yes',
    name: 'Nod “yes”',
    emoji: '👍',
    level: 'medium',
    what: 'He nods his head up and down when you ask a question.',
    steps: [
      'Touch his chest lightly with a finger (or the target low, then high).',
      'When his head goes down and up, "Yes!" and treat.',
      'Add a cue: a small up-and-down hand movement.',
      'Ask “EJ, do you want a carrot?” and give the cue.',
    ],
    needs: ['target'],
    video: yt('nod yes'),
  },
  {
    key: 'no',
    name: 'Shake “no”',
    emoji: '🙅',
    level: 'medium',
    what: 'He shakes his head side to side.',
    steps: [
      'Lightly touch the side of his neck (some people use a feather).',
      'The second his head moves sideways, "Yes!" and treat.',
      'Wait for a clear side-to-side before rewarding.',
      'Add a cue (a side-to-side finger wag) and fade the touch.',
    ],
    needs: ['target'],
    video: yt('shake head no'),
  },
  {
    key: 'hug',
    name: 'Hug',
    emoji: '🤗',
    level: 'medium',
    what: 'He wraps his head and neck around Sofía.',
    steps: [
      'Stand at his shoulder facing forward.',
      'Hold the target (or a treat) behind your back on the far side so he has to bend his neck around you.',
      'Reward as soon as his neck curves around you.',
      'Hold the position a second longer each time and add "Hug".',
    ],
    needs: ['target', 'kiss'],
    safety: 'Only with a calm horse. Sofía stands at the shoulder, not in front.',
    video: yt('hug'),
  },
  {
    key: 'follow',
    name: 'Follow me (at liberty)',
    emoji: '🚶',
    level: 'medium',
    what: 'He walks, stops and turns with you without a lead rope.',
    steps: [
      'Start with the rope on but loose. Walk, stop, turn, and reward him for staying at your shoulder.',
      'Drape the rope over his neck in a small arena.',
      'Reward often for staying with you.',
      'Take the rope off only in a safe, fenced arena.',
    ],
    needs: ['manners', 'back-up'],
    safety: 'Enclosed arena only, and ask Rachel first.',
    video: yt('liberty follow me'),
  },
  {
    key: 'pedestal',
    name: 'Pedestal (front feet up)',
    emoji: '🏆',
    level: 'medium',
    what: 'He puts both front feet on a low, sturdy platform and stands proudly.',
    steps: [
      'Use a very sturdy, non-slip, low platform made for horses.',
      'Let him sniff it; reward curiosity.',
      'Reward one hoof on it, then two.',
      'Teach him to step off calmly forwards or backwards.',
    ],
    needs: ['target', 'feet'],
    safety: 'Only with a horse-safe pedestal and an adult or Rachel there.',
    video: yt('pedestal'),
  },
  {
    key: 'fetch',
    name: 'Fetch',
    emoji: '🧸',
    level: 'medium',
    what: 'He picks up a soft toy or rag and gives it to you.',
    steps: [
      'Use a soft toy or a rag with a handle that’s safe to bite.',
      'Reward him for touching it, then for holding it in his mouth.',
      'Hold your hand under it and reward when he drops it into your hand.',
      'Put it on the ground and add "Fetch".',
    ],
    needs: ['target'],
    video: yt('fetch'),
  },
  {
    key: 'bow',
    name: 'Bow',
    emoji: '🙇‍♀️',
    level: 'hard',
    what: 'He stretches one front leg forward and lowers his chest, like a curtsy.',
    steps: [
      'Teach "pick up feet" first.',
      'Use a treat to bring his head down between his front legs while one leg is forward.',
      'Reward the tiniest lowering.',
      'Build up slowly over many short sessions.',
    ],
    needs: ['feet', 'head-down'],
    safety: 'Hard on joints if forced. Only with Rachel’s OK and on soft footing.',
    video: yt('bow'),
  },
  {
    key: 'spanish-walk',
    name: 'Spanish walk',
    emoji: '💃',
    level: 'hard',
    what: 'He lifts each front leg high and forward as he walks, a fancy show trick.',
    steps: [
      'Teach him to lift a front leg when you touch it with a whip or stick (gently).',
      'Reward a higher lift each time.',
      'Alternate legs, then add walking steps.',
    ],
    needs: ['feet', 'back-up'],
    safety: 'Advanced: it can teach striking if done wrong. Only with a trainer.',
    video: yt('spanish walk'),
  },
]

export const LEVEL_ICON = { easy: '🟢', medium: '🟡', hard: '🔴' }
