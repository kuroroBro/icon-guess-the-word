// Built-in puzzle categories for Emoji Says (formerly "Icon Guess the Word").
// Each category: { id, name, language: 'tagalog'|'english', puzzles }
// Each puzzle: { icons: string[], answer: string, difficulty: 'easy'|'medium'|'hard' }
// Answers are plain A-Z + spaces only (no apostrophes/accents) to keep the
// letter-slot rendering simple. Multi-word answers render as separate
// tile groups per word (see game.js maskedAnswer + plan.md).
//
// `language` is a category-level tag, not a per-puzzle one: a game session
// commits to one language track, filtered at setup (see js/main.js). The
// English set is NOT a translation of the Tagalog set — direct translation
// would break the icon wordplay (e.g. "Kilig" has no English word with the
// same butterflies-in-your-stomach connotation) — it's an equivalent-sized,
// independently authored set of English-language icon puzzles instead.

export const CATEGORIES = [
  {
    id: 'food-and-brands',
    name: 'Food & Local Brands',
    language: 'tagalog',
    puzzles: [
      // easy
      { icons: ['🐝', '👑'], answer: 'JOLLIBEE', difficulty: 'easy' },
      { icons: ['🚗', '🚩'], answer: 'JEEPNEY', difficulty: 'easy' },
      { icons: ['🍳', '🙏'], answer: 'PANDESAL', difficulty: 'easy' },
      { icons: ['🐷', '🔥'], answer: 'LECHON', difficulty: 'easy' },
      { icons: ['🥚', '🐣'], answer: 'BALUT', difficulty: 'easy' },
      { icons: ['😇', '😇'], answer: 'HALOHALO', difficulty: 'easy' },
      { icons: ['🔴', '🎗️'], answer: 'RED RIBBON', difficulty: 'easy' },
      // medium
      { icons: ['🍲', '🍋', '🐷'], answer: 'SINIGANG', difficulty: 'medium' },
      { icons: ['🍗', '🧄'], answer: 'ADOBO', difficulty: 'medium' },
      { icons: ['🍚', '🎋'], answer: 'SUMAN', difficulty: 'medium' },
      { icons: ['🥛', '🍯'], answer: 'TAHO', difficulty: 'medium' },
      { icons: ['🍜', '👑'], answer: 'CHOWKING', difficulty: 'medium' },
      { icons: ['🧔', '🔥', '🍗'], answer: 'MANG INASAL', difficulty: 'medium' },
      // hard
      { icons: ['🟡', '🔒'], answer: 'GOLDILOCKS', difficulty: 'hard' },
      { icons: ['🥔', '↘️'], answer: 'POTATO CORNER', difficulty: 'hard' },
      { icons: ['💯', '🥇'], answer: 'PUREGOLD', difficulty: 'hard' },
      { icons: ['🌡️', '💊'], answer: 'MERCURY DRUG', difficulty: 'hard' },
      { icons: ['✏️', '🛍️'], answer: 'PENSHOPPE', difficulty: 'hard' },
    ],
  },
  {
    id: 'pinoy-slang',
    name: 'Pinoy Slang & Sayings',
    language: 'tagalog',
    puzzles: [
      // easy
      { icons: ['🍑', '🪵'], answer: 'ASTIG', difficulty: 'easy' },
      { icons: ['💬', '🗣️', '📢', '🐤'], answer: 'CHIKA', difficulty: 'easy' },
      { icons: ['💑'], answer: 'JOWA', difficulty: 'easy' },
      { icons: ['👋'], answer: 'PAALAM', difficulty: 'easy' },
      // medium
      { icons: ['🦋', '💓'], answer: 'KILIG', difficulty: 'medium' },
      { icons: ['🤏', '🥰'], answer: 'GIGIL', difficulty: 'medium' },
      { icons: ['😤', '🙊'], answer: 'TAMPO', difficulty: 'medium' },
      { icons: ['😢', '🗑️'], answer: 'SAYANG', difficulty: 'medium' },
      { icons: ['🎁', '✈️'], answer: 'PASALUBONG', difficulty: 'medium' },
      // hard
      { icons: ['🐶', '😢'], answer: 'PETMALU', difficulty: 'hard' },
      { icons: ['🔋', '1️⃣'], answer: 'CHARGE MUNA', difficulty: 'hard' },
      { icons: ['❓', '👉'], answer: 'ANO BA YAN', difficulty: 'hard' },
      { icons: ['🙏', '💳'], answer: 'UTANG NA LOOB', difficulty: 'hard' },
      { icons: ['😲', '✝️'], answer: 'SUSMARYOSEP', difficulty: 'hard' },
    ],
  },
  {
    id: 'teleseryes-celebrities',
    name: 'Teleseryes & Celebrities',
    language: 'tagalog',
    puzzles: [
      // easy
      { icons: ['⭐', '🦸‍♀️'], answer: 'DARNA', difficulty: 'easy' },
      { icons: ['🍽️', '😲'], answer: 'EAT BULAGA', difficulty: 'easy' },
      { icons: [{ src: 'images/icons/scratch-head.png' }, '📺', '⏰'], answer: 'ITS SHOWTIME', difficulty: 'easy' },
      { icons: ['😮', '🤩', '🤩', '🧥'], answer: 'WOWOWEE', difficulty: 'easy' },
      { icons: ['⏰'], answer: 'ASAP', difficulty: 'easy' },
      { icons: ['🐺'], answer: 'LOBO', difficulty: 'easy' },
      // medium
      { icons: ['🥥', '🤠', '🔫'], answer: 'ANG PROBINSYANO', difficulty: 'medium' },
      { icons: ['🌊', '🌊', '💃', '🌺'], answer: 'MARIMAR', difficulty: 'medium' },
      { icons: ['♾️'], answer: 'WALANG HANGGAN', difficulty: 'medium' },
      { icons: ['🔨', '⚒️'], answer: 'ANG PANDAY', difficulty: 'medium' },
      { icons: ['🎤', '💃', '🐴'], answer: 'VICE GANDA', difficulty: 'medium' },
      { icons: ['🧔', '🌦️'], answer: 'KUYA KIM', difficulty: 'medium' },
      { icons: ['👶', '🧒', '👧', '🎤'], answer: 'GOIN BULILIT', difficulty: 'medium' },
      { icons: ['🍬', '🫧', '👨', '👨', '👨'], answer: 'BUBBLE GANG', difficulty: 'medium' },
      // hard
      { icons: ['✨', '🏰'], answer: 'ENCANTADIA', difficulty: 'hard' },
      { icons: ['🦅', '🧑'], answer: 'MULAWIN', difficulty: 'hard' },
      { icons: ['👂', { src: 'images/icons/nail.png' }, '👉'], answer: 'PANGAKO SAYO', difficulty: 'hard' },
      { icons: ['🧠', '❓'], answer: 'MAALAALA MO KAYA', difficulty: 'hard' },
    ],
  },
  {
    id: 'historical-landmarks',
    name: 'Landmark',
    language: 'tagalog',
    puzzles: [
      // easy
      { icons: [{ src: 'images/icons/calendar-may.png' }, '🔛', '🌋'], answer: 'MAYON VOLCANO', difficulty: 'easy' },
      { icons: ['🍫', '⛰️'], answer: 'CHOCOLATE HILLS', difficulty: 'easy' },
      { icons: ['🏄', '🏝️'], answer: 'SIARGAO', difficulty: 'easy' },
      { icons: [{ src: 'images/icons/shovel.png' }, '1️⃣'], answer: 'PALAWAN', difficulty: 'easy' },
      { icons: ['👨', '🔫', '📖'], answer: 'RIZAL MONUMENT', difficulty: 'easy' },
      // medium
      { icons: ['🕊️', '🌳'], answer: 'RIZAL PARK', difficulty: 'medium' },
      { icons: ['🧱', '🏙️', { src: 'images/icons/calesa.png' }], answer: 'INTRAMUROS', difficulty: 'medium' },
      { icons: ['🌾', '🪜'], answer: 'BANAUE RICE TERRACES', difficulty: 'medium' },
      { icons: ['✝️', '⛵'], answer: 'MAGELLANS CROSS', difficulty: 'medium' },
      { icons: ['🏰', '⚔️', '☀️', '🦉'], answer: 'FORT SANTIAGO', difficulty: 'medium' },
      { icons: ['🏛️', '🇵🇭'], answer: 'MALACANANG PALACE', difficulty: 'medium' },
      { icons: ['🐴', '🧱', '🌭'], answer: 'VIGAN', difficulty: 'medium' },
      // hard
      { icons: [{ src: 'images/icons/cotton.png' }, '🥫', '⛪', '📜'], answer: 'BARASOAIN CHURCH', difficulty: 'hard' },
      { icons: ['✌️', '🛣️', '🚗', '🚗'], answer: 'EDSA', difficulty: 'hard' },
      { icons: ['🍑', '👸', '🕳️', '🌊'], answer: 'PUERTO PRINCESA UNDERGROUND RIVER', difficulty: 'hard' },
      { icons: ['☀️', { src: 'images/icons/calendar-august.png' }, '⛪'], answer: 'SAN AGUSTIN CHURCH', difficulty: 'hard' },
      { icons: ['👂', { src: 'images/icons/button.png' }], answer: 'BATANES', difficulty: 'hard' },
    ],
  },
  {
    id: 'food-and-brands-en',
    name: 'Food & Brands',
    language: 'english',
    puzzles: [
      // easy
      { icons: ['🤡', '🍔'], answer: 'MCDONALDS', difficulty: 'easy' },
      { icons: ['🍔', '👑'], answer: 'BURGER KING', difficulty: 'easy' },
      { icons: ['🍗', '🧔'], answer: 'KFC', difficulty: 'easy' },
      { icons: ['🍕', '🏠'], answer: 'PIZZA HUT', difficulty: 'easy' },
      { icons: ['🍎'], answer: 'APPLE', difficulty: 'easy' },
      { icons: ['👟', '✔️'], answer: 'NIKE', difficulty: 'easy' },
      { icons: ['🧱'], answer: 'LEGO', difficulty: 'easy' },
      { icons: ['🏰', '🐭'], answer: 'DISNEY', difficulty: 'easy' },
      // medium
      { icons: ['🧜‍♀️', '☕'], answer: 'STARBUCKS', difficulty: 'medium' },
      { icons: ['🥤', '🐻‍❄️'], answer: 'COCA COLA', difficulty: 'medium' },
      { icons: ['🚇', '🥪'], answer: 'SUBWAY', difficulty: 'medium' },
      { icons: ['🛋️', '🔧'], answer: 'IKEA', difficulty: 'medium' },
      { icons: ['⚫', '⚪', '⚫'], answer: 'OREO', difficulty: 'medium' },
      { icons: ['📺', '🎬'], answer: 'NETFLIX', difficulty: 'medium' },
      { icons: ['☕', '🍩'], answer: 'DUNKIN DONUTS', difficulty: 'medium' },
      // hard
      { icons: ['🏔️', '🍫'], answer: 'TOBLERONE', difficulty: 'hard' },
      { icons: ['🥔', '🥸'], answer: 'PRINGLES', difficulty: 'hard' },
      { icons: ['🐠', '🍪'], answer: 'GOLDFISH', difficulty: 'hard' },
      { icons: ['💋', '🍫'], answer: 'HERSHEYS', difficulty: 'hard' },
      { icons: ['2️⃣', '🍫'], answer: 'TWIX', difficulty: 'hard' },
    ],
  },
  {
    id: 'slang-and-sayings-en',
    name: 'Slang & Sayings',
    language: 'english',
    puzzles: [
      // easy
      { icons: ['😂'], answer: 'LOL', difficulty: 'easy' },
      { icons: ['😱'], answer: 'OMG', difficulty: 'easy' },
      { icons: ['👭'], answer: 'BFF', difficulty: 'easy' },
      { icons: ['🐐'], answer: 'GOAT', difficulty: 'easy' },
      { icons: ['🔥'], answer: 'LIT', difficulty: 'easy' },
      { icons: ['🍰'], answer: 'PIECE OF CAKE', difficulty: 'easy' },
      // medium
      { icons: ['😨', '📱'], answer: 'FOMO', difficulty: 'medium' },
      { icons: ['1️⃣', '❤️'], answer: 'YOLO', difficulty: 'medium' },
      { icons: ['🧂', '😠'], answer: 'SALTY', difficulty: 'medium' },
      { icons: ['👻', '📵'], answer: 'GHOSTING', difficulty: 'medium' },
      { icons: ['🌥️', '😏'], answer: 'SHADE', difficulty: 'medium' },
      { icons: ['🍵', '💬'], answer: 'SPILL THE TEA', difficulty: 'medium' },
      { icons: ['🦵', '💥'], answer: 'BREAK A LEG', difficulty: 'medium' },
      { icons: ['🌧️', '🐱', '🐶'], answer: 'RAINING CATS AND DOGS', difficulty: 'medium' },
      { icons: ['🧊', '💥'], answer: 'BREAK THE ICE', difficulty: 'medium' },
      // hard
      { icons: ['🦷', '🔫'], answer: 'BITE THE BULLET', difficulty: 'hard' },
      { icons: ['🫘', '💬'], answer: 'SPILL THE BEANS', difficulty: 'hard' },
      { icons: ['🛏️', '👊'], answer: 'HIT THE SACK', difficulty: 'hard' },
      { icons: ['💵', '💪', '🦵'], answer: 'COST AN ARM AND A LEG', difficulty: 'hard' },
      { icons: ['🌧️', '🤒'], answer: 'UNDER THE WEATHER', difficulty: 'hard' },
    ],
  },
  {
    id: 'movies-and-celebrities-en',
    name: 'Movies & Celebrities',
    language: 'english',
    puzzles: [
      // easy
      { icons: ['🚢', '🧊'], answer: 'TITANIC', difficulty: 'easy' },
      { icons: ['🦈'], answer: 'JAWS', difficulty: 'easy' },
      { icons: ['❄️', '👸'], answer: 'FROZEN', difficulty: 'easy' },
      { icons: ['🦁', '👑'], answer: 'THE LION KING', difficulty: 'easy' },
      { icons: ['⚡', '🧙'], answer: 'HARRY POTTER', difficulty: 'easy' },
      { icons: ['⭐', '⚔️'], answer: 'STAR WARS', difficulty: 'easy' },
      { icons: ['🕷️', '🕸️'], answer: 'SPIDER MAN', difficulty: 'easy' },
      // medium
      { icons: ['🦖', '🌴'], answer: 'JURASSIC PARK', difficulty: 'medium' },
      { icons: ['🦇'], answer: 'BATMAN', difficulty: 'medium' },
      { icons: ['🏃', '🍫'], answer: 'FORREST GUMP', difficulty: 'medium' },
      { icons: ['🌪️', '👠'], answer: 'THE WIZARD OF OZ', difficulty: 'medium' },
      { icons: ['🚗', '⚡', '🕰️'], answer: 'BACK TO THE FUTURE', difficulty: 'medium' },
      { icons: ['👽', '🚲', '🌕'], answer: 'ET', difficulty: 'medium' },
      { icons: ['🤠', '🚀'], answer: 'TOY STORY', difficulty: 'medium' },
      { icons: ['🛡️', '🔨'], answer: 'THE AVENGERS', difficulty: 'medium' },
      // hard
      { icons: ['🐴', '💤'], answer: 'THE GODFATHER', difficulty: 'hard' },
      { icons: ['🏴‍☠️', '🌊'], answer: 'PIRATES OF THE CARIBBEAN', difficulty: 'hard' },
      { icons: ['🏨', '🪓'], answer: 'THE SHINING', difficulty: 'hard' },
      { icons: ['🌀', '💭'], answer: 'INCEPTION', difficulty: 'hard' },
      { icons: ['🎹', '💃'], answer: 'LA LA LAND', difficulty: 'hard' },
    ],
  },
  {
    id: 'landmarks-en',
    name: 'Places',
    language: 'english',
    puzzles: [
      // easy
      { icons: ['🗼'], answer: 'EIFFEL TOWER', difficulty: 'easy' },
      { icons: ['🗽'], answer: 'STATUE OF LIBERTY', difficulty: 'easy' },
      { icons: ['🔺', '🐫'], answer: 'PYRAMIDS OF GIZA', difficulty: 'easy' },
      { icons: ['⏰', '🇬🇧'], answer: 'BIG BEN', difficulty: 'easy' },
      { icons: ['🎭', '🇦🇺'], answer: 'SYDNEY OPERA HOUSE', difficulty: 'easy' },
      { icons: ['🏔️', '🧗'], answer: 'MOUNT EVEREST', difficulty: 'easy' },
      { icons: ['🗻'], answer: 'MOUNT FUJI', difficulty: 'easy' },
      // medium
      { icons: ['🧱', '🐉'], answer: 'GREAT WALL OF CHINA', difficulty: 'medium' },
      { icons: ['🕌', '🤍'], answer: 'TAJ MAHAL', difficulty: 'medium' },
      { icons: ['🏛️', '⚔️'], answer: 'COLOSSEUM', difficulty: 'medium' },
      { icons: ['🌊', '🍁'], answer: 'NIAGARA FALLS', difficulty: 'medium' },
      { icons: ['🗿', '🇺🇸'], answer: 'MOUNT RUSHMORE', difficulty: 'medium' },
      { icons: ['🌉', '🟠'], answer: 'GOLDEN GATE BRIDGE', difficulty: 'medium' },
      { icons: ['🗼', '📐'], answer: 'LEANING TOWER OF PISA', difficulty: 'medium' },
      { icons: ['🏜️', '🕳️'], answer: 'GRAND CANYON', difficulty: 'medium' },
      // hard
      { icons: ['🪨', '⭕'], answer: 'STONEHENGE', difficulty: 'hard' },
      { icons: ['⛰️', '🦙'], answer: 'MACHU PICCHU', difficulty: 'hard' },
      { icons: ['🎥', '🏔️'], answer: 'HOLLYWOOD SIGN', difficulty: 'hard' },
      { icons: ['🐉', '🌊'], answer: 'LOCH NESS', difficulty: 'hard' },
      { icons: ['✝️', '🧍'], answer: 'CHRIST THE REDEEMER', difficulty: 'hard' },
    ],
  },
];
