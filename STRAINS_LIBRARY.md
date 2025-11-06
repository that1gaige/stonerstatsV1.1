# 🌿 StonerStats Strain Library

## Overview

The `/strains` folder contains deterministic JSON files for all cannabis strains in the app. Each strain is assigned a unique ID and generates a consistent visual icon based on its identity.

## Demo Strains

The app includes 4 pre-seeded demo strains:

### 1. Blue Dream (Hybrid)
- **Type**: Hybrid
- **Primary Terp**: Myrcene
- **Breeder**: DJ Short
- **Description**: A balanced hybrid with sweet berry aroma. Known for gentle cerebral invigoration and full-body relaxation.
- **Icon Features**: 7 leaflets, medium spread, hybrid green base with gradient overlay

### 2. Northern Lights (Indica)
- **Type**: Indica
- **Primary Terp**: Pinene
- **Breeder**: Sensi Seeds
- **Description**: One of the most famous indica strains. Provides deep relaxation and euphoria with earthy, sweet pine aroma.
- **Icon Features**: 6 leaflets, cool deep blue-purple tones, strong outer glow

### 3. Sour Diesel (Sativa)
- **Type**: Sativa
- **Primary Terp**: Limonene
- **Breeder**: Unknown
- **Description**: Energizing sativa with pungent diesel-like aroma. Fast-acting effects bring dreamy cerebral high.
- **Icon Features**: 9 leaflets, wide spread, warm yellow-orange base

### 4. Girl Scout Cookies (Hybrid)
- **Type**: Hybrid
- **Primary Terp**: Caryophyllene
- **Breeder**: Cookie Fam Genetics
- **Description**: Sweet and earthy hybrid with high potency. Brings waves of euphoria and relaxation.
- **Icon Features**: 8 leaflets, balanced green tones, multi-stop gradient

## File Structure

Each strain JSON file follows schema version 1.1.0:

```json
{
  "schema_version": "1.1.0",
  "strain_id": "string",
  "source": "developer | user",
  "created_by": "user_id | null",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",
  "identity": {
    "name": "string",
    "normalized_name": "string",
    "type": "indica | sativa | hybrid",
    "terp_profile": ["string"],
    "breeder": "string | null"
  },
  "description": "string | null",
  "icon": {
    "icon_seed": "string",
    "icon_render_params": { /* ... */ }
  },
  "integrity": {
    "hash_algorithm": "stable-128-bit",
    "seed_hash_hex": "string",
    "idempotent": true
  }
}
```

## Deterministic Icon Generation

### How It Works

Icons are generated from a **seed string**:
```
icon_seed = "{normalized_name}|{type}|{primary_terp}"
```

Example: `blue dream|hybrid|myrcene`

### Parameters Derived from Seed

The seed is hashed to produce deterministic parameters:

**Leaf Geometry:**
- Leaf count (5-9)
- Spread percentage (0-100)
- Serration depth (0-100)
- Stem length (30-80% of height)
- Rotation jitter (±8° per leaflet)
- Stroke weight (1-4px)

**Visual Effects:**
- Outer glow (on/off + intensity)
- Texture noise overlay

**Color Palette:**
- Base hue by type (indica=blue, sativa=yellow, hybrid=green)
- Accent hue shift (±24°)
- Saturation (50-85%)
- Lightness (30-55%)
- Stroke & glow variants

**Gradient Overlay (conditional):**
- Enabled only when ≥2 descriptors (name tokens + terps)
- 1-5 color stops
- Linear gradient at deterministic angle
- Overlay blend mode at 70-90% opacity

## File Management

### Automatic Operations

- **Create**: When a new strain is added (user or developer)
- **Update**: When strain identity changes
- **Delete**: When a strain is removed

### Utilities

- `utils/iconGenerator.ts` - Generates deterministic icon parameters
- `utils/strainJSONWriter.ts` - Handles file I/O operations
- `utils/seedDemoStrains.ts` - Seeds the 4 demo strains

### Storage Location

All JSON files are stored in `/strains/` at the app root level.

## Example Files

The following example files demonstrate the JSON structure:

- `strains/strain_example_bluedream.json`
- `strains/strain_example_northernlights.json`
- `strains/strain_example_sourdiesel.json`
- `strains/strain_example_gsc.json`

## Usage in App

The app's `AppContext` loads strains on initialization and writes JSON files via `strainJSONWriter` utility whenever strains are created or updated.

Users can view all strains in the **Library** tab, which displays:
- Deterministic strain icon (rendered from params)
- Strain name
- Type chip (indica/sativa/hybrid)
- Primary terpene
- Search and filter capabilities

## Idempotency Guarantee

Same inputs → identical outputs (except timestamps). This ensures:
- Consistent visuals across devices
- Reproducible strain library
- Reliable testing and debugging
- Similar strain names produce visually similar icons
