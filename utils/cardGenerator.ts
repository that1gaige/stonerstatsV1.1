import { StrainCard, CardRarity, CardArtVariant, Strain } from "@/types";

const RARITIES: CardRarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
const ART_VARIANTS: CardArtVariant[] = ["base", "foil", "terp", "heritage", "cosmic", "seasonal"];

export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function assignRarityForStrain(strainName: string): CardRarity {
  const hash = strainName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rarityIndex = hash % 100;
  
  if (rarityIndex < 40) return "common";
  if (rarityIndex < 65) return "uncommon";
  if (rarityIndex < 82) return "rare";
  if (rarityIndex < 92) return "epic";
  if (rarityIndex < 98) return "legendary";
  return "mythic";
}

export function assignArtVariant(rarity: CardRarity, variantIndex: number): CardArtVariant {
  const variants: CardArtVariant[] = ["base"];
  
  if (rarity === "uncommon" || rarity === "rare" || rarity === "epic" || rarity === "legendary" || rarity === "mythic") {
    variants.push("terp");
  }
  
  if (rarity === "rare" || rarity === "epic" || rarity === "legendary" || rarity === "mythic") {
    variants.push("foil", "heritage");
  }
  
  if (rarity === "epic" || rarity === "legendary" || rarity === "mythic") {
    variants.push("cosmic");
  }
  
  if (rarity === "legendary" || rarity === "mythic") {
    variants.push("seasonal");
  }
  
  return variants[variantIndex % variants.length];
}

export function generateCardNumber(setPrefix: string, cardIndex: number): string {
  const paddedNumber = String(cardIndex).padStart(3, "0");
  return `${setPrefix}-${paddedNumber}`;
}

export function generateCardsForStrain(
  strain: Strain,
  setPrefix: string,
  baseCardNumber: number
): StrainCard[] {
  const cards: StrainCard[] = [];
  const rarity = assignRarityForStrain(strain.name);
  
  let variantCount = 1;
  if (rarity === "uncommon") variantCount = 1;
  else if (rarity === "rare") variantCount = 2;
  else if (rarity === "epic") variantCount = 2;
  else if (rarity === "legendary") variantCount = 3;
  else if (rarity === "mythic") variantCount = 4;
  
  for (let i = 0; i < variantCount; i++) {
    const artVariant = assignArtVariant(rarity, i);
    const cardNumber = generateCardNumber(setPrefix, baseCardNumber + i);
    
    const variantName = artVariant === "base" ? "" : ` - ${capitalize(artVariant)}`;
    
    cards.push({
      card_id: generateCardId(),
      strain_id: strain.strain_id,
      card_name: `${strain.name}${variantName}`,
      card_number: cardNumber,
      set_name: "Set A1 – First Print",
      rarity,
      art_variant: artVariant,
      obtained_at: new Date(),
      is_favorited: false,
    });
  }
  
  return cards;
}

export function generateSetA1Cards(strains: Strain[]): StrainCard[] {
  const allCards: StrainCard[] = [];
  let cardNumber = 1;
  
  const sortedStrains = [...strains].sort((a, b) => a.name.localeCompare(b.name));
  
  for (const strain of sortedStrains) {
    const strainCards = generateCardsForStrain(strain, "A1", cardNumber);
    allCards.push(...strainCards);
    cardNumber += strainCards.length;
  }
  
  return allCards;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRarityColor(rarity: CardRarity): string {
  switch (rarity) {
    case "common": return "#9ca3af";
    case "uncommon": return "#4ade80";
    case "rare": return "#a855f7";
    case "epic": return "#3b82f6";
    case "legendary": return "#fbbf24";
    case "mythic": return "linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)";
    default: return "#9ca3af";
  }
}

export function getRarityGlow(rarity: CardRarity): string {
  switch (rarity) {
    case "common": return "rgba(156, 163, 175, 0.2)";
    case "uncommon": return "rgba(74, 222, 128, 0.3)";
    case "rare": return "rgba(168, 85, 247, 0.3)";
    case "epic": return "rgba(59, 130, 246, 0.4)";
    case "legendary": return "rgba(251, 191, 36, 0.5)";
    case "mythic": return "rgba(139, 92, 246, 0.6)";
    default: return "rgba(156, 163, 175, 0.2)";
  }
}
