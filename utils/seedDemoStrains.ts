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
  { name: "Mango Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "limonene" as const], description: "Lineage: KC33 x Afghani. Ripe mango and tropical sweetness; cozy, soothing body feel." },
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
  { name: "Platinum Cookies", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: OG Kush x Durban Poison x Cherry Kush. Sweet berry-cookie; mellow, euphoric feel." },
  { name: "Fire OG", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: OG Kush x SFV OG. Lemon gas with earth; potent, sedative hybrid." },
  { name: "Death Star", type: "indica" as const, terp_profile: ["myrcene" as const, "caryophyllene" as const], description: "Lineage: Sensi Star x Sour Diesel. Jet fuel and skunk; heavy, cosmic body high." },
  { name: "Headband", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: OG Kush x Sour Diesel. Lemon diesel; smooth headband pressure, mellow focus." },
  { name: "Silver Haze", type: "sativa" as const, terp_profile: ["pinene" as const, "limonene" as const], description: "Lineage: Original Haze. Spicy citrus haze; clear-headed, energetic buzz." },
  { name: "Pink Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: OG Kush variant. Floral candy sweetness; sedating, body-melting calm." },
  { name: "Clementine", type: "sativa" as const, terp_profile: ["limonene" as const, "myrcene" as const], description: "Lineage: Tangie x Lemon Skunk. Citrus burst; uplifting, creative energy." },
  { name: "Mimosa", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Clementine x Purple Punch. Tropical citrus champagne; happy, relaxed vibe." },
  { name: "Purple Punch", type: "indica" as const, terp_profile: ["caryophyllene" as const, "myrcene" as const], description: "Lineage: Larry OG x Granddaddy Purple. Grape candy and berry; dreamy nighttime sedation." },
  { name: "Wedding Crasher", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Wedding Cake x Purple Punch. Vanilla berry cream; blissful, balanced hybrid." },
  { name: "Tropicana Cookies", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Girl Scout Cookies x Tangie. Orange citrus cookie; uplifting, creative mood." },
  { name: "Motor Breath", type: "indica" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chem D x SFV OG Kush. Gas and earth; powerful sedative body lock." },
  { name: "Biscotti", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Gelato #25 x Girl Scout Cookies x Gorilla Glue. Sweet cookie dough; calm, cozy high." },
  { name: "MAC", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Alien Cookies x (Colombian x Starfighter). Citrus cream; balanced euphoric clarity." },
  { name: "London Pound Cake", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Sunset Sherbet x unknown parent. Berry-lemon cake; relaxed, happy mood." },
  { name: "Cereal Milk", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Y Life x Snowman. Creamy sweet milk; balanced uplifting relaxation." },
  { name: "Jealousy", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Gelato #41 x Sherbert Bx1. Creamy orange gas; mellow euphoria." },
  { name: "Slurricane", type: "indica" as const, terp_profile: ["caryophyllene" as const, "myrcene" as const], description: "Lineage: Do-Si-Dos x Purple Punch. Grape berry cream; heavy sedative indica." },
  { name: "Sundae Driver", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Fruity Pebbles OG x Grape Pie. Chocolate cherry cream; balanced relaxed mood." },
  { name: "Rainbow Belts", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Zkittlez x Moonbow. Fruity candy mix; euphoric happy high." },
  { name: "Maui Wowie", type: "sativa" as const, terp_profile: ["limonene" as const, "pinene" as const], description: "Lineage: Hawaiian landrace. Tropical pineapple; energetic island vibes." },
  { name: "Acapulco Gold", type: "sativa" as const, terp_profile: ["caryophyllene" as const, "myrcene" as const], description: "Lineage: Mexican landrace. Burnt toffee honey; uplifting motivational energy." },
  { name: "Panama Red", type: "sativa" as const, terp_profile: ["myrcene" as const, "limonene" as const], description: "Lineage: Panamanian landrace. Earthy citrus spice; clear cerebral focus." },
  { name: "Lamb's Bread", type: "sativa" as const, terp_profile: ["pinene" as const, "caryophyllene" as const], description: "Lineage: Jamaican landrace. Herbal cheese; energizing creative uplift." },
  { name: "Chocolope", type: "sativa" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chocolate Thai x Cannalope Haze. Chocolate coffee; dreamy euphoric energy." },
  { name: "Candyland", type: "sativa" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Granddaddy Purple x Bay Platinum Cookies. Sweet candy citrus; upbeat social energy." },
  { name: "Ghost Train Haze", type: "sativa" as const, terp_profile: ["limonene" as const, "pinene" as const], description: "Lineage: Ghost OG x Neville's Wreck. Citrus pine diesel; powerful cerebral rush." },
  { name: "Sour Tangie", type: "sativa" as const, terp_profile: ["limonene" as const, "myrcene" as const], description: "Lineage: East Coast Sour Diesel x Tangie. Sour tangerine; creative energetic buzz." },
  { name: "Electric Lemonade", type: "sativa" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Lemon Thai x GMO. Zesty lemon sugar; bright focused energy." },
  { name: "Golden Goat", type: "hybrid" as const, terp_profile: ["limonene" as const, "pinene" as const], description: "Lineage: Hawaiian x Romulan x Island Sweet Skunk. Tropical citrus spice; happy uplifting mood." },
  { name: "Space Queen", type: "hybrid" as const, terp_profile: ["pinene" as const, "caryophyllene" as const], description: "Lineage: Romulan x Cinderella 99. Cherry vanilla spice; cerebral dreamy euphoria." },
  { name: "Cosmic Queen", type: "hybrid" as const, terp_profile: ["limonene" as const, "myrcene" as const], description: "Lineage: Space Queen x Afghani. Fruity grape citrus; balanced spacey relaxation." },
  { name: "Stardawg", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chemdawg 4 x Tres Dawg. Diesel earth pine; potent uplifting hybrid." },
  { name: "Black Widow", type: "hybrid" as const, terp_profile: ["pinene" as const, "myrcene" as const], description: "Lineage: Brazilian x South Indian. Pungent pine earth; balanced powerful high." },
  { name: "White Russian", type: "indica" as const, terp_profile: ["myrcene" as const, "pinene" as const], description: "Lineage: White Widow x AK-47. Woody citrus pine; relaxing sedative body feel." },
  { name: "Blackberry Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: Afghani x Blackberry. Dark berry earth; deeply relaxing body stone." },
  { name: "Blueberry Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "linalool" as const], description: "Lineage: Blueberry x OG Kush. Sweet berry pine; soothing full-body calm." },
  { name: "Raspberry Kush", type: "indica" as const, terp_profile: ["myrcene" as const, "caryophyllene" as const], description: "Lineage: Hindu Kush x Raspberry. Tart berry earth; mellow sleepy indica." },
  { name: "Watermelon Zkittlez", type: "indica" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Zkittlez x Watermelon. Fruity melon candy; happy sedative indica." },
  { name: "Peach Crescendo", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Chem Dawg x I-95 x Mandarin Cookies. Peach citrus gas; balanced uplifting buzz." },
  { name: "Peanut Butter Breath", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Do-Si-Dos x Mendobreath. Nutty earth; relaxed sedative hybrid." },
  { name: "Kush Mints", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Bubba Kush x Animal Mints. Minty cookie gas; balanced euphoric calm." },
  { name: "Mendo Breath", type: "indica" as const, terp_profile: ["caryophyllene" as const, "myrcene" as const], description: "Lineage: OG Kush Breath x Mendo Montage. Vanilla caramel earth; heavy sedative body." },
  { name: "Animal Cookies", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Girl Scout Cookies x Fire OG. Sour diesel cookie; potent relaxing high." },
  { name: "Lava Cake", type: "indica" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Thin Mint Cookies x Grape Pie. Chocolate mint earth; powerful sedative stone." },
  { name: "Papaya", type: "indica" as const, terp_profile: ["myrcene" as const, "caryophyllene" as const], description: "Lineage: Citral #13 x Ice #2. Tropical mango papaya; relaxing sleepy indica." },
  { name: "Lemon Meringue", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Lemon Skunk x Cookies x Sour Diesel. Lemon cream pie; uplifting balanced mood." },
  { name: "Bacio Gelato", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Sunset Sherbert x Girl Scout Cookies. Sweet berry cream; euphoric calming high." },
  { name: "Jungle Cake", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Wedding Cake x White Fire #43. Vanilla cream earth; relaxed happy buzz." },
  { name: "Sherbacio", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Sunset Sherbert x Gelato. Orange sherbet cream; mellow euphoric feel." },
  { name: "Georgia Pie", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "humulene" as const], description: "Lineage: Gellati x Kush Mints. Peach cobbler spice; balanced relaxing high." },
  { name: "Apples and Bananas", type: "hybrid" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Platinum Cookies x Granddaddy Purple x Blue Power. Fruity candy; euphoric calm mood." },
  { name: "Chem #4", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chemdawg phenotype. Diesel pine fuel; potent cerebral uplift." },
  { name: "Chem '91", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "myrcene" as const], description: "Lineage: Chemdawg phenotype. Skunky gas earth; powerful heady high." },
  { name: "Motorbreath #15", type: "indica" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Chem D x SFV OG Kush. Gas fuel earth; heavy sedative body lock." },
  { name: "Orange Creamsicle", type: "hybrid" as const, terp_profile: ["limonene" as const, "myrcene" as const], description: "Lineage: Orange Crush x Juicy Fruit. Sweet orange cream; happy uplifting feel." },
  { name: "Cherry Diesel", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Cherry OG x Turbo Diesel. Cherry gas fuel; balanced energetic mood." },
  { name: "Berry White", type: "hybrid" as const, terp_profile: ["myrcene" as const, "pinene" as const], description: "Lineage: Blueberry x White Widow. Sweet berry pine; relaxed mellow high." },
  { name: "Cherry Bomb", type: "sativa" as const, terp_profile: ["caryophyllene" as const, "limonene" as const], description: "Lineage: Cherry Thai x Cherry AK-47. Tart cherry spice; energetic creative buzz." },
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
