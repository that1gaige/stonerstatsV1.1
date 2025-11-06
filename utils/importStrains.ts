import { Strain, StrainType, TerpProfile } from "@/types";
import { createStrain } from "@/utils/iconGenerator";

export type ExternalStrain = {
  name: string;
  type?: string;
  terpenes?: string[];
  breeder?: string | null;
  description?: string | null;
  lineage?: { parents?: string[]; children?: string[]; notes?: string | null } | null;
  aliases?: string[] | null;
};

const TERP_MAP: Record<string, TerpProfile> = {
  limonene: "limonene",
  myrcene: "myrcene",
  pinene: "pinene",
  caryophyllene: "caryophyllene",
  linalool: "linalool",
  humulene: "humulene",
  terpinolene: "terpinolene",
};

function normalizeType(input?: string): StrainType | null {
  if (!input) return null;
  const v = input.toLowerCase();
  if (v.includes("indica")) return "indica";
  if (v.includes("sativa")) return "sativa";
  if (v.includes("hybrid") || v.includes("mix")) return "hybrid";
  return null;
}

function normalizeTerpenes(terps?: string[]): TerpProfile[] | undefined {
  if (!terps || terps.length === 0) return undefined;
  const mapped: TerpProfile[] = [];
  for (const t of terps) {
    const key = t.toLowerCase().trim();
    if (TERP_MAP[key]) mapped.push(TERP_MAP[key]);
  }
  return mapped.length ? Array.from(new Set(mapped)) : undefined;
}

export type ImportSource = {
  id: string;
  url: string;
  parser: (json: any) => ExternalStrain[];
};

export const PUBLIC_SOURCES: ImportSource[] = [
  {
    id: "open-strains-1",
    url: "https://raw.githubusercontent.com/public-datasets-rork/cannabis-strains/main/strains-basic.json",
    parser(json: any): ExternalStrain[] {
      if (!Array.isArray(json)) return [];
      return json.map((item) => ({
        name: String(item.name ?? "").trim(),
        type: typeof item.type === "string" ? item.type : undefined,
        terpenes: Array.isArray(item.terpenes) ? item.terpenes : undefined,
        breeder: typeof item.breeder === "string" ? item.breeder : null,
        description: typeof item.description === "string" ? item.description : null,
        lineage: item.lineage && typeof item.lineage === "object" ? {
          parents: Array.isArray(item.lineage.parents) ? item.lineage.parents : [],
          children: Array.isArray(item.lineage.children) ? item.lineage.children : [],
          notes: typeof item.lineage.notes === "string" ? item.lineage.notes : null,
        } : null,
        aliases: Array.isArray(item.aliases) ? item.aliases : null,
      }));
    },
  },
  {
    id: "open-strains-2",
    url: "https://raw.githubusercontent.com/public-datasets-rork/cannabis-strains/main/strains-terpenes.json",
    parser(json: any): ExternalStrain[] {
      if (!Array.isArray(json)) return [];
      return json.map((item) => ({
        name: String(item.name ?? "").trim(),
        type: typeof item.category === "string" ? item.category : undefined,
        terpenes: Array.isArray(item.terpenes) ? item.terpenes : undefined,
        breeder: typeof item.breeder === "string" ? item.breeder : null,
        description: typeof item.notes === "string" ? item.notes : null,
        lineage: null,
        aliases: null,
      }));
    },
  },
];

export type ImportResult = {
  created: Strain[];
  skipped: number;
  errors: number;
};

export async function importFromSources(existing: Strain[], sources: ImportSource[] = PUBLIC_SOURCES): Promise<ImportResult> {
  const created: Strain[] = [];
  let skipped = 0;
  let errors = 0;

  const existingByName = new Map(
    existing.map((s) => [s.name.toLowerCase().trim(), true as const])
  );

  for (const source of sources) {
    try {
      const resp = await fetch(source.url);
      if (!resp.ok) {
        console.warn(`[Import] ${source.id} failed: ${resp.status}`);
        errors++;
        continue;
      }
      const json = await resp.json();
      const rows = source.parser(json);

      for (const row of rows) {
        const name = row.name;
        if (!name || existingByName.has(name.toLowerCase())) {
          skipped++;
          continue;
        }
        const t = normalizeType(row.type ?? undefined) ?? "hybrid";
        const terps = normalizeTerpenes(row.terpenes);
        try {
          const strain = createStrain(name, t, {
            terp_profile: terps,
            breeder: row.breeder ?? undefined,
            description: row.description ?? undefined,
            aliases: (row.aliases ?? undefined) as string[] | undefined,
            lineage: row.lineage ? { parents: row.lineage.parents ?? [], children: row.lineage.children ?? [], notes: row.lineage.notes ?? null } : undefined,
            source: "developer",
          });
          created.push(strain);
          existingByName.set(name.toLowerCase(), true);
        } catch (e) {
          console.error("[Import] failed to create strain", name, e);
          errors++;
        }
      }
    } catch (e) {
      console.error(`[Import] Source ${source.id} error`, e);
      errors++;
    }
  }

  return { created, skipped, errors };
}
