import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { UserPlus, UserMinus, Search } from "lucide-react-native";
import { Stack } from "expo-router";

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const discoverQuery = trpc.users.discover.useQuery({ 
    query: searchQuery || undefined,
    limit: 30,
  });

  const followMutation = trpc.users.follow.useMutation({
    onSuccess: () => {
      discoverQuery.refetch();
    },
  });

  const unfollowMutation = trpc.users.unfollow.useMutation({
    onSuccess: () => {
      discoverQuery.refetch();
    },
  });

  const handleFollowToggle = (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate({ userId });
    } else {
      followMutation.mutate({ userId });
    }
  };

  const renderUser = ({ item }: { item: NonNullable<typeof discoverQuery.data>[0] }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.display_name[0].toUpperCase()}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.displayName}>{item.display_name}</Text>
          <Text style={styles.handle}>@{item.handle}</Text>
          {item.bio && (
            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.followButton, item.is_following && styles.followingButton]}
        onPress={() => handleFollowToggle(item.user_id, item.is_following)}
        disabled={followMutation.isPending || unfollowMutation.isPending}
      >
        {item.is_following ? (
          <>
            <UserMinus size={16} color="#fff" />
            <Text style={styles.followButtonText}>Following</Text>
          </>
        ) : (
          <>
            <UserPlus size={16} color="#fff" />
            <Text style={styles.followButtonText}>Follow</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Discover Users" }} />
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {discoverQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ade80" />
        </View>
      ) : discoverQuery.error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Error loading users</Text>
          <Text style={styles.emptySubtext}>{discoverQuery.error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={discoverQuery.data || []}
          renderItem={renderUser}
          keyExtractor={(item) => item.user_id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? "Try a different search" : "Be the first to add friends"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  userCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#4ade80",
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#fff",
  },
  handle: {
    fontSize: 14,
    color: "#888",
  },
  bio: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 4,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4ade80",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  followingButton: {
    backgroundColor: "#2a2a2a",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#fff",
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
