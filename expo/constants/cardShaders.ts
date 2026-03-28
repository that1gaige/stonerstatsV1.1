export type CardShaderType = 
  | "standard_leaf_tint"
  | "high_contrast_pop"
  | "velvet_soft_glow"
  | "vaporwave_gradient"
  | "vintage_muted"
  | "terp_color_bend"
  | "holo_sparkle"
  | "gold_foil"
  | "cosmic_holo"
  | "ripplewave_foil"
  | "crystal_shine"
  | "static_grain_holo"
  | "neon_pulse_foil"
  | "legacy_edition"
  | "420_edition"
  | "deep_forest"
  | "summer_citrus"
  | "mythic_cosmic_rift";

export interface CardShader {
  id: CardShaderType;
  name: string;
  category: "base" | "foil" | "special";
  description: string;
  rarityWeight: {
    common?: number;
    uncommon?: number;
    rare?: number;
    epic?: number;
    legendary?: number;
    mythic?: number;
  };
}

export const CARD_SHADERS: Record<CardShaderType, CardShader> = {
  standard_leaf_tint: {
    id: "standard_leaf_tint",
    name: "Standard Leaf Tint",
    category: "base",
    description: "Classic natural leaf color palette",
    rarityWeight: { common: 100, uncommon: 80, rare: 50 },
  },
  high_contrast_pop: {
    id: "high_contrast_pop",
    name: "High Contrast Pop",
    category: "base",
    description: "Vibrant, high-contrast colors that pop",
    rarityWeight: { uncommon: 100, rare: 80, epic: 60 },
  },
  velvet_soft_glow: {
    id: "velvet_soft_glow",
    name: "Velvet Soft Glow",
    category: "base",
    description: "Soft, velvet-like glow effect",
    rarityWeight: { uncommon: 70, rare: 100, epic: 80 },
  },
  vaporwave_gradient: {
    id: "vaporwave_gradient",
    name: "Vaporwave Gradient",
    category: "base",
    description: "Retro vaporwave aesthetic gradient",
    rarityWeight: { rare: 100, epic: 90, legendary: 70 },
  },
  vintage_muted: {
    id: "vintage_muted",
    name: "Vintage Muted",
    category: "base",
    description: "Muted, vintage-inspired colors",
    rarityWeight: { uncommon: 60, rare: 80, epic: 70 },
  },
  terp_color_bend: {
    id: "terp_color_bend",
    name: "Terp-Color Bend",
    category: "base",
    description: "Colors derived from dominant terpenes",
    rarityWeight: { uncommon: 90, rare: 100, epic: 100, legendary: 90 },
  },
  holo_sparkle: {
    id: "holo_sparkle",
    name: "Holo Sparkle",
    category: "foil",
    description: "Holographic sparkle effect",
    rarityWeight: { rare: 100, epic: 100, legendary: 80 },
  },
  gold_foil: {
    id: "gold_foil",
    name: "Gold Foil",
    category: "foil",
    description: "Luxurious gold foil finish",
    rarityWeight: { epic: 80, legendary: 100, mythic: 80 },
  },
  cosmic_holo: {
    id: "cosmic_holo",
    name: "Cosmic Holo",
    category: "foil",
    description: "Cosmic holographic effect with galaxy vibes",
    rarityWeight: { epic: 90, legendary: 100, mythic: 100 },
  },
  ripplewave_foil: {
    id: "ripplewave_foil",
    name: "Ripplewave Foil",
    category: "foil",
    description: "Rippling wave-like foil pattern",
    rarityWeight: { rare: 80, epic: 100, legendary: 90 },
  },
  crystal_shine: {
    id: "crystal_shine",
    name: "Crystal Shine",
    category: "foil",
    description: "Crystalline shimmering effect",
    rarityWeight: { epic: 100, legendary: 100, mythic: 90 },
  },
  static_grain_holo: {
    id: "static_grain_holo",
    name: "Static Grain Holo",
    category: "foil",
    description: "Grainy static holographic texture",
    rarityWeight: { rare: 70, epic: 90, legendary: 80 },
  },
  neon_pulse_foil: {
    id: "neon_pulse_foil",
    name: "Neon Pulse Foil",
    category: "foil",
    description: "Pulsing neon foil effect",
    rarityWeight: { epic: 90, legendary: 100, mythic: 90 },
  },
  legacy_edition: {
    id: "legacy_edition",
    name: "Legacy Edition",
    category: "special",
    description: "Classic heritage styling",
    rarityWeight: { rare: 60, epic: 80, legendary: 100 },
  },
  "420_edition": {
    id: "420_edition",
    name: "420 Edition",
    category: "special",
    description: "Special 420 celebration edition",
    rarityWeight: { legendary: 100, mythic: 100 },
  },
  deep_forest: {
    id: "deep_forest",
    name: "Deep Forest",
    category: "special",
    description: "Dark, mysterious forest aesthetic",
    rarityWeight: { rare: 80, epic: 100, legendary: 90 },
  },
  summer_citrus: {
    id: "summer_citrus",
    name: "Summer Citrus",
    category: "special",
    description: "Bright, summery citrus colors",
    rarityWeight: { uncommon: 70, rare: 90, epic: 80 },
  },
  mythic_cosmic_rift: {
    id: "mythic_cosmic_rift",
    name: "Mythic Cosmic Rift",
    category: "special",
    description: "Animated cosmic rift (Mythic only)",
    rarityWeight: { mythic: 100 },
  },
};

export function getShaderForCard(
  rarity: string,
  artVariant: string,
  seed: string
): CardShaderType {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const availableShaders = Object.values(CARD_SHADERS).filter((shader) => {
    const weight = shader.rarityWeight[rarity as keyof typeof shader.rarityWeight];
    
    if (!weight) return false;
    
    if (artVariant === "foil" && shader.category !== "foil") return false;
    
    return true;
  });

  if (availableShaders.length === 0) {
    return "standard_leaf_tint";
  }

  const selectedShader = availableShaders[hash % availableShaders.length];
  return selectedShader.id;
}
