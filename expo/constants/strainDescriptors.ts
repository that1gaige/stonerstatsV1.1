export interface DescriptorColorMap {
  hue: number;
  saturationBoost: number;
  lightnessBoost: number;
  category: 'color' | 'flavor' | 'nature' | 'emotion' | 'texture' | 'effect';
}

export const STRAIN_DESCRIPTOR_DATABASE: Record<string, DescriptorColorMap> = {
  // Base Colors
  blue: { hue: 222, saturationBoost: 15, lightnessBoost: 5, category: 'color' },
  blu: { hue: 222, saturationBoost: 15, lightnessBoost: 5, category: 'color' },
  navy: { hue: 230, saturationBoost: 10, lightnessBoost: -10, category: 'color' },
  red: { hue: 5, saturationBoost: 25, lightnessBoost: 0, category: 'color' },
  scarlet: { hue: 8, saturationBoost: 28, lightnessBoost: 0, category: 'color' },
  crimson: { hue: 350, saturationBoost: 28, lightnessBoost: -5, category: 'color' },
  cherry: { hue: 5, saturationBoost: 26, lightnessBoost: -2, category: 'flavor' },
  pink: { hue: 335, saturationBoost: 18, lightnessBoost: 12, category: 'color' },
  rose: { hue: 345, saturationBoost: 22, lightnessBoost: 5, category: 'nature' },
  magenta: { hue: 325, saturationBoost: 25, lightnessBoost: 5, category: 'color' },
  blush: { hue: 338, saturationBoost: 18, lightnessBoost: 12, category: 'color' },
  bubblegum: { hue: 330, saturationBoost: 20, lightnessBoost: 12, category: 'flavor' },
  purple: { hue: 280, saturationBoost: 20, lightnessBoost: -5, category: 'color' },
  violet: { hue: 285, saturationBoost: 22, lightnessBoost: 0, category: 'color' },
  lavender: { hue: 270, saturationBoost: 18, lightnessBoost: 10, category: 'nature' },
  lilac: { hue: 275, saturationBoost: 18, lightnessBoost: 8, category: 'color' },
  orange: { hue: 28, saturationBoost: 25, lightnessBoost: 5, category: 'color' },
  tangerine: { hue: 30, saturationBoost: 25, lightnessBoost: 10, category: 'flavor' },
  clementine: { hue: 32, saturationBoost: 25, lightnessBoost: 10, category: 'flavor' },
  yellow: { hue: 55, saturationBoost: 20, lightnessBoost: 10, category: 'color' },
  gold: { hue: 50, saturationBoost: 22, lightnessBoost: 12, category: 'color' },
  golden: { hue: 50, saturationBoost: 22, lightnessBoost: 12, category: 'color' },
  lemon: { hue: 56, saturationBoost: 25, lightnessBoost: 15, category: 'flavor' },
  green: { hue: 120, saturationBoost: 10, lightnessBoost: 0, category: 'color' },
  lime: { hue: 102, saturationBoost: 20, lightnessBoost: 8, category: 'flavor' },
  jade: { hue: 125, saturationBoost: 15, lightnessBoost: 0, category: 'color' },
  teal: { hue: 180, saturationBoost: 18, lightnessBoost: 0, category: 'color' },
  turquoise: { hue: 185, saturationBoost: 18, lightnessBoost: 5, category: 'color' },
  aqua: { hue: 180, saturationBoost: 18, lightnessBoost: 10, category: 'color' },
  brown: { hue: 30, saturationBoost: -5, lightnessBoost: -15, category: 'color' },
  cocoa: { hue: 25, saturationBoost: 0, lightnessBoost: -20, category: 'flavor' },
  coffee: { hue: 25, saturationBoost: 5, lightnessBoost: -20, category: 'flavor' },
  black: { hue: 0, saturationBoost: -25, lightnessBoost: -40, category: 'color' },
  midnight: { hue: 240, saturationBoost: -20, lightnessBoost: -35, category: 'color' },
  white: { hue: 0, saturationBoost: -25, lightnessBoost: 35, category: 'color' },
  silver: { hue: 210, saturationBoost: -20, lightnessBoost: 28, category: 'color' },
  platinum: { hue: 215, saturationBoost: -18, lightnessBoost: 30, category: 'color' },
  gray: { hue: 0, saturationBoost: -10, lightnessBoost: 0, category: 'color' },
  grey: { hue: 0, saturationBoost: -10, lightnessBoost: 0, category: 'color' },
  smoke: { hue: 0, saturationBoost: -10, lightnessBoost: 0, category: 'color' },
  cloudy: { hue: 210, saturationBoost: -10, lightnessBoost: 10, category: 'nature' },

  // Fruits & Flavors
  strawberry: { hue: 358, saturationBoost: 25, lightnessBoost: 8, category: 'flavor' },
  raspberry: { hue: 336, saturationBoost: 24, lightnessBoost: 6, category: 'flavor' },
  cherryfruit: { hue: 5, saturationBoost: 26, lightnessBoost: -2, category: 'flavor' },
  watermelon: { hue: 352, saturationBoost: 22, lightnessBoost: 6, category: 'flavor' },
  peach: { hue: 30, saturationBoost: 18, lightnessBoost: 12, category: 'flavor' },
  mango: { hue: 36, saturationBoost: 22, lightnessBoost: 8, category: 'flavor' },
  banana: { hue: 54, saturationBoost: 18, lightnessBoost: 12, category: 'flavor' },
  pineapple: { hue: 58, saturationBoost: 18, lightnessBoost: 12, category: 'flavor' },
  apple: { hue: 110, saturationBoost: 14, lightnessBoost: 6, category: 'flavor' },
  grape: { hue: 275, saturationBoost: 20, lightnessBoost: -5, category: 'flavor' },
  blueberry: { hue: 225, saturationBoost: 20, lightnessBoost: 0, category: 'flavor' },
  blackberry: { hue: 250, saturationBoost: 18, lightnessBoost: -8, category: 'flavor' },
  orangefruit: { hue: 30, saturationBoost: 25, lightnessBoost: 5, category: 'flavor' },
  coconut: { hue: 40, saturationBoost: -15, lightnessBoost: 18, category: 'flavor' },
  melon: { hue: 35, saturationBoost: 12, lightnessBoost: 8, category: 'flavor' },
  cantaloupe: { hue: 35, saturationBoost: 15, lightnessBoost: 10, category: 'flavor' },
  papaya: { hue: 40, saturationBoost: 18, lightnessBoost: 10, category: 'flavor' },
  guava: { hue: 346, saturationBoost: 20, lightnessBoost: 10, category: 'flavor' },
  passion: { hue: 310, saturationBoost: 22, lightnessBoost: 8, category: 'flavor' },
  dragon: { hue: 10, saturationBoost: 25, lightnessBoost: 5, category: 'effect' },
  fruit: { hue: 320, saturationBoost: 18, lightnessBoost: 6, category: 'flavor' },

  // Metals, Minerals, Gems
  bronze: { hue: 32, saturationBoost: 12, lightnessBoost: 0, category: 'color' },
  copper: { hue: 28, saturationBoost: 15, lightnessBoost: -2, category: 'color' },
  iron: { hue: 210, saturationBoost: -10, lightnessBoost: -5, category: 'color' },
  steel: { hue: 210, saturationBoost: -10, lightnessBoost: -5, category: 'color' },
  lead: { hue: 215, saturationBoost: -10, lightnessBoost: -10, category: 'color' },
  titanium: { hue: 205, saturationBoost: -8, lightnessBoost: 0, category: 'color' },
  diamond: { hue: 200, saturationBoost: 10, lightnessBoost: 25, category: 'nature' },
  crystal: { hue: 190, saturationBoost: 10, lightnessBoost: 22, category: 'nature' },
  quartz: { hue: 190, saturationBoost: 8, lightnessBoost: 22, category: 'nature' },
  ruby: { hue: 5, saturationBoost: 30, lightnessBoost: 0, category: 'color' },
  sapphire: { hue: 230, saturationBoost: 18, lightnessBoost: -5, category: 'color' },
  emerald: { hue: 135, saturationBoost: 20, lightnessBoost: 0, category: 'color' },
  amethyst: { hue: 280, saturationBoost: 20, lightnessBoost: 0, category: 'color' },
  opal: { hue: 300, saturationBoost: 0, lightnessBoost: 15, category: 'color' },
  pearl: { hue: 40, saturationBoost: -10, lightnessBoost: 22, category: 'nature' },

  // Animals & Mythic
  gorilla: { hue: 30, saturationBoost: -10, lightnessBoost: -20, category: 'nature' },
  monkey: { hue: 40, saturationBoost: 0, lightnessBoost: -5, category: 'nature' },
  tiger: { hue: 30, saturationBoost: 20, lightnessBoost: 0, category: 'nature' },
  bear: { hue: 30, saturationBoost: -5, lightnessBoost: -15, category: 'nature' },
  panda: { hue: 0, saturationBoost: -20, lightnessBoost: 15, category: 'nature' },
  shark: { hue: 205, saturationBoost: -5, lightnessBoost: -5, category: 'nature' },
  snake: { hue: 115, saturationBoost: 15, lightnessBoost: 0, category: 'nature' },
  wolf: { hue: 210, saturationBoost: -5, lightnessBoost: -5, category: 'nature' },
  eagle: { hue: 40, saturationBoost: 5, lightnessBoost: -5, category: 'nature' },
  hawk: { hue: 40, saturationBoost: 5, lightnessBoost: -5, category: 'nature' },
  alien: { hue: 110, saturationBoost: 30, lightnessBoost: 5, category: 'effect' },
  zombie: { hue: 100, saturationBoost: 10, lightnessBoost: 0, category: 'effect' },
  ghoul: { hue: 100, saturationBoost: 10, lightnessBoost: 0, category: 'effect' },
  unicorn: { hue: 300, saturationBoost: 0, lightnessBoost: 15, category: 'effect' },
  phoenix: { hue: 15, saturationBoost: 30, lightnessBoost: 0, category: 'effect' },
  ghost: { hue: 0, saturationBoost: -30, lightnessBoost: 30, category: 'effect' },

  // Natural & Elemental
  fire: { hue: 18, saturationBoost: 30, lightnessBoost: 5, category: 'nature' },
  flame: { hue: 20, saturationBoost: 28, lightnessBoost: 5, category: 'nature' },
  inferno: { hue: 15, saturationBoost: 30, lightnessBoost: 0, category: 'nature' },
  blaze: { hue: 22, saturationBoost: 28, lightnessBoost: 5, category: 'nature' },
  ice: { hue: 205, saturationBoost: 10, lightnessBoost: 20, category: 'nature' },
  frost: { hue: 210, saturationBoost: 8, lightnessBoost: 18, category: 'nature' },
  glacier: { hue: 210, saturationBoost: 6, lightnessBoost: 18, category: 'nature' },
  snow: { hue: 0, saturationBoost: -20, lightnessBoost: 28, category: 'nature' },
  thunder: { hue: 55, saturationBoost: 25, lightnessBoost: 10, category: 'nature' },
  lightning: { hue: 56, saturationBoost: 28, lightnessBoost: 12, category: 'nature' },
  bolt: { hue: 56, saturationBoost: 28, lightnessBoost: 12, category: 'nature' },
  storm: { hue: 220, saturationBoost: 5, lightnessBoost: -10, category: 'nature' },
  cloud: { hue: 210, saturationBoost: -10, lightnessBoost: 10, category: 'nature' },
  rain: { hue: 210, saturationBoost: -5, lightnessBoost: 0, category: 'nature' },
  earth: { hue: 30, saturationBoost: -5, lightnessBoost: -10, category: 'nature' },
  soil: { hue: 30, saturationBoost: -5, lightnessBoost: -12, category: 'nature' },
  mud: { hue: 28, saturationBoost: -5, lightnessBoost: -15, category: 'nature' },
  sand: { hue: 42, saturationBoost: 5, lightnessBoost: 10, category: 'nature' },
  dune: { hue: 42, saturationBoost: 5, lightnessBoost: 10, category: 'nature' },
  desert: { hue: 42, saturationBoost: 8, lightnessBoost: 10, category: 'nature' },
  ocean: { hue: 200, saturationBoost: 10, lightnessBoost: 0, category: 'nature' },
  sea: { hue: 200, saturationBoost: 10, lightnessBoost: 0, category: 'nature' },
  wave: { hue: 200, saturationBoost: 10, lightnessBoost: 0, category: 'nature' },
  sky: { hue: 210, saturationBoost: 8, lightnessBoost: 10, category: 'nature' },
  wind: { hue: 190, saturationBoost: 5, lightnessBoost: 5, category: 'nature' },
  air: { hue: 190, saturationBoost: 5, lightnessBoost: 5, category: 'nature' },
  sun: { hue: 52, saturationBoost: 30, lightnessBoost: 15, category: 'nature' },
  solar: { hue: 52, saturationBoost: 28, lightnessBoost: 12, category: 'nature' },
  moon: { hue: 215, saturationBoost: 0, lightnessBoost: 15, category: 'nature' },
  lunar: { hue: 215, saturationBoost: 0, lightnessBoost: 15, category: 'nature' },
  star: { hue: 270, saturationBoost: 15, lightnessBoost: 15, category: 'emotion' },
  cosmic: { hue: 290, saturationBoost: 20, lightnessBoost: 5, category: 'emotion' },
  galaxy: { hue: 270, saturationBoost: 20, lightnessBoost: 0, category: 'emotion' },
  nebula: { hue: 300, saturationBoost: 25, lightnessBoost: 10, category: 'emotion' },
  stone: { hue: 30, saturationBoost: -10, lightnessBoost: -10, category: 'nature' },
  rock: { hue: 28, saturationBoost: -10, lightnessBoost: -10, category: 'nature' },
  lava: { hue: 15, saturationBoost: 30, lightnessBoost: 0, category: 'nature' },
  magma: { hue: 15, saturationBoost: 30, lightnessBoost: 0, category: 'nature' },

  // Existing plus canonical strain tokens
  berry: { hue: 310, saturationBoost: 18, lightnessBoost: 5, category: 'flavor' },
  diesel: { hue: 50, saturationBoost: 10, lightnessBoost: -10, category: 'flavor' },
  fuel: { hue: 55, saturationBoost: 8, lightnessBoost: -12, category: 'flavor' },
  gas: { hue: 45, saturationBoost: 10, lightnessBoost: -10, category: 'flavor' },
  sour: { hue: 65, saturationBoost: 20, lightnessBoost: 5, category: 'flavor' },
  sweet: { hue: 320, saturationBoost: 15, lightnessBoost: 10, category: 'flavor' },
  spice: { hue: 20, saturationBoost: 15, lightnessBoost: -5, category: 'flavor' },
  spicy: { hue: 15, saturationBoost: 18, lightnessBoost: -5, category: 'flavor' },
  pepper: { hue: 0, saturationBoost: 10, lightnessBoost: -10, category: 'flavor' },
  skunk: { hue: 75, saturationBoost: 12, lightnessBoost: -8, category: 'flavor' },
  cheese: { hue: 50, saturationBoost: 10, lightnessBoost: 5, category: 'flavor' },
  cream: { hue: 45, saturationBoost: -5, lightnessBoost: 15, category: 'flavor' },
  butter: { hue: 48, saturationBoost: 8, lightnessBoost: 10, category: 'flavor' },

  haze: { hue: 40, saturationBoost: 10, lightnessBoost: 15, category: 'texture' },
  kush: { hue: 105, saturationBoost: 12, lightnessBoost: -5, category: 'nature' },
  og: { hue: 110, saturationBoost: 10, lightnessBoost: 0, category: 'nature' },
  cookies: { hue: 30, saturationBoost: 8, lightnessBoost: 5, category: 'flavor' },
  cake: { hue: 35, saturationBoost: 10, lightnessBoost: 8, category: 'flavor' },

  dream: { hue: 240, saturationBoost: 18, lightnessBoost: 10, category: 'emotion' },
  fantasy: { hue: 270, saturationBoost: 20, lightnessBoost: 5, category: 'emotion' },
  magic: { hue: 285, saturationBoost: 22, lightnessBoost: 8, category: 'emotion' },
  wonder: { hue: 250, saturationBoost: 18, lightnessBoost: 10, category: 'emotion' },
  bliss: { hue: 300, saturationBoost: 15, lightnessBoost: 12, category: 'emotion' },
  joy: { hue: 55, saturationBoost: 20, lightnessBoost: 15, category: 'emotion' },
  happy: { hue: 60, saturationBoost: 20, lightnessBoost: 12, category: 'emotion' },
  euphoria: { hue: 295, saturationBoost: 20, lightnessBoost: 10, category: 'emotion' },
  heaven: { hue: 200, saturationBoost: 10, lightnessBoost: 20, category: 'emotion' },
  paradise: { hue: 180, saturationBoost: 15, lightnessBoost: 15, category: 'emotion' },

  northern: { hue: 210, saturationBoost: 12, lightnessBoost: 5, category: 'nature' },
  southern: { hue: 40, saturationBoost: 15, lightnessBoost: 10, category: 'nature' },
  eastern: { hue: 340, saturationBoost: 15, lightnessBoost: 5, category: 'nature' },
  western: { hue: 55, saturationBoost: 18, lightnessBoost: 8, category: 'nature' },

  king: { hue: 45, saturationBoost: 20, lightnessBoost: 10, category: 'emotion' },
  queen: { hue: 295, saturationBoost: 20, lightnessBoost: 10, category: 'emotion' },
  royal: { hue: 275, saturationBoost: 22, lightnessBoost: 5, category: 'emotion' },
  crown: { hue: 48, saturationBoost: 25, lightnessBoost: 15, category: 'emotion' },
  emperor: { hue: 280, saturationBoost: 20, lightnessBoost: 8, category: 'emotion' },

  super: { hue: 60, saturationBoost: 20, lightnessBoost: 15, category: 'effect' },
  ultra: { hue: 280, saturationBoost: 25, lightnessBoost: 10, category: 'effect' },
  mega: { hue: 340, saturationBoost: 22, lightnessBoost: 8, category: 'effect' },
  extreme: { hue: 10, saturationBoost: 28, lightnessBoost: 5, category: 'effect' },
  power: { hue: 0, saturationBoost: 25, lightnessBoost: 0, category: 'effect' },

  space: { hue: 260, saturationBoost: 18, lightnessBoost: 10, category: 'emotion' },
  galactic: { hue: 275, saturationBoost: 20, lightnessBoost: 10, category: 'emotion' },

  night: { hue: 240, saturationBoost: 10, lightnessBoost: -15, category: 'nature' },
  day: { hue: 55, saturationBoost: 20, lightnessBoost: 20, category: 'nature' },
  dawn: { hue: 25, saturationBoost: 18, lightnessBoost: 15, category: 'nature' },
  dusk: { hue: 280, saturationBoost: 15, lightnessBoost: -5, category: 'nature' },
  sunset: { hue: 15, saturationBoost: 30, lightnessBoost: 10, category: 'nature' },
  sunrise: { hue: 35, saturationBoost: 28, lightnessBoost: 15, category: 'nature' },

  pure: { hue: 200, saturationBoost: -10, lightnessBoost: 20, category: 'texture' },
  clean: { hue: 195, saturationBoost: -8, lightnessBoost: 18, category: 'texture' },
  smooth: { hue: 120, saturationBoost: 5, lightnessBoost: 10, category: 'texture' },
  rough: { hue: 30, saturationBoost: 8, lightnessBoost: -10, category: 'texture' },
  thick: { hue: 25, saturationBoost: 10, lightnessBoost: -8, category: 'texture' },
  thin: { hue: 190, saturationBoost: -5, lightnessBoost: 15, category: 'texture' },
  dense: { hue: 115, saturationBoost: 15, lightnessBoost: -10, category: 'texture' },
  light: { hue: 60, saturationBoost: 10, lightnessBoost: 20, category: 'texture' },

  bubba: { hue: 280, saturationBoost: 12, lightnessBoost: -5, category: 'nature' },
  durban: { hue: 70, saturationBoost: 18, lightnessBoost: 5, category: 'nature' },
  maui: { hue: 45, saturationBoost: 22, lightnessBoost: 12, category: 'nature' },
  afghan: { hue: 30, saturationBoost: 10, lightnessBoost: -5, category: 'nature' },

  girl: { hue: 320, saturationBoost: 18, lightnessBoost: 10, category: 'emotion' },
  boy: { hue: 210, saturationBoost: 15, lightnessBoost: 5, category: 'emotion' },
  scout: { hue: 110, saturationBoost: 15, lightnessBoost: 0, category: 'nature' },

  widow: { hue: 200, saturationBoost: 5, lightnessBoost: 20, category: 'nature' },

  amnesia: { hue: 280, saturationBoost: 15, lightnessBoost: 10, category: 'effect' },

  jack: { hue: 125, saturationBoost: 15, lightnessBoost: 5, category: 'nature' },

  tangie: { hue: 35, saturationBoost: 25, lightnessBoost: 10, category: 'flavor' },

  zkittlez: { hue: 315, saturationBoost: 30, lightnessBoost: 10, category: 'flavor' },
  gelato: { hue: 305, saturationBoost: 20, lightnessBoost: 8, category: 'flavor' },
  sherbet: { hue: 330, saturationBoost: 22, lightnessBoost: 12, category: 'flavor' },

  wedding: { hue: 40, saturationBoost: 10, lightnessBoost: 18, category: 'emotion' },

  runtz: { hue: 320, saturationBoost: 28, lightnessBoost: 10, category: 'flavor' },

  breath: { hue: 200, saturationBoost: 8, lightnessBoost: 15, category: 'texture' },
};

export const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for',
  'by', 'with', 'from', 'up', 'about', 'into', 'through', 'during'
]);

export function getDescriptorColors(word: string): DescriptorColorMap | null {
  const normalized = word.toLowerCase().trim();
  return STRAIN_DESCRIPTOR_DATABASE[normalized] || null;
}

export function getAllDescriptors(): string[] {
  return Object.keys(STRAIN_DESCRIPTOR_DATABASE);
}

export function getDescriptorsByCategory(category: DescriptorColorMap['category']): string[] {
  return Object.entries(STRAIN_DESCRIPTOR_DATABASE)
    .filter(([_, data]) => data.category === category)
    .map(([word]) => word);
}
