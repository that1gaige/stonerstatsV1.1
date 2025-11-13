import { TerpProfile, StrainType } from "@/types";

export const DEMO_STRAINS_DATA = [
  { name: "Blue Dream", type: "hybrid" as const, terp_profile: ["myrcene" as const, "pinene" as const], description: "Lineage: Blueberry x Haze. Balanced hybrid with sweet berry notes; smooth uplift with calm body ease." },
  { name: "Northern Lights", type: "indica" as const, terp_profile: ["pinene" as const, "myrcene" as const], description: "Lineage: Afghani landrace lineage. Classic indica known for deep, serene body calm and pine-leaning aroma." },
  { name: "Sour Diesel", type: "sativa" as const, terp_profile: ["limonene" as const, "caryophyllene" as const], description: "Lineage: Chemdawg x Super Skunk. Pungent, citrus-diesel profile with fast, hazy head lift." },
  { name: "Girl Scout Cookies", type: "hybrid" as const, terp_profile: ["caryophyllene" as const, "limonene" as const, "humulene" as const], description: "Lineage: OG Kush x Durban Poison. Sweet dough and earth; euphoric, cozy hybrid." },
] as const;

export type DemoStrainData = {
  name: string;
  type: StrainType;
  terp_profile: readonly TerpProfile[];
  description: string;
};
