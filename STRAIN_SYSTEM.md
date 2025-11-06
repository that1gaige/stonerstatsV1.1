# 🌿 StonerStats Strain Generation System

## Complete Implementation Guide

This document provides a comprehensive overview of the deterministic strain icon generation system implemented in StonerStats.

---

## 🗂️ File Structure

```
/strains/                              # Strain JSON library folder
  ├── strain_example_bluedream.json    # Blue Dream (hybrid)
  ├── strain_example_northernlights.json  # Northern Lights (indica)
  ├── strain_example_sourdiesel.json   # Sour Diesel (sativa)
  └── strain_example_gsc.json          # Girl Scout Cookies (hybrid)

/utils/
  ├── iconGenerator.ts                 # Core icon parameter generation
  ├── strainJSONWriter.ts              # File I/O operations
  ├── seedDemoStrains.ts               # Demo strain seeding
  └── listStrainsInFolder.ts           # Library inspection utilities

/components/
  └── StrainIcon.tsx                   # React Native SVG icon renderer

/contexts/
  └── AppContext.tsx                   # App state with strain management

/types/
  └── index.ts                         # TypeScript interfaces
```

---

## 🎨 Icon Generation Pipeline

### Step 1: Create Seed String

```typescript
icon_seed = "{normalized_name}|{type}|{primary_terp}"
```

**Example:**
- Input: Name="Blue Dream", Type="hybrid", Terp=["myrcene"]
- Output: `"blue dream|hybrid|myrcene"`

### Step 2: Hash to Bytes

The seed string is hashed into a stable 128-bit digest (14 bytes), providing deterministic randomness.

### Step 3: Map Bytes to Parameters

Each byte maps to a specific visual parameter:

| Byte | Parameter | Range |
|------|-----------|-------|
| 0 | leaf_count | 5-9 |
| 1 | leaf_spread_pct | 0-100 |
| 2 | serration_depth_pct | 0-100 |
| 3 | stem_length_pct | 30-80 |
| 4 | rotation_jitter_deg | ±8 |
| 5 | stroke_px | 1-4 |
| 6 | outer_glow_enabled | even=true |
| 7 | outer_glow_intensity_pct | 10-40 |
| 8 | texture_noise_seed | 0-1 |
| 9 | accent_hue_shift_deg | ±24 |
| 10 | saturation_pct | 50-85 |
| 11 | lightness_pct | 30-55 |
| 12 | gradient_angle_deg | 0-360 (15° steps) |
| 13 | gradient_opacity_pct | 70-90 |

### Step 4: Generate Color Palette

**Base hue by type:**
```typescript
indica  → 240° (deep blues/purples)
sativa  → 60°  (warm yellows/oranges)
hybrid  → 120° (balanced greens)
```

**Derived colors:**
- **Fill**: `hsl(base_hue + accent_shift, saturation, lightness)`
- **Stroke**: Fill with lightness adjusted by -10 to -20
- **Glow**: Fill with lightness adjusted by +15 to +25

### Step 5: Conditional Gradient Overlay

**Enabled when:** ≥2 descriptors (name tokens + terps)

**Descriptor extraction:**
1. Split normalized name on spaces
2. Remove stopwords ("the", "and", "of", etc.)
3. Remove pure numbers
4. Add terpene profile entries

**Example:**
- "Blue Dream" → ["blue", "dream"] + ["myrcene"] = 3 descriptors
- Gradient enabled ✓
- Uses 3 color stops

**Color stop generation:**
Each descriptor hashes to:
- Hue (0-360°, biased toward base hue by 35%)
- Saturation (55-85%)
- Lightness (35-60%)
- Alpha (60-100%)
- Position (evenly distributed 0-100%)

---

## 🔧 Key Functions

### `generateIconParams(name, type, terpProfile)`

**Location:** `utils/iconGenerator.ts`

**Returns:**
```typescript
{
  seed: string,              // e.g., "blue dream|hybrid|myrcene"
  params: IconRenderParams   // Full parameter object
}
```

**Usage:**
```typescript
const { seed, params } = generateIconParams(
  "Blue Dream",
  "hybrid",
  ["myrcene", "pinene"]
);
```

### `createStrain(name, type, options)`

**Location:** `utils/iconGenerator.ts`

**Returns:** Complete `Strain` object with:
- Generated strain_id
- Icon seed & parameters
- Metadata (source, created_at, etc.)

**Usage:**
```typescript
const strain = createStrain("Northern Lights", "indica", {
  terp_profile: ["pinene"],
  breeder: "Sensi Seeds",
  description: "Famous indica strain...",
  source: "developer"
});
```

### `writeStrainJSON(strain)`

**Location:** `utils/strainJSONWriter.ts`

**Effect:** Writes `{strain_id}.json` to `/strains/` folder

**Usage:**
```typescript
await writeStrainJSON(strain);
// Creates: /strains/strain_1730880000000_abc123.json
```

### `seedDemoStrains()`

**Location:** `utils/seedDemoStrains.ts`

**Effect:** Creates all 4 demo strains and writes their JSON files

**Usage:**
```typescript
const strains = await seedDemoStrains();
console.log(`Created ${strains.length} demo strains`);
```

---

## 📊 Demo Strain Parameters

### Blue Dream (Hybrid)
```
Seed: "blue dream|hybrid|myrcene"
Leaves: 7
Spread: 65%
Serration: 42%
Stem: 55%
Hue: ~120° (green)
Gradient: 3 colors (blue, dream, myrcene)
Glow: Enabled (28%)
```

