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
  /** Only suggested once these are covered (on the list, bought, or 'have it'). */
  after?: string[]
}

const WINTER = [10, 11, 12, 1, 2, 3]
const FLY_SEASON = [3, 4, 5, 6, 7, 8, 9, 10]
const SPRING = [2, 3, 4, 5]
const SUMMER = [5, 6, 7, 8, 9]

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

  // ---- More grooming ----
  { key: 'face-brush', name: 'Small face brush', category: 'Grooming', why: 'Extra soft for around the eyes and muzzle.', match: ['face brush'], after: ['body-brush'] },
  { key: 'hoof-oil', name: 'Hoof conditioner / oil', category: 'Grooming', why: 'Keeps his bare hooves from drying and cracking.', match: ['hoof oil', 'hoof conditioner', 'hoof dressing'] },
  { key: 'shedding-blade', name: 'Shedding blade', category: 'Grooming', why: 'Pulls out his winter coat in spring.', match: ['shedding blade', 'shedding'], months: SPRING },
  { key: 'towels', name: 'Grooming towels / rags', category: 'Grooming', why: 'Wipe dust, dry legs, polish the coat.', match: ['towel', 'rag'] },
  { key: 'braid-thread', name: 'Braiding thread & needle', category: 'Grooming', why: 'For hunter and button braids that stay put.', match: ['braiding thread', 'yarn', 'braiding needle'], after: ['braiding-bands'] },
  { key: 'seam-ripper', name: 'Seam ripper', category: 'Grooming', why: 'Takes braids out quickly without cutting the mane.', match: ['seam ripper'], after: ['braid-thread'] },
  { key: 'braid-spray', name: 'Braiding spray / gel', category: 'Grooming', why: 'Tames flyaways so braids look neat.', match: ['braiding spray', 'quic braid', 'mane gel'], after: ['braiding-bands'] },
  { key: 'clipper-oil', name: 'Clipper oil & blade wash', category: 'Grooming', why: 'Keeps the clipper blades cool and sharp.', match: ['clipper oil', 'blade wash', 'kool lube'], after: ['clippers'] },
  { key: 'stain-remover', name: 'Waterless stain remover', category: 'Grooming', why: 'Quick fix for green/yellow stains on a gray horse.', match: ['stain remover', 'waterless shampoo', 'spot remover'], after: ['whitening-shampoo'] },

  // ---- More health ----
  { key: 'stethoscope', name: 'Stethoscope', category: 'Health & first aid', why: 'Check heart rate and gut sounds when he seems off.', match: ['stethoscope'], after: ['thermometer'] },
  { key: 'epsom', name: 'Epsom salt (for soaks)', category: 'Health & first aid', why: 'For hoof soaks if the vet or farrier asks.', match: ['epsom'], after: ['first-aid'] },
  { key: 'poultice', name: 'Poultice / hoof packing', category: 'Health & first aid', why: 'Draws out heat after hard work or for an abscess.', match: ['poultice', 'hoof packing'], after: ['first-aid'] },
  { key: 'hoof-boot', name: 'Emergency hoof boot', category: 'Health & first aid', why: 'Protects a sore or injured hoof until the farrier comes.', match: ['hoof boot', 'soaking boot'] },
  { key: 'electrolytes', name: 'Electrolytes', category: 'Health & first aid', why: 'Helps him drink and recover on hot days (ask the vet).', match: ['electrolyte'], months: SUMMER },
  { key: 'fly-sheet', name: 'Fly sheet', category: 'Health & first aid', why: 'Light sheet that keeps flies off his body.', match: ['fly sheet'], months: FLY_SEASON, after: ['fly-mask'] },
  { key: 'fly-boots', name: 'Fly boots', category: 'Health & first aid', why: 'Stops stamping at flies, which is hard on the hooves.', match: ['fly boot'], months: FLY_SEASON, after: ['fly-spray'] },

  // ---- More tack ----
  { key: 'breakaway-halter', name: 'Breakaway halter (for turnout)', category: 'Tack', why: 'Breaks if it catches on something, so he can’t get hurt.', match: ['breakaway'], after: ['halter'] },
  { key: 'half-pad', name: 'Half pad (gel or fleece)', category: 'Tack', why: 'Extra comfort and better saddle fit.', match: ['half pad', 'gel pad', 'shim'], after: ['saddle-pad'] },
  { key: 'bell-boots', name: 'Bell boots', category: 'Tack', why: 'Protect his front heels when jumping or turning out.', match: ['bell boot', 'overreach'], after: ['boots'] },
  { key: 'safety-stirrups', name: 'Safety stirrups', category: 'Tack', why: 'Release the foot in a fall; great for young riders.', match: ['safety stirrup', 'peacock', 'breakaway stirrup'] },
  { key: 'stirrup-leathers', name: 'Stirrup leathers', category: 'Tack', why: 'Check the length with Rachel; a spare pair is handy.', match: ['stirrup leather'], after: ['girth'] },
  { key: 'breastplate', name: 'Breastplate / martingale', category: 'Tack', why: 'Keeps the saddle in place when jumping (ask Rachel).', match: ['breastplate', 'martingale', 'breastcollar'], after: ['bridle'] },
  { key: 'saddle-cover', name: 'Saddle cover', category: 'Tack', why: 'Keeps dust off between rides.', match: ['saddle cover'], after: ['tack-cleaner'] },
  { key: 'neck-rug', name: 'Neck cover for the rug', category: 'Tack', why: 'Extra warmth on very cold, wet days.', match: ['neck cover', 'neck rug', 'hood'], months: WINTER, after: ['winter-rug'] },
  { key: 'rain-sheet', name: 'Rain sheet', category: 'Tack', why: 'Waterproof without the heat of a full blanket.', match: ['rain sheet', 'turnout sheet'], months: WINTER, after: ['winter-rug'] },

  // ---- More feed ----
  { key: 'treat-pouch', name: 'Treat pouch', category: 'Feed & treats', why: 'Clips to Sofía’s belt for rewards during training.', match: ['treat pouch', 'treat bag'], after: ['treats'] },
  { key: 'feed-scoop', name: 'Feed scoop', category: 'Feed & treats', why: 'Measures feed the same every time.', match: ['scoop'], after: ['feed-bucket'] },
  { key: 'supplement', name: 'Hoof or joint supplement (ask the vet)', category: 'Feed & treats', why: 'Only if Dr. Novick recommends one.', match: ['supplement', 'biotin', 'joint'], after: ['salt-lick'] },

  // ---- More barn ----
  { key: 'water-bucket', name: 'Water bucket', category: 'Barn & stable', why: 'A spare for hot days or travel.', match: ['water bucket'] },
  { key: 'bucket-heater', name: 'Bucket heater', category: 'Barn & stable', why: 'Keeps water from freezing so he keeps drinking.', match: ['bucket heater', 'heated bucket'], months: WINTER, after: ['water-bucket'] },
  { key: 'tack-trunk', name: 'Tack trunk / storage box', category: 'Barn & stable', why: 'Keeps everything together at the barn.', match: ['tack trunk', 'trunk', 'storage box'] },
  { key: 'saddle-rack', name: 'Saddle rack', category: 'Barn & stable', why: 'Keeps the saddle in shape.', match: ['saddle rack', 'saddle stand'], after: ['tack-trunk'] },
  { key: 'bridle-hook', name: 'Bridle hook', category: 'Barn & stable', why: 'Hangs the bridle so the leather doesn’t crack.', match: ['bridle hook', 'bridle rack'], after: ['bridle'] },
  { key: 'stall-plate', name: 'Stall name plate', category: 'Barn & stable', why: 'EJ’s name on his stall.', match: ['name plate', 'nameplate', 'stall sign'] },

  // ---- More rider gear ----
  { key: 'helmet-bag', name: 'Helmet bag', category: 'Rider gear', why: 'Protects the helmet in the car and at the barn.', match: ['helmet bag'], after: ['helmet'] },
  { key: 'breeches', name: 'Riding tights / breeches', category: 'Rider gear', why: 'No seams to rub; better grip in the saddle.', match: ['breeches', 'riding tights', 'jodhpurs'] },
  { key: 'crop', name: 'Riding crop', category: 'Rider gear', why: 'Only if Rachel says Sofía is ready for one.', match: ['crop', 'whip'], after: ['gloves'] },
  { key: 'winter-gloves', name: 'Winter riding gloves', category: 'Rider gear', why: 'Warm hands that can still feel the reins.', match: ['winter glove', 'insulated glove'], months: WINTER, after: ['gloves'] },
  { key: 'barn-jacket', name: 'Barn jacket', category: 'Rider gear', why: 'Warm and okay to get dirty.', match: ['barn jacket', 'barn coat'], months: WINTER },

  // ---- Shows & competition (new) ----
  { key: 'show-shirt', name: 'Show shirt', category: 'Shows & competition', why: 'Collared shirt for shows.', match: ['show shirt'], essential: true },
  { key: 'show-jacket', name: 'Show jacket', category: 'Shows & competition', why: 'Needed for most rated classes.', match: ['show jacket', 'show coat', 'hunt coat'], after: ['show-shirt'] },
  { key: 'hair-net', name: 'Hair nets', category: 'Shows & competition', why: 'Keeps Sofía’s hair neat under the helmet.', match: ['hair net', 'hairnet'] },
  { key: 'show-pad', name: 'White show saddle pad', category: 'Shows & competition', why: 'Classic look for the show ring.', match: ['show pad', 'white pad', 'fitted pad'], after: ['saddle-pad'] },
  { key: 'number-holder', name: 'Number string / holder', category: 'Shows & competition', why: 'Holds the competitor number on her back.', match: ['number holder', 'number string', 'pinny'] },
  { key: 'garment-bag', name: 'Garment bag', category: 'Shows & competition', why: 'Keeps show clothes clean until the class.', match: ['garment bag'], after: ['show-jacket'] },
  { key: 'show-sheen', name: 'Coat shine spray', category: 'Shows & competition', why: 'Makes a gray coat gleam on show day.', match: ['show sheen', 'coat shine', 'shine spray'] },

  // ---- Travel & trailer (new) ----
  { key: 'shipping-boots', name: 'Shipping boots', category: 'Travel & trailer', why: 'Protect his legs in the trailer.', match: ['shipping boot', 'travel boot'], essential: true },
  { key: 'fleece-halter', name: 'Fleece-lined halter', category: 'Travel & trailer', why: 'Comfortable for long trailer rides.', match: ['fleece halter', 'fleece lined', 'shipping halter'], after: ['halter'] },
  { key: 'trailer-haybag', name: 'Hay bag for the trailer', category: 'Travel & trailer', why: 'Keeps him calm and eating during the ride.', match: ['trailer hay', 'hay bag'], after: ['shipping-boots'] },
  { key: 'water-jug', name: 'Water jug (5 gal)', category: 'Travel & trailer', why: 'Some horses won’t drink strange water; bring his own.', match: ['water jug', 'water container', 'jerry can'] },
  { key: 'trailer-kit', name: 'Trailer first-aid kit', category: 'Travel & trailer', why: 'Small kit that lives in the trailer.', match: ['trailer first aid', 'travel first aid'], after: ['first-aid'] },
  { key: 'papers-folder', name: 'Folder for papers (Coggins, health cert)', category: 'Travel & trailer', why: 'Shows and travel often ask for them.', match: ['document holder', 'coggins', 'papers'] },

  // ---- More fun ----
  { key: 'ear-bonnet', name: 'Ear bonnet', category: 'Fun', why: 'Cute, and keeps bugs out of his ears.', match: ['ear bonnet', 'fly veil', 'ear net'] },
  { key: 'matching-set', name: 'Matching saddle pad & bonnet set', category: 'Fun', why: 'Coordinated colours for photos.', match: ['matching set', 'pad set'], after: ['ear-bonnet'] },
  { key: 'bling-browband', name: 'Bling browband', category: 'Fun', why: 'A sparkly browband for special days.', match: ['browband'], after: ['bridle'] },
  { key: 'costume', name: 'Horse costume', category: 'Fun', why: 'For the Halloween show.', match: ['costume'], months: [9, 10] },
  { key: 'holiday-bands', name: 'Holiday-colour braiding bands', category: 'Fun', why: 'For the Christmas and Valentine looks in Beautify.', match: ['holiday band', 'colored bands', 'coloured bands'], after: ['braiding-bands'] },

  // ==== Added: more for existing categories ====
  // Grooming
  { key: 'mane-pulling-comb', name: 'Mane pulling comb', category: 'Grooming', why: 'Thins and shortens the mane for hunter braids.', match: ['pulling comb', 'thinning comb'], after: ['mane-comb'] },
  { key: 'tail-bag', name: 'Tail bag', category: 'Grooming', why: 'Keeps EJ’s long white tail clean between shows.', match: ['tail bag', 'tail wrap'], after: ['whitening-shampoo'] },
  { key: 'grooming-mitt', name: 'Grooming mitt', category: 'Grooming', why: 'Easy for Sofía; great for a quick polish.', match: ['grooming mitt', 'grooming glove'] },
  { key: 'hoof-pick-brush', name: 'Hoof pick with brush', category: 'Grooming', why: 'Spare for the car or trailer.', match: ['hoof pick brush', 'hoof pick with brush'], after: ['hoof-pick'] },
  // Health
  { key: 'ice-boots', name: 'Ice boots / cold wraps', category: 'Health & first aid', why: 'Cool his legs after a hard ride or a knock.', match: ['ice boot', 'cold wrap', 'ice wrap'], after: ['first-aid'] },
  { key: 'standing-wraps', name: 'Standing wraps & pillow pads', category: 'Health & first aid', why: 'Support and protect legs; the vet may ask for them.', match: ['standing wrap', 'pillow wrap', 'no bow'], after: ['vet-wrap'] },
  { key: 'syringe', name: 'Oral dosing syringes', category: 'Health & first aid', why: 'For giving medicine by mouth if the vet prescribes it.', match: ['dosing syringe', 'oral syringe'], after: ['thermometer'] },
  { key: 'sunscreen', name: 'Horse-safe sunscreen', category: 'Health & first aid', why: 'Gray horses can have pink skin on the muzzle that burns.', match: ['sunscreen', 'sun block', 'zinc'], months: SUMMER },
  // Tack
  { key: 'spare-reins', name: 'Spare reins', category: 'Tack', why: 'Reins wear out; a spare pair saves a lesson.', match: ['reins'], after: ['bridle'] },
  { key: 'grazing-muzzle', name: 'Grazing muzzle (if needed)', category: 'Tack', why: 'Only if the vet says he needs to slow down on grass.', match: ['grazing muzzle'], after: ['breakaway-halter'] },
  { key: 'quarter-sheet', name: 'Quarter sheet', category: 'Tack', why: 'Keeps his back warm while warming up in winter.', match: ['quarter sheet', 'exercise sheet'], months: WINTER, after: ['cooler'] },
  // Feed & treats
  { key: 'lick-treat', name: 'Treat lick / boredom buster', category: 'Feed & treats', why: 'A long-lasting treat for stall time.', match: ['likit', 'lick treat'], after: ['salt-lick'] },
  { key: 'homemade-treats', name: 'Horse treat mold / mix', category: 'Feed & treats', why: 'Fun to make treats with Sofía (follow Nutrition limits).', match: ['treat mold', 'treat mix'], after: ['treats'] },
  { key: 'feed-tubs', name: 'Feed storage bin', category: 'Feed & treats', why: 'Keeps treats and feed dry and mouse-free.', match: ['storage bin', 'feed bin', 'feed storage'], after: ['feed-scoop'] },
  // Barn & stable
  { key: 'muck-fork', name: 'Muck fork (if you clean his stall)', category: 'Barn & stable', why: 'Ask the barn if owners muck out.', match: ['muck fork', 'manure fork', 'pitchfork'] },
  { key: 'blanket-rack', name: 'Blanket rack / bar', category: 'Barn & stable', why: 'Dries and stores rugs off the floor.', match: ['blanket rack', 'blanket bar'], after: ['winter-rug'] },
  { key: 'hose-nozzle', name: 'Hose spray nozzle', category: 'Barn & stable', why: 'Gentle spray for baths and cooling his legs.', match: ['spray nozzle', 'hose nozzle'] },
  { key: 'step-stool', name: 'Mounting block / step stool', category: 'Barn & stable', why: 'Helps Sofía reach for braiding and mounting.', match: ['mounting block', 'step stool'] },
  // Rider gear
  { key: 'riding-socks', name: 'Tall riding socks', category: 'Rider gear', why: 'Stop boots from rubbing.', match: ['riding sock', 'boot sock'], after: ['riding-boots'] },
  { key: 'belt', name: 'Riding belt', category: 'Rider gear', why: 'Needed for shows and keeps the shirt tucked.', match: ['belt'], after: ['breeches'] },
  { key: 'sun-visor', name: 'Helmet sun visor / cover', category: 'Rider gear', why: 'Shade on sunny days at the barn.', match: ['helmet visor', 'helmet cover'], months: SUMMER, after: ['helmet'] },
  { key: 'boot-bag', name: 'Boot bag', category: 'Rider gear', why: 'Keeps muddy boots out of the car.', match: ['boot bag'], after: ['riding-boots'] },
  // Shows
  { key: 'stock-tie', name: 'Show bow / stock tie', category: 'Shows & competition', why: 'Some classes need a stock tie or collar bow.', match: ['stock tie', 'show bow', 'collar'], after: ['show-shirt'] },
  { key: 'show-gloves', name: 'Black show gloves', category: 'Shows & competition', why: 'Classic look for the ring.', match: ['show glove', 'black glove'], after: ['gloves'] },
  { key: 'hoof-black', name: 'Hoof polish (clear or black)', category: 'Shows & competition', why: 'Finishing touch on show day.', match: ['hoof black', 'hoof polish'] },
  { key: 'show-checklist', name: 'Show-day bucket kit', category: 'Shows & competition', why: 'A bucket with rags, spray, comb and bands, ready to go.', match: ['show kit', 'ringside kit'], after: ['grooming-tote'] },
  // Travel
  { key: 'tail-guard', name: 'Tail guard', category: 'Travel & trailer', why: 'Protects his tail from rubbing in the trailer.', match: ['tail guard'], after: ['shipping-boots'] },
  { key: 'poll-guard', name: 'Head bumper / poll guard', category: 'Travel & trailer', why: 'Protects his head in the trailer.', match: ['head bumper', 'poll guard'], after: ['fleece-halter'] },
  { key: 'travel-bucket', name: 'Collapsible water bucket', category: 'Travel & trailer', why: 'Folds flat in the car; water anywhere.', match: ['collapsible bucket', 'folding bucket'], after: ['water-jug'] },

  // ==== New category: Training & groundwork ====
  { key: 'lunge-line', name: 'Lunge line', category: 'Training & groundwork', why: 'Warm-ups and lunge lessons on the circle.', match: ['lunge line', 'longe line'], essential: true },
  { key: 'lunge-whip', name: 'Lunge whip', category: 'Training & groundwork', why: 'Used as a guide, not to hit (ask Rachel how).', match: ['lunge whip', 'longe whip'], after: ['lunge-line'] },
  { key: 'rope-halter', name: 'Rope halter & 12 ft lead', category: 'Training & groundwork', why: 'For groundwork and leading practice.', match: ['rope halter'] },
  { key: 'cones', name: 'Training cones', category: 'Training & groundwork', why: 'Mark circles and patterns for practice.', match: ['cone'] },
  { key: 'poles', name: 'Ground poles or cavaletti blocks', category: 'Training & groundwork', why: 'Practise the pole skills in Skills at home or the barn.', match: ['ground pole', 'cavaletti', 'jump block'], after: ['cones'] },
  { key: 'desensitize', name: 'Tarp & flag for desensitizing', category: 'Training & groundwork', why: 'Calmly help him with scary things (see What scares EJ).', match: ['tarp', 'training flag', 'flag'], after: ['rope-halter'] },
  { key: 'clicker', name: 'Clicker (for clicker training)', category: 'Training & groundwork', why: 'A fun way for Sofía to teach tricks with treats.', match: ['clicker'], after: ['treat-pouch'] },
  { key: 'dressage-letters', name: 'Arena dressage letters', category: 'Training & groundwork', why: 'Practise test figures at the right markers.', match: ['dressage letter', 'arena letter', 'arena marker'], after: ['cones'] },

  // ==== New category: Cleaning & laundry ====
  { key: 'blanket-wash', name: 'Blanket & pad wash', category: 'Cleaning & laundry', why: 'Gentle wash that keeps waterproofing and fabric safe.', match: ['blanket wash', 'rug wash', 'pad wash'], essential: true },
  { key: 'laundry-bag', name: 'Laundry bag for saddle pads', category: 'Cleaning & laundry', why: 'Keeps horse hair out of the home washing machine.', match: ['laundry bag', 'wash bag'], after: ['saddle-pad'] },
  { key: 'leather-wipes', name: 'Leather cleaning wipes', category: 'Cleaning & laundry', why: 'Quick clean after a ride when there’s no time.', match: ['leather wipe', 'tack wipe'], after: ['tack-cleaner'] },
  { key: 'waterproofer', name: 'Blanket re-waterproofing spray', category: 'Cleaning & laundry', why: 'Keeps the winter rug waterproof each season.', match: ['waterproof', 'reproofer'], months: WINTER, after: ['winter-rug'] },
  { key: 'bit-wipes', name: 'Bit wipes / bit cleaner', category: 'Cleaning & laundry', why: 'A clean bit is nicer for his mouth.', match: ['bit wipe', 'bit cleaner'], after: ['bridle'] },
  { key: 'hair-remover', name: 'Pet hair remover brush', category: 'Cleaning & laundry', why: 'Gets gray hair off pads, jackets and car seats.', match: ['hair remover', 'lint roller', 'hair remover brush'] },

  // ==== New category: Books & learning ====
  { key: 'pony-club-manual', name: 'Pony Club manual (D level)', category: 'Books & learning', why: 'The classic guide to horse care and riding basics.', match: ['pony club', 'manual of horsemanship'], essential: true },
  { key: 'horse-care-book', name: 'Horse care book for kids', category: 'Books & learning', why: 'Grooming, feeding and health in simple words.', match: ['horse care book', 'horse book'] },
  { key: 'dressage-tests', name: 'Dressage test booklet (Intro/Training)', category: 'Books & learning', why: 'Learn the tests ridden at local shows.', match: ['dressage test', 'test booklet'], after: ['pony-club-manual'] },
  { key: 'riding-journal', name: 'Riding journal', category: 'Books & learning', why: 'A paper diary for goals and lessons (to go with Rides).', match: ['journal', 'diary', 'log book'] },
  { key: 'anatomy-poster', name: 'Horse anatomy poster', category: 'Books & learning', why: 'Learn the parts and markings, like in Photos.', match: ['anatomy', 'poster'], after: ['horse-care-book'] },

  // ==== New category: Memories & display ====
  { key: 'ribbon-display', name: 'Ribbon display / board', category: 'Memories & display', why: 'Show off Sofía’s show ribbons at home.', match: ['ribbon display', 'ribbon board', 'ribbon holder'], after: ['show-shirt'] },
  { key: 'photo-book', name: 'Photo book of EJ', category: 'Memories & display', why: 'Print favourites from the Photos section each year.', match: ['photo book', 'photobook'] },
  { key: 'hoof-keepsake', name: 'Horseshoe or hoof-print keepsake', category: 'Memories & display', why: 'A fun first-year keepsake (ask the farrier for an old shoe).', match: ['horseshoe', 'hoof print', 'keepsake'] },
  { key: 'frame', name: 'Picture frame for Sofía & EJ', category: 'Memories & display', why: 'For a favourite photo from the barn.', match: ['frame'] },
  { key: 'tail-keepsake', name: 'Tail-hair bracelet kit', category: 'Memories & display', why: 'Braid a bracelet from a few of EJ’s tail hairs.', match: ['bracelet', 'tail hair'], after: ['photo-book'] },
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

export const PER_CATEGORY = 3

/** Suggestions to show now: in season, not covered, and any "after" items already covered. */
export function availableSuggestions(items: ShopItem[], have: string[], month: number, catalog = SUGGESTIONS) {
  const state = new Map(catalog.map((s) => [s.key, suggestionState(s, items, have)]))
  const covered = (k: string) => (state.get(k) ?? 'open') !== 'open'
  const open = catalog.filter((s) => inSeason(s, month) && state.get(s.key) === 'open' && (s.after ?? []).every(covered))
  // essentials first, then the order of the list
  return open.map((s, i) => ({ s, i })).sort((a, b) => Number(!!b.s.essential) - Number(!!a.s.essential) || a.i - b.i).map((x) => x.s)
}

/** Up to PER_CATEGORY per category; when one is added or marked 'have it', the next one shows. */
export function suggestionsByCategory<C extends string>(categories: readonly C[], items: ShopItem[], have: string[], month: number) {
  const open = availableSuggestions(items, have, month)
  return categories.map((c) => {
    const all = open.filter((s) => s.category === c)
    return { category: c, shown: all.slice(0, PER_CATEGORY), waiting: Math.max(0, all.length - PER_CATEGORY) }
  })
}
