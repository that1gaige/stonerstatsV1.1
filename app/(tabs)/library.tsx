import { useApp } from "@/contexts/AppContext";
import { Strain, StrainType } from "@/types";
import { StrainIcon } from "@/components/StrainIcon";
import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search } from "lucide-react-native";

const STRAIN_TYPES: StrainType[] = ["indica", "sativa", "hybrid"];

export default function LibraryScreen() {
  const { strains } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<StrainType>>(new Set());

  const filteredStrains = useMemo(() => {
    let filtered = strains;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          (s.breeder?.toLowerCase().includes(query) ?? false) ||
          (s.description?.toLowerCase().includes(query) ?? false)
      );
    }

    if (selectedTypes.size > 0) {
      filtered = filtered.filter((s) => selectedTypes.has(s.type));
    }

    const dedupedMap = new Map<string, Strain>();
    for (const s of filtered) {
      const key = s.strain_id && s.strain_id.length > 0 ? s.strain_id : `${s.name}`;
      if (!dedupedMap.has(key)) dedupedMap.set(key, s);
    }

    return Array.from(dedupedMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [strains, searchQuery, selectedTypes]);

  const toggleType = (type: StrainType) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedTypes(newSet);
  };

  const renderStrainItem = ({ item }: { item: Strain }) => (
    <View style={styles.strainItem}>
      <StrainIcon params={item.icon_render_params} size={72} />
      <View style={styles.strainInfo}>
        <Text style={styles.strainName}>{item.name}</Text>
        <View style={styles.strainMeta}>
          <View style={[styles.typeChip, styles[`type_${item.type}`]]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          {item.terp_profile && item.terp_profile.length > 0 && (
            <Text style={styles.terpText}>{item.terp_profile[0]}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search strains..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {STRAIN_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedTypes.has(type) && styles.filterChipActive,
              selectedTypes.has(type) && styles[`type_${type}`],
            ]}
            onPress={() => toggleType(type)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedTypes.has(type) && styles.filterChipTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredStrains}
        renderItem={renderStrainItem}
        keyExtractor={(item, index) => (item.strain_id && item.strain_id.length > 0 ? item.strain_id : `${item.name}-${index}`)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No strains found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
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
  filterContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  filterChipActive: {
    borderColor: "transparent",
  },
  filterChipText: {
    fontSize: 14,
    color: "#999",
    textTransform: "capitalize",
    fontWeight: "600" as const,
  },
  filterChipTextActive: {
    color: "#fff",
  },
  type_indica: {
    backgroundColor: "rgba(100, 100, 200, 0.3)",
  },
  type_sativa: {
    backgroundColor: "rgba(200, 150, 100, 0.3)",
  },
  type_hybrid: {
    backgroundColor: "rgba(100, 180, 120, 0.3)",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  strainItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  strainInfo: {
    flex: 1,
    gap: 6,
  },
  strainName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
  strainMeta: {
    flexDirection: "row",
    alignItems: "center",
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#444",
  },
});
