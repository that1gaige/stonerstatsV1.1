import { useApp } from "@/contexts/AppContext";
import { StrainIcon } from "@/components/StrainIcon";
const ICON_INDICA = require("@/assets/images/iconindica.png");
const ICON_SATIVA = require("@/assets/images/iconsativa.png");
const ICON_HYBRID_A = require("@/assets/images/iconhybrid.png");
const ICON_HYBRID_B = require("@/assets/images/iconhybrid2.png");
import { SmokeSession } from "@/types";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { useMemo } from "react";

export default function FeedScreen() {
  const { sessions, strains, user } = useApp();

  const feedSessions = useMemo(() => {
    return sessions
      .filter((s) => s.user_id === user.user_id)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 50);
  }, [sessions, user.user_id]);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  const pickHybridIcon = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return hash % 2 === 0 ? ICON_HYBRID_A : ICON_HYBRID_B;
  };

  const renderSession = ({ item }: { item: SmokeSession }) => {
    const strain = strains.find((s) => s.strain_id === item.strain_id);
    if (!strain) return null;

    return (
      <View style={styles.sessionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.display_name[0]}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user.display_name}</Text>
              <Text style={styles.timeAgo}>{getTimeAgo(item.created_at)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.strainRow}>
          <StrainIcon
            params={strain.icon_render_params}
            size={40}
            baseLeafSource={
              strain.type === "indica"
                ? ICON_INDICA
                : strain.type === "sativa"
                ? ICON_SATIVA
                : pickHybridIcon(strain.icon_seed || strain.name)
            }
          />
          <View style={styles.strainDetails}>
            <Text style={styles.strainName}>{strain.name}</Text>
            <Text style={styles.strainType}>{strain.type}</Text>
          </View>
        </View>

        <View style={styles.sessionDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Method</Text>
            <Text style={styles.detailValue}>{item.method}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>
              {item.amount} {item.amount_unit}
            </Text>
          </View>
          {item.mood_after && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mood</Text>
              <Text style={styles.detailValue}>
                {item.mood_before || "?"} → {item.mood_after}
              </Text>
            </View>
          )}
        </View>

        {item.effects_tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.effectsRow}
            contentContainerStyle={styles.effectsContent}
          >
            {item.effects_tags.slice(0, 5).map((effect, i) => (
              <View key={i} style={styles.effectChip}>
                <Text style={styles.effectText}>{effect}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {item.notes && (
          <Text style={styles.notes} numberOfLines={3}>
            {item.notes}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feedSessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.session_id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions yet</Text>
            <Text style={styles.emptySubtext}>
              Log your first session to see it here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  sessionCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#4ade80",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  timeAgo: {
    fontSize: 13,
    color: "#666",
  },
  strainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  strainDetails: {
    flex: 1,
  },
  strainName: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#fff",
    marginBottom: 2,
  },
  strainType: {
    fontSize: 13,
    color: "#888",
    textTransform: "capitalize",
  },
  sessionDetails: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 8,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600" as const,
  },
  detailValue: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  effectsRow: {
    maxHeight: 40,
  },
  effectsContent: {
    gap: 8,
  },
  effectChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
  },
  effectText: {
    fontSize: 13,
    color: "#4ade80",
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  notes: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 22,
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#444",
  },
});
