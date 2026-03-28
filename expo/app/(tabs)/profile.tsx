import { useApp } from "@/contexts/AppContext";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Settings, LogOut } from "lucide-react-native";
import { trpc } from "@/lib/trpc";

export default function ProfileScreen() {
  const { user, logout } = useApp();
  const sessionsQuery = trpc.sessions.getUserSessions.useQuery();

  const userSessions = sessionsQuery.data || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.display_name[0]}</Text>
        </View>
        
        <Text style={styles.displayName}>{user.display_name}</Text>
        <Text style={styles.handle}>@{user.handle}</Text>
        
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userSessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.following_user_ids.length}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.settingRow} onPress={logout}>
          <LogOut size={20} color="#f87171" />
          <Text style={[styles.settingLabel, {color: "#f87171"}]}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Privacy Level</Text>
          <Text style={styles.settingValue}>{user.preferences.privacy_level}</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Default Unit</Text>
          <Text style={styles.settingValue}>{user.preferences.default_unit}</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Text style={styles.settingValue}>
            {user.preferences.dark_mode ? "On" : "Off"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {userSessions.slice(0, 5).map((session) => (
          <View key={session.session_id} style={styles.sessionRow}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionMethod}>{session.method}</Text>
              <Text style={styles.sessionAmount}>
                {session.amount} {session.amount_unit}
              </Text>
            </View>
            <Text style={styles.sessionDate}>
              {new Date(session.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#4ade80",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#fff",
  },
  handle: {
    fontSize: 16,
    color: "#888",
  },
  bio: {
    fontSize: 15,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#4ade80",
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
  },
  settingValue: {
    fontSize: 15,
    color: "#888",
    textTransform: "capitalize",
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessionMethod: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600" as const,
    textTransform: "capitalize",
  },
  sessionAmount: {
    fontSize: 14,
    color: "#888",
  },
  sessionDate: {
    fontSize: 13,
    color: "#666",
  },
});
