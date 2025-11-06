import { IconRenderParams, Strain, StrainType, TerpProfile, GradientStop, ColorPalette, GradientConfig } from "@/types";
import { STOPWORDS, getDescriptorColors } from "@/constants/strainDescriptors";

function simpleHashBytes(str: string, byteCount: number = 16): number[] {
  const bytes: number[] = [];
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 ^= c;
    h1 = (h1 * 16777619) >>> 0;
    h2 ^= (c << (i % 8));
    h2 = (h2 * 2246822519) >>> 0;
  }
  let seed = (h1 ^ h2) >>> 0;
  for (let i = 0; i < byteCount; i++) {
    seed = (seed ^ (seed >>> 13)) >>> 0;
    seed = (seed * 0x5bd1e995) >>> 0;
    bytes.push(seed & 0xff);
  }
  return bytes;
}

export function normalizeStrainName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function hashStringInt(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function uuidFromName(name: string): string {
  let bytes = simpleHashBytes(name, 16);
  const allZero = bytes.every((b) => b === 0);
  if (allZero) {
    bytes = simpleHashBytes(`${name}|fallback|${hashStringInt(name)}`, 16);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0"));
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
}

function neutralHueFromName(name: string): number {
  const h = hashStringInt(name);
  return h % 360;
}

function createIconSeedFromId(normalizedName: string, strainId: string): string {
  return `${normalizedName}|${strainId.substring(0, 8)}`;
}

function mapByteToRange(byte: number, min: number, max: number): number {
  return min + (byte / 255) * (max - min);
}

function extractDescriptors(name: string, terpProfile?: TerpProfile[]): string[] {
  const descriptors: string[] = [];
  const normalized = normalizeStrainName(name);
  const nameTokens = normalized.split(" ").filter((token) => {
    return token.length > 0 && !STOPWORDS.has(token) && !/^\d+$/.test(token);
  });
  descriptors.push(...nameTokens);
  if (terpProfile && terpProfile.length > 0) {
    descriptors.push(...terpProfile);
  }
  return descriptors;
}

const MULTICOLOR_KEYWORDS: Record<string, number[]> = {
  apple: [110, 5],
  mango: [36, 55],
  sunrise: [35, 15, 52],
  sunset: [15, 35, 52],
  rainbow: [0, 35, 55, 120, 200, 260, 300],
};

function isMultiColorWord(word: string): boolean {
  return Object.prototype.hasOwnProperty.call(MULTICOLOR_KEYWORDS, word.toLowerCase());
}

function getMultiColorHues(word: string): number[] {
  const list = MULTICOLOR_KEYWORDS[word.toLowerCase()];
  return list ? [...list] : [];
}

function enhanceColorWithDescriptor(
  baseHue: number,
  baseSat: number,
  baseLight: number,
  descriptor: string
): { hue: number; saturation: number; lightness: number } {
  const desc = descriptor.toLowerCase().trim();
  if (desc.startsWith("virtual:hue:")) {
    const parts = desc.split(":");
    const hueVal = Number(parts[2]);
    return { hue: (hueVal + 360) % 360, saturation: baseSat, lightness: baseLight };
  }

  const descriptorData = getDescriptorColors(desc);
  if (!descriptorData) {
    return { hue: baseHue, saturation: baseSat, lightness: baseLight };
  }
  const hue = (descriptorData.hue + 360) % 360;
  let saturation = Math.max(0, Math.min(100, baseSat + descriptorData.saturationBoost));
  let lightness = Math.max(0, Math.min(100, baseLight + descriptorData.lightnessBoost));

  if (desc === 'white' || desc === 'silver' || desc === 'platinum' || desc === 'frost' || desc === 'snow' || desc === 'widow') {
    saturation = Math.min(saturation, 8);
    lightness = Math.max(lightness, 88);
  } else if (desc === 'black' || desc === 'midnight' || desc === 'night') {
    saturation = Math.min(saturation, 12);
    lightness = Math.min(lightness, 18);
  } else if (desc === 'gray' || desc === 'grey' || desc === 'smoke' || desc === 'cloud' || desc === 'cloudy') {
    saturation = Math.min(saturation, 16);
    lightness = Math.max(48, Math.min(lightness, 62));
  }

  return { hue, saturation, lightness };
}

function hslaToHex(h: number, s: number, l: number, a: number = 1): string {
  const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}

function generateGradient(
  descriptors: string[],
  baseHue: number,
  baseSat: number,
  baseLight: number,
  digest: number[]
): GradientConfig {
  const descriptorCount = descriptors.length;
  if (descriptorCount < 1) {
    return {
      enabled: false,
      type: "linear",
      angle_deg: 0,
      blend_mode: "overlay",
      opacity_pct: 0,
      stops: [],
    };
  }
  const gradientColorCount = Math.min(6, descriptorCount);
  const stops: GradientStop[] = [];
  for (let i = 0; i < gradientColorCount; i++) {
    const descriptor = descriptors[i];
    const descBytes = simpleHashBytes(`${descriptor}`);
    const hue = enhanceColorWithDescriptor(baseHue, baseSat, baseLight, descriptor).hue;
    const saturation = mapByteToRange(descBytes[1] % 256, 55, 85);
    const lightness = mapByteToRange(descBytes[2] % 256, 35, 60);
    const isTopColor = i === 0;
    const alpha = isTopColor ? mapByteToRange(descBytes[3] % 256, 70, 90) : mapByteToRange(descBytes[3] % 256, 50, 85);
    const position = (i / Math.max(1, gradientColorCount - 1)) * 100;
    stops.push({
      position_pct: position,
      hue: Math.round(hue),
      saturation_pct: Math.round(saturation),
      lightness_pct: Math.round(lightness),
      alpha_pct: Math.round(alpha),
    });
  }
  const angle = Math.round(((digest[12] ?? 0) / 255) * 360 / 15) * 15;
  const opacity = mapByteToRange((digest[13] ?? 0) % 256, 70, 90);
  return {
    enabled: true,
    type: "linear",
    angle_deg: angle,
    blend_mode: "overlay",
    opacity_pct: Math.round(opacity),
    stops,
  };
}

export function generateIconParams(
  name: string,
  type: StrainType,
  terpProfile?: TerpProfile[],
  breeder?: string
): { seed: string; params: IconRenderParams; detectedKeywords: string[]; dominantHue: number } {
  const normalized = normalizeStrainName(name);
  const terpKey = (terpProfile && terpProfile.length > 0) ? terpProfile.slice().sort().join(',') : 'no-terps';
  const idInput = `${normalized}|${terpKey}`;
  const strainId = uuidFromName(`stonerstats.strain.v2|${idInput}`);
  const seed = createIconSeedFromId(normalized, strainId);
  const digest = simpleHashBytes(seed, 14);

  const baseSat = mapByteToRange(digest[10] % 256, 50, 85);
  const baseLight = mapByteToRange(digest[11] % 256, 30, 55);

  const rawDescriptors = extractDescriptors(name, terpProfile);

  let workingDescriptors: string[] = [];
  let dominantHue = neutralHueFromName(normalized);
  let finalSat = baseSat;
  let finalLight = baseLight;

  if (rawDescriptors.length > 0) {
    const primaryWord = rawDescriptors[0].toLowerCase();
    if (isMultiColorWord(primaryWord)) {
      const hues = getMultiColorHues(primaryWord);
      const pickIdx = hashStringInt(seed) % hues.length;
      dominantHue = hues[pickIdx];
      const secondaryHues = hues.filter((_, i) => i !== pickIdx);
      workingDescriptors.push(...secondaryHues.map(h => `virtual:hue:${h}`));
    } else {
      const enhanced = enhanceColorWithDescriptor(dominantHue, baseSat, baseLight, primaryWord);
      dominantHue = Math.round(enhanced.hue);
      finalSat = enhanced.saturation;
      finalLight = enhanced.lightness;
    }

    for (let i = 1; i < rawDescriptors.length; i++) {
      const w = rawDescriptors[i].toLowerCase();
      if (isMultiColorWord(w)) {
        const hues = getMultiColorHues(w);
        workingDescriptors.push(...hues.map(h => `virtual:hue:${h}`));
      } else {
        workingDescriptors.push(w);
      }
    }

    for (const d of rawDescriptors) {
      const dl = d.toLowerCase();
      if (dl === 'white' || dl === 'silver' || dl === 'platinum' || dl === 'frost' || dl === 'snow' || dl === 'widow') {
        finalSat = Math.min(finalSat, 8);
        finalLight = Math.max(finalLight, 90);
      } else if (dl === 'black' || dl === 'midnight' || dl === 'night') {
        finalSat = Math.min(finalSat, 12);
        finalLight = Math.min(finalLight, 18);
      } else if (dl === 'gray' || dl === 'grey' || dl === 'smoke' || dl === 'cloud' || dl === 'cloudy') {
        finalSat = Math.min(finalSat, 16);
        finalLight = Math.max(48, Math.min(finalLight, 62));
      }
    }
  }

  const uuidHue = hashStringInt(strainId) % 360;
  const contrastedUuidHue = (uuidHue + 180 + ((digest[9] % 60) - 30)) % 360;
  workingDescriptors.push(`virtual:hue:${contrastedUuidHue}`);

  const palette: ColorPalette = {
    base_hue: Math.round(dominantHue),
    accent_hue_shift_deg: ((digest[9] % 24) - 12),
    saturation_pct: Math.round(finalSat),
    lightness_pct: Math.round(finalLight),
    stroke_variant_lightness_delta: -15,
    glow_variant_lightness_delta: 20,
  };

  let gradient = generateGradient(workingDescriptors, dominantHue, finalSat, finalLight, digest);
  const hasNeutral = rawDescriptors.some(d => {
    const w = d.toLowerCase();
    return w === 'white' || w === 'silver' || w === 'platinum' || w === 'frost' || w === 'snow' || w === 'black' || w === 'midnight' || w === 'night' || w === 'gray' || w === 'grey' || w === 'smoke' || w === 'cloud' || w === 'cloudy';
  });
  if (hasNeutral) {
    gradient = { enabled: false, type: 'linear', angle_deg: 0, blend_mode: 'overlay', opacity_pct: 0, stops: [] };
  }

  return {
    seed,
    params: {
      leaf_count: 7,
      leaf_spread_pct: 60,
      serration_depth_pct: 70,
      stem_length_pct: 45,
      rotation_jitter_deg: 0,
      stroke_px: 2,
      outer_glow_enabled: (digest[6] % 2) === 0,
      outer_glow_intensity_pct: Math.round(mapByteToRange(digest[7] % 256, 10, 40)),
      texture_noise_seed: (digest[8] ?? 0) / 255,
      background_hue: Math.round(dominantHue),
      palette,
      gradient,
    },
    detectedKeywords: rawDescriptors,
    dominantHue: Math.round(dominantHue),
  };
}

function toHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateStrainJSON(strain: Strain): string {
  const normalized = normalizeStrainName(strain.name);
  const params = strain.icon_render_params;

  const gradient = params.gradient;
  const gradientHexColors = gradient.enabled
    ? gradient.stops.map((s) => hslaToHex(s.hue, s.saturation_pct, s.lightness_pct, s.alpha_pct / 100))
    : [];

  const json = {
    schema_version: "1.8.0",
    strain_id: strain.strain_id,
    identity: {
      name: strain.name,
      normalized_name: normalized,
      breeder: strain.breeder ?? null,
      aliases: strain.aliases ?? [],
    },
    terp_profile: strain.terp_profile ?? [],
    lineage: strain.lineage ?? { parents: [], children: [], notes: null },
    description: strain.description ?? null,
    icon: {
      dominant_color_hue: params.palette.base_hue,
      gradient: {
        enabled: gradient.enabled,
        colors: gradientHexColors,
        angle_deg: gradient.angle_deg,
      },
      effects: {
        leaf_count: 7,
        outer_glow: params.outer_glow_enabled,
        stroke: {
          enabled: true,
          color: hslaToHex(params.palette.base_hue, params.palette.saturation_pct, Math.max(0, params.palette.lightness_pct - 20)),
          width_px: Math.max(1, Math.round(params.stroke_px)),
        },
      },
    },
    created_at: strain.created_at.toISOString(),
    updated_at: new Date().toISOString(),
  };

  return JSON.stringify(json, null, 2);
}

export function createStrain(
  name: string,
  type: StrainType,
  options?: {
    terp_profile?: TerpProfile[];
    breeder?: string;
    description?: string;
    created_by?: string;
    source?: "developer" | "user";
    aliases?: string[];
    lineage?: { parents: string[]; children: string[]; notes: string | null };
    provenance?: { source: string; id_or_url: string }[];
  }
): Strain {
  const normalized = normalizeStrainName(name);
  const terpKey = (options?.terp_profile && options.terp_profile.length > 0) ? options.terp_profile.slice().sort().join(',') : 'no-terps';
  const idInput = `${normalized}|${terpKey}`;
  const strain_id = uuidFromName(`stonerstats.strain.v2|${idInput}`);
  const { seed, params, detectedKeywords, dominantHue } = generateIconParams(name, type, options?.terp_profile, options?.breeder);

  return {
    strain_id,
    name,
    type,
    terp_profile: options?.terp_profile,
    breeder: options?.breeder,
    description: options?.description,
    icon_seed: seed,
    icon_render_params: params,
    created_at: new Date(),
    created_by: options?.created_by,
    source: options?.source || "developer",
    aliases: options?.aliases ?? [],
    lineage: options?.lineage ?? { parents: [], children: [], notes: null },
    provenance: options?.provenance ?? [],
    detected_keywords: detectedKeywords,
    dominant_hue: dominantHue,
  } as Strain;
}
