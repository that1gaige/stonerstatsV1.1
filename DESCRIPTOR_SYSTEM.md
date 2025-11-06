# Strain Descriptor Color Database

This document explains the descriptor-based color generation system for strain icons.

## Overview

The strain icon generator uses a comprehensive database of **descriptive words** commonly found in strain names. Each descriptor is mapped to specific color properties that influence the final icon appearance.

## How It Works

### 1. Descriptor Extraction

When a strain is created, the system:
- **Normalizes the name**: lowercase, removes punctuation, collapses spaces
- **Tokenizes**: splits into individual words
- **Filters**: removes stopwords ("the", "a", "and", etc.) and numbers
- **Adds terpenes**: includes terpene profile as additional descriptors

**Example**: "Blue Dream" → descriptors: `["blue", "dream", "myrcene"]`

### 2. Color Enhancement

Each descriptor in the database has:
- **hue**: Target color hue (0-360)
- **saturationBoost**: Adjustment to saturation (-30 to +30)
- **lightnessBoost**: Adjustment to lightness (-25 to +25)
- **category**: Classification of the descriptor type

### 3. Deterministic Generation

The strain's **unique ID (strain_id)** combined with its name creates a deterministic hash that:
- Always produces the same icon for the same strain
- Uses descriptors to influence gradient colors
- Blends descriptor colors with base type colors (indica/sativa/hybrid)

## Descriptor Database

The database contains **180+ descriptive words** organized into 6 categories:

### Color Descriptors (12)
Words that explicitly describe colors:
- `blue`, `purple`, `red`, `green`, `gold`, `white`, `black`, `pink`, `orange`, `yellow`, `silver`, `platinum`

### Flavor Descriptors (40+)
Taste and aroma profiles:
- **Fruits**: `berry`, `cherry`, `grape`, `lemon`, `lime`, `peach`, `mango`, `pineapple`, `banana`, `strawberry`, `blueberry`, `raspberry`, `watermelon`, `melon`
- **Sweet**: `vanilla`, `chocolate`, `coffee`, `caramel`, `honey`, `cookies`, `cake`, `cream`, `butter`
- **Savory**: `diesel`, `fuel`, `gas`, `sour`, `sweet`, `spice`, `pepper`, `skunk`, `cheese`

### Nature Descriptors (50+)
Natural phenomena and elements:
- **Weather**: `fire`, `ice`, `frost`, `snow`, `storm`, `thunder`, `lightning`
- **Celestial**: `sun`, `moon`, `star`, `sky`, `solar`, `lunar`
- **Landscape**: `mountain`, `forest`, `jungle`, `desert`, `earth`, `rock`, `stone`, `ocean`, `sea`, `river`
- **Flora**: `pine`, `cedar`, `sage`, `herb`, `flower`, `rose`, `lavender`, `jasmine`
- **Geographic**: `northern`, `southern`, `eastern`, `western`, `afghan`, `durban`, `maui`
- **Minerals**: `crystal`, `diamond`, `pearl`

### Emotion Descriptors (15+)
Psychological and experiential words:
- `star`, `dream`, `fantasy`, `magic`, `wonder`, `bliss`, `joy`, `happy`, `euphoria`, `heaven`, `paradise`
- `king`, `queen`, `royal`, `crown`, `emperor`
- `alien`, `space`, `cosmic`, `galactic`
- `girl`, `boy`, `wedding`

### Texture Descriptors (10)
Physical properties:
- `haze`, `glue`, `breath`
- `pure`, `clean`, `smooth`, `rough`, `thick`, `thin`, `dense`, `light`

### Effect Descriptors (5)
Intensity modifiers:
- `super`, `ultra`, `mega`, `extreme`, `power`, `amnesia`

### Strain Family Descriptors (10+)
Famous strain lineages and names:
- `kush`, `og`, `widow`, `jack`, `bubba`, `gorilla`
- `tangie`, `zkittlez`, `gelato`, `sherbet`, `runtz`
- `dos`, `si`, `scout`, `chem`

## Color Influence Examples

