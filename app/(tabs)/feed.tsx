import { StrainIcon } from "@/components/StrainIcon";
import { getStrainIcon } from "@/constants/icons";
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { trpc } from "@/lib/trpc";
import { Heart } from "lucide-react-native";

export default function FeedScreen() {
  const feedQuery = trpc.sessions.getFeed.useQuery();
  const likeMutation = trpc.sessions.like.useMutation({
    onSuccess: () => {
      feedQuery.refetch();
    },
  });
  const unlikeMutation = trpc.sessions.unlike.useMutation({
    onSuccess: () => {
      feedQuery.refetch();
    },
  });

  if (feedQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (feedQuery.error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Error loading feed</Text>
        <Text style={styles.emptySubtext}>{feedQuery.error.message}</Text>
      </View>
    );
  }

  const feedSessions = feedQuery.data || [];

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



  const handleLike = (sessionId: string, hasLiked: boolean) => {
    if (hasLiked) {
      unlikeMutation.mutate({ sessionId });
    } else {
      likeMutation.mutate({ sessionId });
    }
  };

  const renderSession = ({ item }: { item: typeof feedSessions[0] }) => {
    if (!item.user || !item.strain) return null;

    return (
      <View style={styles.sessionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.user.display_name[0]}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{item.user.display_name}</Text>
              <Text style={styles.timeAgo}>{getTimeAgo(item.session.created_at)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.strainRow}>
          <StrainIcon
            params={item.strain.icon_render_params}
            size={40}
            baseLeafSource={getStrainIcon(item.strain)}
            fillSeedUUID={item.strain.strain_id}
          />
          <View style={styles.strainDetails}>
            <Text style={styles.strainName}>{item.strain.name}</Text>
            <Text style={styles.strainType}>{item.strain.type}</Text>
          </View>
        </View>

        <View style={styles.sessionDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Method</Text>
            <Text style={styles.detailValue}>{item.session.method}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>
              {item.session.amount} {item.session.amount_unit}
            </Text>
          </View>
          {item.session.mood_after && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mood</Text>
              <Text style={styles.detailValue}>
                {item.session.mood_before || "?"} → {item.session.mood_after}
              </Text>
            </View>
          )}
        </View>

        {item.session.effects_tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.effectsRow}
            contentContainerStyle={styles.effectsContent}
          >
            {item.session.effects_tags.slice(0, 5).map((effect, i) => (
              <View key={i} style={styles.effectChip}>
                <Text style={styles.effectText}>{effect}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {item.session.notes && (
          <Text style={styles.notes} numberOfLines={3}>
            {item.session.notes}
          </Text>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handleLike(item.session.session_id, item.session.has_liked)}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
          >
            <Heart
              size={24}
              color={item.session.has_liked ? "#ef4444" : "#666"}
              fill={item.session.has_liked ? "#ef4444" : "transparent"}
            />
            {item.session.likes_count > 0 && (
              <Text style={[styles.likeCount, item.session.has_liked && styles.likeCountActive]}>
                {item.session.likes_count}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feedSessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.session.session_id}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    marginTop: 8,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  likeCount: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#666",
  },
  likeCountActive: {
    color: "#ef4444",
  },
});
