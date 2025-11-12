import { Platform, StyleSheet, View, ImageSourcePropType } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { IconRenderParams, GradientStop } from "@/types";

interface StrainIconProps {
  params: IconRenderParams;
  size?: number;
  baseLeafSource?: ImageSourcePropType;
  fillSeedUUID?: string;
  testID?: string;
}

function hashStringInt(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

export function StrainIcon({ params, size = 64, baseLeafSource, fillSeedUUID, testID }: StrainIconProps) {
  const {
    stroke_px,
    outer_glow_enabled,
    outer_glow_intensity_pct,
    palette,
    gradient,
  } = params;

  const uuidHue = typeof fillSeedUUID === 'string' && fillSeedUUID.length > 0
    ? (hashStringInt(fillSeedUUID) % 360)
    : (palette.base_hue + palette.accent_hue_shift_deg + 360) % 360;

  const leafHue = (palette.base_hue + 360) % 360;
  const tintColor = `hsl(${leafHue}, ${palette.saturation_pct}%, ${palette.lightness_pct}%)`;
  const strokeColor = `hsl(${leafHue}, ${palette.saturation_pct}%, ${Math.max(0, palette.lightness_pct - 20)}%)`;

  const radius = Math.round(size / 2);

  const leafSource: ImageSourcePropType = baseLeafSource ?? require("@/assets/images/icontemp.png");

  const backgroundStops: GradientStop[] = (() => {
    if (!gradient.enabled) return [];
    const sorted = [...gradient.stops].sort((a, b) => a.position_pct - b.position_pct);
    const leafHue = (palette.base_hue + 360) % 360;
    const filtered = sorted.filter((s) => Math.abs(((s.hue - leafHue + 540) % 360) - 180) > 8);
    return filtered.length > 0 ? filtered : sorted.slice(1);
  })();

  const leafSize = Math.floor(size * 0.96);
  const strokeSize = Math.min(
    Math.floor(size * 0.99),
    leafSize + Math.max(2, Math.round(stroke_px * 2))
  );

  return (
    <View
      testID={testID ?? "strain-icon"}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      {gradient.enabled && backgroundStops.length > 0 ? (
        (() => {
          const colorsArr = backgroundStops.map(s => `hsla(${s.hue}, ${s.saturation_pct}%, ${s.lightness_pct}%, ${s.alpha_pct / 100})`);
          const first = colorsArr[0] ?? tintColor;
          const last = colorsArr[colorsArr.length - 1] ?? tintColor;
          const rest = colorsArr.slice(1, Math.max(1, colorsArr.length - 1));
          const gradientColors = [first, last, ...rest] as const;
          return (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientBg, { width: size, height: size, borderRadius: radius }]}
              pointerEvents="none"
            />
          );
        })()
      ) : (
        <View
          style={[
            styles.solidBg,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: `hsla(${uuidHue}, ${palette.saturation_pct}%, ${Math.min(95, palette.lightness_pct + 25)}%, 0.18)`,
            },
          ]}
          pointerEvents="none"
        />
      )}

      <Image
        testID="strain-icon-stroke"
        source={leafSource}
        contentFit="contain"
        tintColor={strokeColor}
        style={[
          styles.leafStroke,
          {
            width: strokeSize,
            height: strokeSize,
            backgroundColor: 'transparent',
            filter:
              Platform.OS === 'web'
                ? ("drop-shadow(0 0 0 " + strokeColor + ") drop-shadow(0 0 " + Math.max(1, Math.round(stroke_px)) + "px " + strokeColor + ")" as unknown as any)
                : undefined,
          },
        ]}
        transition={0}
      />

      {outer_glow_enabled && Platform.OS !== 'web' && (
        <>
          <Image
            testID="strain-icon-glow-1"
            source={leafSource}
            contentFit="contain"
            tintColor={tintColor}
            style={{
              position: 'absolute',
              width: Math.round(leafSize * 1.06),
              height: Math.round(leafSize * 1.06),
              opacity: Math.min(0.35, outer_glow_intensity_pct / 120),
              backgroundColor: 'transparent',
            }}
            transition={0}
          />
          <Image
            testID="strain-icon-glow-2"
            source={leafSource}
            contentFit="contain"
            tintColor={tintColor}
            style={{
              position: 'absolute',
              width: Math.round(leafSize * 1.12),
              height: Math.round(leafSize * 1.12),
              opacity: Math.min(0.22, outer_glow_intensity_pct / 140),
              backgroundColor: 'transparent',
            }}
            transition={0}
          />
          <Image
            testID="strain-icon-glow-3"
            source={leafSource}
            contentFit="contain"
            tintColor={tintColor}
            style={{
              position: 'absolute',
              width: Math.round(leafSize * 1.18),
              height: Math.round(leafSize * 1.18),
              opacity: Math.min(0.12, outer_glow_intensity_pct / 160),
              backgroundColor: 'transparent',
            }}
            transition={0}
          />
        </>
      )}

      <Image
        testID="strain-icon-leaf"
        source={leafSource}
        contentFit="contain"
        tintColor={tintColor}
        style={[
          styles.leaf,
          {
            width: leafSize,
            height: leafSize,
            filter:
              Platform.OS === 'web' && outer_glow_enabled
                ? ("drop-shadow(0 0 " + Math.round(size * 0.24) + "px " + tintColor + ")" as unknown as any)
                : undefined,
            backgroundColor: 'transparent',
          },
        ]}
        transition={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  solidBg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  leaf: {
    zIndex: 2,
  },
  leafStroke: {
    position: 'absolute',
    zIndex: 1,
  },
});
