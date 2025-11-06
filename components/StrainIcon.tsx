import { Image, Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconRenderParams } from "@/types";

interface StrainIconProps {
  params: IconRenderParams;
  size?: number;
  baseLeafUri?: string;
  testID?: string;
}

export function StrainIcon({ params, size = 64, baseLeafUri, testID }: StrainIconProps) {
  const {
    stroke_px,
    outer_glow_enabled,
    outer_glow_intensity_pct,
    palette,
    gradient,
  } = params;

  const baseHue = (palette.base_hue + palette.accent_hue_shift_deg + 360) % 360;
  const tintColor = `hsl(${baseHue}, ${palette.saturation_pct}%, ${palette.lightness_pct}%)`;
  const strokeColor = `hsl(${palette.base_hue}, ${palette.saturation_pct}%, ${Math.max(0, palette.lightness_pct - 20)}%)`;

  const radius = Math.round(size / 2);

  const localLeaf = require("@/assets/images/icontemp.png");
  const leafSource = baseLeafUri && baseLeafUri.length > 0 ? { uri: baseLeafUri } : localLeaf;

  return (
    <View
      testID={testID ?? "strain-icon"}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      {gradient.enabled ? (
        (() => {
          const colorsArr = gradient.stops.map(s => `hsla(${s.hue}, ${s.saturation_pct}%, ${s.lightness_pct}%, ${s.alpha_pct / 100})`);
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
            />
          );
        })()
      ) : (
        <View style={[styles.solidBg, { width: size, height: size, borderRadius: radius, backgroundColor: `hsla(${baseHue}, ${palette.saturation_pct}%, ${Math.min(95, palette.lightness_pct + 25)}%, 0.18)` }]} />
      )}

      <Image
        testID="strain-icon-leaf"
        source={leafSource}
        resizeMode="contain"
        style={[
          styles.leaf,
          {
            width: Math.floor(size * 0.72),
            height: Math.floor(size * 0.72),
            tintColor,
            shadowColor: tintColor,
            shadowOpacity: outer_glow_enabled ? Math.min(0.9, outer_glow_intensity_pct / 80) : 0,
            shadowRadius: outer_glow_enabled ? Math.max(3, size * 0.12) : 0,
            shadowOffset: { width: 0, height: 0 },
            filter: Platform.OS === 'web' && outer_glow_enabled ? `drop-shadow(0 0 ${Math.round(size * 0.18)}px ${tintColor})` as any : undefined,
          },
        ]}
      />

      <View
        pointerEvents="none"
        style={[
          styles.stroke,
          {
            width: Math.floor(size * 0.76),
            height: Math.floor(size * 0.76),
            borderRadius: Math.floor(size * 0.38),
            borderWidth: Math.max(1, Math.round(stroke_px)),
            borderColor: strokeColor,
          },
        ]}
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
  stroke: {
    position: 'absolute',
    zIndex: 1,
  },
});