### Northern Lights (Indica)
```
Seed: "northern lights|indica|pinene"
Leaves: 6
Spread: 48%
Serration: 68%
Stem: 62%
Hue: ~240° (blue-purple)
Gradient: 3 colors (northern, lights, pinene)
Glow: Enabled (35%)
```

### Sour Diesel (Sativa)
```
Seed: "sour diesel|sativa|limonene"
Leaves: 9
Spread: 82%
Serration: 55%
Stem: 44%
Hue: ~60° (yellow-orange)
Gradient: 3 colors (sour, diesel, limonene)
Glow: Disabled
```

### Girl Scout Cookies (Hybrid)
```
Seed: "girl scout cookies|hybrid|caryophyllene"
Leaves: 8
Spread: 72%
Serration: 58%
Stem: 58%
Hue: ~120° (green)
Gradient: 5 colors (girl, scout, cookies + caryophyllene)
Glow: Enabled (22%)
```

---

## 🎯 Rendering the Icon

The `StrainIcon` component (`components/StrainIcon.tsx`) takes the generated parameters and renders:

1. **Glow layer** (if enabled) - Radial gradient background
2. **Stem** - Vertical line from center
3. **Leaves** - Each leaf is a bezier curve path with:
   - Deterministic rotation
   - Optional serrations
   - Base fill or gradient overlay
   - Stroke outline

**Usage:**
```tsx
<StrainIcon 
  params={strain.icon_render_params} 
  size={56} 
/>
```

---

## ✅ Deterministic Guarantees

### Same Input → Same Output

Given identical inputs:
- `name`: "Blue Dream"
- `type`: "hybrid"
- `terp_profile`: ["myrcene"]

The system **always** produces:
- Same icon_seed
- Same hash bytes
- Same visual parameters
- Same gradient stops
- Same rendered appearance

**Exceptions:** Timestamps (`created_at`, `updated_at`)

### Similar Names → Similar Visuals

Strains with similar names produce visually related icons:
- "Blue Dream" vs "Blue Dreams" → Very similar
- "Northern Lights" vs "Northern Light" → Very similar

This is achieved through:
- Normalization (lowercase, trim, collapse spaces)
- Consistent hashing
- Base hue determined by type

---

## 🧪 Testing the System

### View All Strains
```typescript
import { listAllStrainFiles } from '@/utils/listStrainsInFolder';

await listAllStrainFiles();
// Outputs detailed list of all JSON files
```

### Create Custom Strain
```typescript
import { createStrain } from '@/utils/iconGenerator';
import { writeStrainJSON } from '@/utils/strainJSONWriter';

const custom = createStrain("Purple Haze", "sativa", {
  terp_profile: ["caryophyllene", "humulene"],
  breeder: "Unknown",
  description: "Legendary sativa strain",
  source: "user"
});

await writeStrainJSON(custom);
```

### Verify Idempotency
```typescript
const strain1 = createStrain("Test", "hybrid", { terp_profile: ["limonene"] });
const strain2 = createStrain("Test", "hybrid", { terp_profile: ["limonene"] });

// These should be identical (except strain_id and timestamps):
console.log(strain1.icon_seed === strain2.icon_seed); // true
console.log(JSON.stringify(strain1.icon_render_params) === 
            JSON.stringify(strain2.icon_render_params)); // true
```

---

## 📱 Integration with App

### AppContext Integration

The `AppContext` (`contexts/AppContext.tsx`) handles:
- Loading strains from AsyncStorage
- Seeding demo strains on first run
- Writing JSON files automatically
- Providing `addStrain()` function

### Library Screen

The Library tab (`app/(tabs)/library.tsx`) displays:
- All strains with rendered icons
- Search functionality
- Type filters (indica/sativa/hybrid)
- Terpene display

### Adding New Strains

When users create strains in the app:
1. Call `createStrain()` with user inputs
2. Call `addStrain()` from AppContext
3. JSON file is automatically written to `/strains/`
4. Icon appears immediately in Library

---

## 🎨 Visual Examples

### Type-Based Color Families

**Indica strains** (cool tones):
- Base hue: 220-260° (blues, purples)
- Examples: Northern Lights, Granddaddy Purple

**Sativa strains** (warm tones):
- Base hue: 40-80° (yellows, oranges)
- Examples: Sour Diesel, Jack Herer

**Hybrid strains** (balanced greens):
- Base hue: 100-140° (greens)
- Examples: Blue Dream, Girl Scout Cookies

### Gradient Behavior

**No gradient:**
- Single-word names with no terps
- Example: "Kush" (0 descriptors)

**Simple gradient:**
- Two-word names or one word + terp
- Example: "OG Kush" (2 descriptors) → 2 colors

**Complex gradient:**
- Multi-word names with terps
- Example: "Girl Scout Cookies" + caryophyllene (4 descriptors) → 4 colors

---

## 🚀 Next Steps

1. **View the Library**: Launch the app and tap the Library tab
2. **Inspect JSON Files**: Check `/strains/` folder for generated files
3. **Create Custom Strains**: Use the Log tab to add new strains
4. **Verify Consistency**: Create the same strain twice and compare JSON files

---

## 📖 Related Documentation

- `STRAINS_LIBRARY.md` - Overview of the strain library
- `types/index.ts` - TypeScript type definitions
- `utils/iconGenerator.ts` - Implementation details
- `strains/*.json` - Example strain JSON files

---

**Built for StonerStats** 🌿  
Deterministic. Beautiful. Consistent.
