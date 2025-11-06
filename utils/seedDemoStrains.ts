import { Strain } from "@/types";
import { createStrain } from "./iconGenerator";
import { writeStrainJSON } from "./strainJSONWriter";

export const DEMO_STRAINS_DATA = [
  { name: "Blue Dream", type: "hybrid" as const, terp_profile: ["myrcene" as const, "pinene" as const], description: "Lineage: Blueberry x Haze. Balanced hybrid with sweet berry notes; smooth uplift with calm body ease." },
  { name: "Northern Lights", type: "indica" as const, terp_profile: ["pinene" as const, "myrcene" as const], description: "Lineage: Afghani landrace lineage. Classic indica known for deep, serene body calm and pine-leaning aroma." },
  { name: "Sour Diesel", type: "sativa" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Chemdawg x Super Skunk. Pungent, citrus-diesel profile with fast, hazy head lift." },
  { name: "Girl Scout Cookies", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const, "humulene" as const], description: "Lineage: OG Kush x Durban Poison. Sweet dough and earth; euphoric, cozy hybrid." },
  { name: "OG Kush", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chemdawg family. Iconic gas and pine; comfortable, heavy-lidded hybrid." },
  { name: "Granddaddy Purple", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: Purple Urkle x Big Bud. Grape-berry bouquet; full-body, soothing indica feel." },
  { name: "Gelato", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Sunset Sherbet x Thin Mint Cookies. Dessert-sweet, creamy; relaxed euphoria." },
  { name: "Wedding Cake", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Triangle Kush x Animal Mints. Frosted vanilla cookie aroma; calm, content hybrid." },
  { name: "Pineapple Express", type: "hybrid" as const, terp_profile: ["limonene" as const, "myrcene" as const], description: "Lineage: Trainwreck x Hawaiian. Tropical citrus with breezy, upbeat feel." },
  { name: "Durban Poison", type: "sativa" as const, terp_profile: ["pinene" as const, "limonene" as const], description: "Lineage: South African landrace. Bright anise-citrus; focused, active sativa character." },
  { name: "Jack Herer", type: "sativa" as const, terp_profile: ["pinene" as const, "myrcene" as const], description: "Lineage: Haze hybrid family. Pine, citrus, spice; uplifted clarity and creativity." },
  { name: "Super Lemon Haze", type: "sativa" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Lemon Skunk x Super Silver Haze. Zesty lemon candy with buoyant energy." },
  { name: "AK-47", type: "hybrid" as const, terp_profile: ["myrcene" as const, "caryophyllene" as const], description: "Lineage: Mixed landraces. Floral-earth and spice; mellow, balanced headspace." },
  { name: "Trainwreck", type: "hybrid" as const, terp_profile: ["pinene" as const, "myrcene" as const], description: "Lineage: Mexican x Thai x Afghani. Piney, lemon spice; surging head-high with warm body melt." },
  { name: "Bubba Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "caryophyllene" as const], description: "Lineage: Kush family. Coffee-chocolate earth; deeply settling indica." },
  { name: "Skywalker OG", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "myrcene" as const], description: "Lineage: Skywalker x OG Kush. Spiced pine and gas; weighty, spacey calm." },
  { name: "Gorilla Glue #4", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Chem's Sister x Sour Dubb x Chocolate Diesel. Earthy glue and gas; heavy, couchy hybrid." },
  { name: "Sunset Sherbet", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Girl Scout Cookies x Pink Panties. Fruity sherbet; mellow, dreamy mood." },
  { name: "Strawberry Cough", type: "sativa" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Strawberry fields lineage. Fresh strawberry sweet; airy, sociable lift." },
  { name: "Cherry Pie", type: "hybrid" as const, terp_profile: ["linalool" as const, "caryophyllene" as const], description: "Lineage: Granddaddy Purple x F1 Durb. Tart cherry pastry; calm and cheerful." },
  { name: "Purple Haze", type: "sativa" as const, terp_profile: ["myrcene" as const, "pinene" as const], description: "Lineage: Haze family. Sweet berry-floral; buzzy, colorful headspace." },
  { name: "Green Crack", type: "sativa" as const, terp_profile: ["myrcene" as const, "limonene" as const], description: "Lineage: Skunk #1 family. Mango-citrus snap; bright, zippy momentum." },
  { name: "White Widow", type: "hybrid" as const, terp_profile: ["pinene" as const, "myrcene" as const], description: "Lineage: Brazilian sativa x South Indian indica. Pungent pine; balanced, social hybrid." },
  { name: "Alien OG", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Tahoe OG x Alien Kush. Citrus-pine gas; potent, spacey calm." },
  { name: "Tahoe OG", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: OG Kush family. Lemon-pine OG profile; thorough evening comfort." },
  { name: "Purple Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: Hindu Kush x Purple Afghani. Grape-berry and earth; tranquil body calm." },
  { name: "Banana Kush", type: "hybrid" as const, terp_profile: ["myrcene" as const, "limonene" as const], description: "Lineage: Ghost OG x Skunk Haze. Creamy banana and citrus; relaxed, content hybrid." },
  { name: "Mango", type: "indica" as const, terp_profile: ["myrcene" as const, "limonene" as const], description: "Lineage: Old-school indica line. Ripe mango aroma; cozy, soothing body feel." },
  { name: "Zkittlez", type: "hybrid" as const, terp_profile: ["humulene" as const, "caryophyllene" as const], description: "Lineage: Grape Ape x Grapefruit. Rainbow candy; calm, happy hybrid mood." },
  { name: "Runtz", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Zkittlez x Gelato. Sugary fruit; even-keeled, blissful hybrid." },
  { name: "Ice Cream Cake", type: "indica" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Wedding Cake x Gelato #33. Frosted vanilla and dough; peaceful, heavy indica lean." },
  { name: "Lemon Haze", type: "sativa" as const, terp_profile: ["limonene" as const, "pinene" as const], description: "Lineage: Lemon Skunk x Silver Haze. Bright lemon peel; lively, chatty uplift." },
  { name: "Orange Cookies", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Orange Juice x GSC. Tangy orange dough; cheerful, calm balance." },
  { name: "Apple Fritter", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "linalool" as const], description: "Lineage: Sour Apple x Animal Cookies. Baked apple and spice; cozy, dreamy hybrid." },
  { name: "Do-Si-Dos", type: "indica" as const, terp_profile: ["caryophyllene" as const, "linalool" as const], description: "Lineage: Girl Scout Cookies x Face Off OG. Cookie dough and floral spice; deep, tranquil calm." },
  { name: "Bruce Banner", type: "hybrid" as const, terp_profile: ["myrcene" as const, "caryophyllene" as const], description: "Lineage: OG Kush x Strawberry Diesel. Strawberry-diesel; strong, expansive hybrid lift." },
  { name: "Chemdawg", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chem family. Pungent chem and gas; potent, thought-forward hybrid." },
  { name: "GSC Thin Mint", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: GSC phenotype. Minty-cookie sweetness; buoyant, soothing hybrid." },
  { name: "Super Silver Haze", type: "sativa" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Skunk x Northern Lights x Haze. Metallic citrus haze; bright, long-lasting head buzz." },
  { name: "Grape Ape", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: Mendocino Purps x Skunk x Afghani. Grape candy and earth; restful couchy feel." },
  { name: "Forbidden Fruit", type: "indica" as const, terp_profile: ["linalool" as const, "myrcene" as const], description: "Lineage: Cherry Pie x Tangie. Exotic tropical citrus; serene, lazy calm." },
  { name: "Tangie", type: "sativa" as const, terp_profile: ["limonene" as const, "myrcene" as const], description: "Lineage: California Orange x Skunk. Fresh tangerine zest; buoyant, creative focus." },
  { name: "LA Confidential", type: "indica" as const, terp_profile: ["myrcene" as const, "pinene" as const], description: "Lineage: OG LA Affie x Afghani. Forest pine and earth; heavy-bodied calm." },
  { name: "Blueberry", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: Afghani x Thai x Purple Thai. Sweet blueberry; tranquil, content body feel." },
  { name: "Amnesia Haze", type: "sativa" as const, terp_profile: ["limonene" as const, "pinene" as const], description: "Lineage: Haze family blend. Citrus-herbal haze; bright, soaring headspace." },
] as const;

export async function seedDemoStrains(): Promise<Strain[]> {
  console.log('[SeedStrains] Starting demo strain generation...');
  
  const strains: Strain[] = [];
  
  for (const data of DEMO_STRAINS_DATA) {
    try {
      const strain = createStrain(data.name, data.type, {
        terp_profile: [...data.terp_profile],
        description: data.description,
        source: "developer",
      });
      
      await writeStrainJSON(strain);
      strains.push(strain);
      
      console.log(`[SeedStrains] ✓ Created ${data.name} (${strain.strain_id})`);
    } catch (error) {
      console.error(`[SeedStrains] Failed to create ${data.name}:`, error);
    }
  }
  
  console.log(`[SeedStrains] Complete! Generated ${strains.length} strains.`);
  return strains;
}
