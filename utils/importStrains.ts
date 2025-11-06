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
  path: string;
  parser: (json: any) => ExternalStrain[];
};

function buildMirrors(path: string): string[] {
  const normalized = path.replace(/^\/+/, "");
  return [
    `https://cdn.jsdelivr.net/gh/${normalized}`,
    `https://raw.githubusercontent.com/${normalized.replace('@main/', 'main/')}`,
    `https://githack.com/${normalized.replace('@main/', '/blob/main/')}`,
  ];
}

async function fetchJsonWithFallback(path: string): Promise<any> {
  const urls = buildMirrors(path);
  let lastErr: unknown = null;
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 12000);
      const resp = await fetch(url, { mode: 'cors', signal: controller.signal } as RequestInit);
      clearTimeout(t);
      if (!resp.ok) {
        console.warn(`[Import] Mirror responded ${resp.status} for ${url}`);
        lastErr = new Error(`HTTP ${resp.status}`);
        continue;
      }
      return await resp.json();
    } catch (e) {
      console.warn(`[Import] Mirror failed for ${url}`, e);
      lastErr = e;
      continue;
    }
  }
  throw lastErr ?? new Error('All mirrors failed');
}

export const PUBLIC_SOURCES: ImportSource[] = [
  {
    id: "open-strains-1",
    path: "public-datasets-rork/cannabis-strains@main/strains-basic.json",
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
    path: "public-datasets-rork/cannabis-strains@main/strains-terpenes.json",
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
  {
    id: "open-strains-3",
    path: "public-datasets-rork/cannabis-strains@main/strains-extended.json",
    parser(json: any): ExternalStrain[] {
      if (!Array.isArray(json)) return [];
      return json.map((row) => ({
        name: String(row.name ?? "").trim(),
        type: typeof row.type === "string" ? row.type : (typeof row.category === "string" ? row.category : undefined),
        terpenes: Array.isArray(row.terpenes) ? row.terpenes : (Array.isArray(row.top_terpenes) ? row.top_terpenes : undefined),
        breeder: typeof row.breeder === "string" ? row.breeder : null,
        description: typeof row.description === "string" ? row.description : (typeof row.notes === "string" ? row.notes : null),
        lineage: row.lineage && typeof row.lineage === "object" ? {
          parents: Array.isArray(row.lineage.parents) ? row.lineage.parents : [],
          children: Array.isArray(row.lineage.children) ? row.lineage.children : [],
          notes: typeof row.lineage.notes === "string" ? row.lineage.notes : null,
        } : null,
        aliases: Array.isArray(row.aliases) ? row.aliases : null,
      }));
    },
  },
  {
    id: "open-strains-4",
    path: "public-datasets-rork/cannabis-strains@main/strains-more.json",
    parser(json: any): ExternalStrain[] {
      if (!json) return [];
      const arr = Array.isArray(json) ? json : (Array.isArray(json.items) ? json.items : []);
      return arr.map((item: any) => ({
        name: String((item.title ?? item.name) ?? "").trim(),
        type: typeof item.type === "string" ? item.type : (typeof item.family === "string" ? item.family : undefined),
        terpenes: Array.isArray(item.terpenes) ? item.terpenes : (Array.isArray(item.chem_profile) ? item.chem_profile : undefined),
        breeder: typeof item.breeder === "string" ? item.breeder : null,
        description: typeof item.desc === "string" ? item.desc : (typeof item.description === "string" ? item.description : null),
        lineage: null,
        aliases: Array.isArray(item.aliases) ? item.aliases : null,
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
      const json = await fetchJsonWithFallback(source.path);
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