### "Blue Dream" (Hybrid)
- **Descriptors**: `blue`, `dream`, `myrcene`
- **blue**: Shifts hue toward 220° (blue), +15 saturation, +5 lightness
- **dream**: Shifts toward 240° (deep blue), +18 saturation, +10 lightness
- **myrcene**: Influences as terpene
- **Result**: Cool blue-tinted hybrid green with dreamy, ethereal quality

### "Sour Diesel" (Sativa)
- **Descriptors**: `sour`, `diesel`, `limonene`
- **sour**: Shifts toward 65° (yellow-green), +20 saturation, +5 lightness
- **diesel**: Shifts toward 50° (yellow), +10 saturation, -10 lightness
- **Result**: Bright, sharp yellow-green with industrial edge

### "Purple Kush" (Indica)
- **Descriptors**: `purple`, `kush`
- **purple**: Shifts toward 280° (purple), +20 saturation, -5 lightness
- **kush**: Shifts toward 105° (green), +12 saturation, -5 lightness
- **Result**: Deep purple-green indica with rich, earthy tones

## Gradient System

When a strain has **2 or more descriptors**, a gradient overlay is generated:

1. **Gradient Enabled**: If descriptors ≥ 2
2. **Color Count**: Up to 5 colors from descriptors
3. **Color Generation**: Each descriptor creates a stop with:
   - Position evenly spaced (0%, 25%, 50%, 75%, 100%)
   - Hue influenced by descriptor database
   - Saturation and lightness boosted by descriptor properties
4. **Blending**: Applied as overlay with 70-90% opacity

## Technical Implementation

### File Structure
- **Database**: `constants/strainDescriptors.ts`
- **Generator**: `utils/iconGenerator.ts`
- **Component**: `components/StrainIcon.tsx`

### Key Functions

```typescript
// Get descriptor color data
getDescriptorColors(word: string): DescriptorColorMap | null

// List all descriptors
getAllDescriptors(): string[]

// Get by category
getDescriptorsByCategory(category: 'color' | 'flavor' | ...): string[]
```

### Storage

Descriptor-influenced colors are stored in each strain's JSON:
- **Location**: `/strains/{strain_id}.json`
- **Icon Seed**: Includes normalized name, type, and primary terp
- **Gradient Stops**: Contains computed colors with descriptor influence
- **Deterministic**: Same seed always produces identical colors

## Adding New Descriptors

To add new descriptors, edit `constants/strainDescriptors.ts`:

```typescript
export const STRAIN_DESCRIPTOR_DATABASE: Record<string, DescriptorColorMap> = {
  // Add new entry
  newword: { 
    hue: 180,              // 0-360 degrees
    saturationBoost: 15,   // -30 to +30
    lightnessBoost: 5,     // -25 to +25
    category: 'flavor'     // color|flavor|nature|emotion|texture|effect
  },
  // ... existing entries
};
```

## Design Philosophy

1. **Deterministic**: Same strain name always produces same icon
2. **Meaningful**: Colors reflect the strain's identity and characteristics
3. **Coherent**: Blends descriptor colors with strain type base colors
4. **Distinct**: Different strains produce visually unique icons
5. **Scalable**: Easy to add new descriptors as strain naming evolves

## Icon Sizing

Icons are rendered with the following size constraints:
- **Default Size**: 48px
- **Display Size**: 75% of default (36px actual render)
- **Centered**: Icons are centered within their container
- **Scalable**: Size prop can be adjusted for different contexts

### Usage Examples

```tsx
// Small icon (library list)
<StrainIcon params={strain.icon_render_params} size={48} />

// Medium icon (detail view)
<StrainIcon params={strain.icon_render_params} size={80} />

// Large icon (feature display)
<StrainIcon params={strain.icon_render_params} size={120} />
```

---

## Summary

The descriptor database creates a **semantic color system** where strain names naturally influence their visual representation. This makes icons:
- **Memorable**: Visual identity matches linguistic identity
- **Consistent**: Same name = same icon, always
- **Discoverable**: Similar names produce similar icons
- **Beautiful**: Colors are aesthetically pleasing and meaningful
