import { useApp } from "@/contexts/AppContext";
import { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

type Grain = "day" | "week" | "month";

export default function StatsScreen() {
  const { sessions, strains, user } = useApp();
  const [grain, setGrain] = useState<Grain>("week");
  const [daysBack, setDaysBack] = useState(30);

  const stats = useMemo(() => {
    const now = Date.now();
    const cutoff = now - daysBack * 24 * 60 * 60 * 1000;
    
    const filtered = sessions.filter(
      (s) => s.user_id === user.user_id && s.created_at.getTime() >= cutoff
    );

    const bins = new Map<string, number>();
    
    filtered.forEach((session) => {
      const date = new Date(session.created_at);
      let key: string = "";
      
      if (grain === "day") {
        key = date.toISOString().split("T")[0];
      } else if (grain === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }
      
      bins.set(key, (bins.get(key) || 0) + 1);
    });

    const sortedBins = Array.from(bins.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, count]) => ({ label, count }));

    const totalSessions = filtered.length;
    
    const strainCounts = new Map<string, number>();
    filtered.forEach((s) => {
      strainCounts.set(s.strain_id, (strainCounts.get(s.strain_id) || 0) + 1);
    });
    const topStrainId = Array.from(strainCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topStrain = strains.find((s) => s.strain_id === topStrainId);

    const methodCounts = new Map<string, number>();
    filtered.forEach((s) => {
      methodCounts.set(s.method, (methodCounts.get(s.method) || 0) + 1);
    });
    const topMethod = Array.from(methodCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];

    const weeks = daysBack / 7;
    const avgPerWeek = totalSessions / (weeks || 1);

    let longestStreak = 0;
    let currentStreak = 0;
    const daySet = new Set(
      filtered.map((s) => new Date(s.created_at).toISOString().split("T")[0])
    );
    
    for (let i = 0; i < daysBack; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      if (daySet.has(key)) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      bins: sortedBins,
      totalSessions,
      topStrain,
      topMethod,
      avgPerWeek: avgPerWeek.toFixed(1),
      longestStreak,
    };
  }, [sessions, user.user_id, grain, daysBack, strains]);

  const maxCount = Math.max(...stats.bins.map((b) => b.count), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histogram</Text>
        
        <View style={styles.controls}>
          <View style={styles.grainButtons}>
            {(["day", "week", "month"] as Grain[]).map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.grainButton, grain === g && styles.grainButtonActive]}
                onPress={() => setGrain(g)}
              >
                <Text
                  style={[
                    styles.grainButtonText,
                    grain === g && styles.grainButtonTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.grainButtons}>
            {[30, 60, 90].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.grainButton,
                  daysBack === days && styles.grainButtonActive,
                ]}
                onPress={() => setDaysBack(days)}
              >
                <Text
                  style={[
                    styles.grainButtonText,
                    daysBack === days && styles.grainButtonTextActive,
                  ]}
                >
                  {days}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chart}>
          {stats.bins.length > 0 ? (
            <View style={styles.bars}>
              {stats.bins.map((bin) => {
                const height = (bin.count / maxCount) * 180;
                return (
                  <View key={bin.label} style={styles.barContainer}>
                    <View style={[styles.bar, { height }]}>
                      <Text style={styles.barCount}>{bin.count}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No data for this range</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats.totalSessions}</Text>
          <Text style={styles.summaryLabel}>Total Sessions</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats.avgPerWeek}</Text>
          <Text style={styles.summaryLabel}>Avg / Week</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats.longestStreak}</Text>
          <Text style={styles.summaryLabel}>Longest Streak</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {stats.topStrain?.name || "—"}
          </Text>
          <Text style={styles.summaryLabel}>Top Strain</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {stats.topMethod || "—"}
          </Text>
          <Text style={styles.summaryLabel}>Top Method</Text>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 16,
  },
  controls: {
    gap: 12,
    marginBottom: 24,
  },
  grainButtons: {
    flexDirection: "row",
    gap: 8,
  },
  grainButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#333",
  },
  grainButtonActive: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
  },
  grainButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#999",
    textTransform: "capitalize",
  },
  grainButtonTextActive: {
    color: "#0a0a0a",
  },
  chart: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    minHeight: 240,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 200,
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    backgroundColor: "#4ade80",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 20,
    alignItems: "center",
    paddingTop: 6,
  },
  barCount: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#0a0a0a",
  },
  emptyChart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChartText: {
    fontSize: 16,
    color: "#666",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    gap: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#4ade80",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
