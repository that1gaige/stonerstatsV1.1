import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, Animated } from "react-native";
import { StrainCard as StrainCardType, Strain } from "@/types";
import { StrainIcon } from "@/components/StrainIcon";
import { getStrainIcon } from "@/constants/icons";
import { getRarityColor, getRarityGlow } from "@/utils/cardGenerator";
import { CARD_SHADERS } from "@/constants/cardShaders";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, X, Share2, RotateCw } from "lucide-react-native";
import { useState, useRef } from "react";

interface FullCardViewProps {
  card: StrainCardType;
  strain: Strain;
  visible: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export function FullCardView({ card, strain, visible, onClose, onShare }: FullCardViewProps) {
  const [showBack, setShowBack] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const rarityColor = getRarityColor(card.rarity);
  const isGradientRarity = card.rarity === "mythic";
  const shaderInfo = CARD_SHADERS[card.shader];

  const handleFlip = () => {
    const toValue = showBack ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
    setShowBack(!showBack);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleFlip} style={styles.iconButton}>
                <RotateCw size={24} color="#4ade80" />
              </TouchableOpacity>
              {onShare && (
                <TouchableOpacity onPress={onShare} style={styles.iconButton}>
                  <Share2 size={24} color="#4ade80" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.cardWrapper}>
              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardFront,
                  { transform: [{ rotateY: frontInterpolate }] },
                  { borderColor: rarityColor, shadowColor: getRarityGlow(card.rarity) },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardNumber}>{card.card_number}</Text>
                  <RarityPill />
                </View>

                <View style={styles.cardArtContainer}>
                  <StrainIcon
                    params={strain.icon_render_params}
                    size={160}
                    baseLeafSource={getStrainIcon(strain)}
                    fillSeedUUID={strain.strain_id}
                  />
                  {card.art_variant === "foil" && (
                    <View style={styles.foilOverlay}>
                      <LinearGradient
                        colors={[
                          "rgba(255,255,255,0.1)",
                          "rgba(255,255,255,0.3)",
                          "rgba(255,255,255,0.1)",
                        ]}
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
                      <Text style={styles.terpText}>
                        {strain.terp_profile.slice(0, 3).join(", ")}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.setName}>{card.set_name}</Text>
                  {card.sparks_count !== undefined && card.sparks_count > 0 && (
                    <View style={styles.sparksRow}>
                      <Sparkles size={14} color="#fbbf24" />
                      <Text style={styles.sparksText}>{card.sparks_count} Sparks</Text>
                    </View>
                  )}
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.cardFace,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate }] },
                  { borderColor: rarityColor, shadowColor: getRarityGlow(card.rarity) },
                ]}
              >
                <View style={styles.backHeader}>
                  <Text style={styles.backTitle}>Card Info</Text>
                  <RarityPill />
                </View>

                <View style={styles.backSection}>
                  <Text style={styles.backLabel}>Strain Type</Text>
                  <Text style={styles.backValue}>{strain.type}</Text>
                </View>

                <View style={styles.backSection}>
                  <Text style={styles.backLabel}>Terpene Profile</Text>
                  <Text style={styles.backValue}>
                    {strain.terp_profile?.join(", ") || "Unknown"}
                  </Text>
                </View>

                <View style={styles.backSection}>
                  <Text style={styles.backLabel}>Art Variant</Text>
                  <Text style={styles.backValue}>
                    {card.art_variant.charAt(0).toUpperCase() + card.art_variant.slice(1)}
                  </Text>
                </View>

                <View style={styles.backSection}>
                  <Text style={styles.backLabel}>Shader</Text>
                  <Text style={styles.backValue}>{shaderInfo.name}</Text>
                  <Text style={styles.backDesc}>{shaderInfo.description}</Text>
                </View>

                {strain.description && (
                  <View style={styles.backSection}>
                    <Text style={styles.backLabel}>Description</Text>
                    <Text style={styles.backDesc}>{strain.description}</Text>
                  </View>
                )}

                {strain.breeder && (
                  <View style={styles.backSection}>
                    <Text style={styles.backLabel}>Breeder</Text>
                    <Text style={styles.backValue}>{strain.breeder}</Text>
                  </View>
                )}

                <View style={styles.backFooter}>
                  <Text style={styles.backFooterText}>{card.card_number}</Text>
                  <Text style={styles.backFooterText}>{card.set_name}</Text>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
  },
  cardWrapper: {
    position: "relative",
    height: 600,
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    borderWidth: 3,
    padding: 20,
    backfaceVisibility: "hidden",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  cardFront: {},
  cardBack: {},
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#666",
    letterSpacing: 0.5,
  },
  rarityPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  rarityText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardArtContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    position: "relative",
  },
  foilOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  cardBody: {
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#2a2a2a",
  },
  cardName: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#fff",
    textAlign: "center",
  },
  strainMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  terpText: {
    fontSize: 14,
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
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#2a2a2a",
    marginTop: "auto",
    gap: 8,
  },
  setName: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#666",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sparksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sparksText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#fbbf24",
  },
  backHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#fff",
  },
  backSection: {
    marginBottom: 20,
  },
  backLabel: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  backValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
    textTransform: "capitalize",
  },
  backDesc: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: "#aaa",
    lineHeight: 20,
    marginTop: 4,
  },
  backFooter: {
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#2a2a2a",
    marginTop: "auto",
    gap: 4,
  },
  backFooterText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#666",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
