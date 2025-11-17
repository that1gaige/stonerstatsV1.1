export type StrainType = "indica" | "sativa" | "hybrid";

export type TerpProfile =
  | "limonene"
  | "myrcene"
  | "pinene"
  | "caryophyllene"
  | "linalool"
  | "humulene"
  | "terpinolene";

export type Method =
  | "joint"
  | "bong"
  | "pipe"
  | "vape"
  | "edible"
  | "dab"
  | "other";

export type EffectTag =
  | "relaxed"
  | "creative"
  | "focused"
  | "sleepy"
  | "euphoric"
  | "hungry"
  | "social"
  | "pain_relief"
  | "energetic"
  | "happy";

export type PrivacyLevel = "public" | "friends" | "private";

export interface User {
  user_id: string;
  display_name: string;
  handle: string;
  avatar_url?: string;
  bio?: string;
  created_at: Date;
  following_user_ids: string[];
  preferences: {
    default_unit: "g" | "mg";
    dark_mode: boolean;
    notifications_enabled: boolean;
    privacy_level: PrivacyLevel;
  };
}

export interface GradientStop {
  position_pct: number;
  hue: number;
  saturation_pct: number;
  lightness_pct: number;
  alpha_pct: number;
}

export interface GradientConfig {
  enabled: boolean;
  type: "linear";
  angle_deg: number;
  blend_mode: "overlay" | "soft-light";
  opacity_pct: number;
  stops: GradientStop[];
}

export interface ColorPalette {
  base_hue: number;
  accent_hue_shift_deg: number;
  saturation_pct: number;
  lightness_pct: number;
  stroke_variant_lightness_delta: number;
  glow_variant_lightness_delta: number;
}

export interface IconRenderParams {
  leaf_count: number;
  leaf_spread_pct: number;
  serration_depth_pct: number;
  stem_length_pct: number;
  rotation_jitter_deg: number;
  stroke_px: number;
  outer_glow_enabled: boolean;
  outer_glow_intensity_pct: number;
  texture_noise_seed: number;
  background_hue: number;
  palette: ColorPalette;
  gradient: GradientConfig;
}

export interface StrainLineage {
  parents: string[];
  children: string[];
  notes: string | null;
}

export interface StrainProvenance {
  source: string;
  id_or_url: string;
}

export interface Strain {
  strain_id: string;
  name: string;
  type: StrainType;
  terp_profile?: TerpProfile[];
  breeder?: string;
  description?: string;
  icon_seed: string;
  icon_render_params: IconRenderParams;
  created_at: Date;
  created_by?: string;
  source?: "developer" | "user";
  aliases?: string[];
  lineage?: StrainLineage;
  provenance?: StrainProvenance[];
  detected_keywords?: string[];
  dominant_hue?: number;
}

export interface SmokeSession {
  session_id: string;
  user_id: string;
  strain_id: string;
  method: Method;
  amount: number;
  amount_unit: "g" | "mg";
  mood_before?: number;
  mood_after?: number;
  effects_tags: EffectTag[];
  notes?: string;
  photo_urls?: string[];
  created_at: Date;
}

export interface Follow {
  follow_id: string;
  follower_id: string;
  followee_id: string;
  created_at: Date;
}

export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export type CardArtVariant = "base" | "foil" | "terp" | "heritage" | "cosmic" | "seasonal";

export type CardShaderType = 
  | "standard_leaf_tint"
  | "high_contrast_pop"
  | "velvet_soft_glow"
  | "vaporwave_gradient"
  | "vintage_muted"
  | "terp_color_bend"
  | "holo_sparkle"
  | "gold_foil"
  | "cosmic_holo"
  | "ripplewave_foil"
  | "crystal_shine"
  | "static_grain_holo"
  | "neon_pulse_foil"
  | "legacy_edition"
  | "420_edition"
  | "deep_forest"
  | "summer_citrus"
  | "mythic_cosmic_rift";

export interface StrainCard {
  card_id: string;
  strain_id: string;
  card_name: string;
  card_number: string;
  set_name: string;
  rarity: CardRarity;
  art_variant: CardArtVariant;
  shader: CardShaderType;
  obtained_at: Date;
  is_favorited: boolean;
  sparks_count?: number;
}

export type PostType = "session" | "card";

export interface FeedPost {
  post_id: string;
  user_id: string;
  post_type: PostType;
  session_id?: string;
  card_id?: string;
  caption?: string;
  created_at: Date;
  sparks_count: number;
  has_sparked: boolean;
}
