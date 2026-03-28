import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StrainCard as StrainCardType, Strain } from "@/types";
import { StrainIcon } from "@/components/StrainIcon";
import { getStrainIcon } from "@/constants/icons";
import { getRarityColor, getRarityGlow } from "@/utils/cardGenerator";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";

interface StrainCardProps {
  card: StrainCardType;
  strain: Strain;
  onPress?: () => void;
  compact?: boolean;
}

export function StrainCard({ card, strain, onPress, compact = false }: StrainCardProps) {
  const rarityColor = getRarityColor(card.rarity);
  const isGradientRarity = card.rarity === "mythic";

  const RarityPill = () => {
    if (isGradientRarity) {
      return (
        <LinearGradient
          colors={["#ec4899", "#8b5cf6", "#3b82f6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rarityPill}
        >
          {card.art_variant === "foil" && <Sparkles size={12} color="#fff" />}
          <Text style={styles.rarityText}>{card.rarity}</Text>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.rarityPill, { backgroundColor: rarityColor }]}>
        {card.art_variant === "foil" && <Sparkles size={12} color="#fff" />}
        <Text style={styles.rarityText}>{card.rarity}</Text>
      </View>
    );
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { borderColor: rarityColor }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <StrainIcon
          params={strain.icon_render_params}
          size={48}
          baseLeafSource={getStrainIcon(strain)}
          fillSeedUUID={strain.strain_id}
        />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>
            {card.card_name}
          </Text>
          <RarityPill />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: rarityColor, shadowColor: getRarityGlow(card.rarity) },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardNumber}>{card.card_number}</Text>
        <RarityPill />
      </View>

      <View style={styles.cardArtContainer}>
        <StrainIcon
          params={strain.icon_render_params}
          size={120}
          baseLeafSource={getStrainIcon(strain)}
          fillSeedUUID={strain.strain_id}
        />
        {card.art_variant === "foil" && (
          <View style={styles.foilOverlay}>
            <LinearGradient
              colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{card.card_name}</Text>
        <View style={styles.strainMeta}>
          <View style={[styles.typeChip, styles[`type_${strain.type}`]]}>
            <Text style={styles.typeText}>{strain.type}</Text>
          </View>
          {strain.terp_profile && strain.terp_profile.length > 0 && (
            <Text style={styles.terpText}>{strain.terp_profile[0]}</Text>
          )}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.setName}>{card.set_name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#666",
    letterSpacing: 0.5,
  },
  rarityPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardArtContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    position: "relative",
  },
  foilOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  cardBody: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#fff",
    textAlign: "center",
  },
  strainMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  terpText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  type_indica: {
    backgroundColor: "#6b46c1",
  },
  type_sativa: {
    backgroundColor: "#f59e0b",
  },
  type_hybrid: {
    backgroundColor: "#10b981",
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    marginTop: 8,
  },
  setName: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#666",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    gap: 12,
  },
  compactInfo: {
    flex: 1,
    gap: 6,
  },
  compactName: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#fff",
  },
});
