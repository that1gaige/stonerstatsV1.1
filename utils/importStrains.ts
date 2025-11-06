import { Strain, StrainType, TerpProfile } from "@/types";
import { createStrain } from "@/utils/iconGenerator";
import { DEMO_STRAINS_DATA } from "@/utils/seedDemoStrains";

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
  const cleaned = path.replace(/^\/+/, "");
  const atIdx = cleaned.indexOf("@");
  if (atIdx === -1) {
    return [
      `https://cdn.jsdelivr.net/gh/${cleaned}`,
    ];
  }
  const before = cleaned.slice(0, atIdx); // owner/repo
  const after = cleaned.slice(atIdx + 1); // branch/path
  const slashIdx = after.indexOf("/");
  const branch = slashIdx === -1 ? after : after.slice(0, slashIdx);
  const filePath = slashIdx === -1 ? "" : after.slice(slashIdx + 1);
  const [owner, repo] = before.split("/");

  const urls: string[] = [];
  if (owner && repo && branch && filePath) {
    urls.push(
      `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`,
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`,
      `https://raw.githack.com/${owner}/${repo}/${branch}/${filePath}`,
    );
  } else {
    urls.push(`https://cdn.jsdelivr.net/gh/${cleaned}`);
  }
  return urls;
}

async function fetchJsonWithFallback(path: string): Promise<any> {
  const urls = buildMirrors(path);
  let lastErr: unknown = null;
  for (const url of urls) {
    try {
      const controller = new AbortSignalController();
      const resp = await timedFetch(url, controller, 15000);
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

class AbortSignalController {
  controller: AbortController;
  timeoutId: number | null;
  constructor() {
    this.controller = new AbortController();
    this.timeoutId = null;
  }
  get signal() { return this.controller.signal; }
  abort() { this.controller.abort(); if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; } }
}

async function timedFetch(url: string, controller: AbortSignalController, ms: number): Promise<Response> {
  controller.timeoutId = setTimeout(() => controller.abort(), ms) as unknown as number;
  try {
    return await fetch(url, { signal: controller.signal } as RequestInit);
  } finally {
    if (controller.timeoutId) clearTimeout(controller.timeoutId);
  }
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

function localFallbackRows(): ExternalStrain[] {
  return DEMO_STRAINS_DATA.map(d => ({ name: d.name, type: d.type, terpenes: d.terp_profile as unknown as string[], description: d.description ?? undefined }));
}

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

  if (created.length === 0) {
    try {
      const rows = localFallbackRows();
      for (const row of rows) {
        const name = row.name;
        if (!name || existingByName.has(name.toLowerCase())) { skipped++; continue; }
        const t = normalizeType(row.type ?? undefined) ?? "hybrid";
        const terps = normalizeTerpenes(row.terpenes);
        const strain = createStrain(name, t, {
          terp_profile: terps,
          description: row.description ?? undefined,
          source: "developer",
        });
        created.push(strain);
        existingByName.set(name.toLowerCase(), true);
      }
      errors = 0;
    } catch {}
  }

  return { created, skipped, errors };
}
