import { useApp } from "@/contexts/AppContext";
import { Strain, StrainType } from "@/types";
import { StrainIcon } from "@/components/StrainIcon";
const ICON_INDICA = require("@/assets/images/iconindica.png");
const ICON_SATIVA = require("@/assets/images/iconsativa.png");
const ICON_HYBRID_A = require("@/assets/images/iconhybrid.png");
const ICON_HYBRID_B = require("@/assets/images/iconhybrid2.png");
import { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { importFromSources } from "@/utils/importStrains";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Search, DownloadCloud } from "lucide-react-native";

const STRAIN_TYPES: StrainType[] = ["indica", "sativa", "hybrid"];

export default function LibraryScreen() {
  const { strains, addStrain } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<StrainType>>(new Set());
  const [importSummary, setImportSummary] = useState<string | null>(null);

  const importMutation = useMutation({
    mutationFn: async () => await importFromSources(strains),
    onSuccess: async (res) => {
      for (const s of res.created) {
        await addStrain(s);
      }
      setImportSummary(`Imported ${res.created.length}, skipped ${res.skipped}${res.errors ? ", errors " + res.errors : ""}`);
    },
    onError: () => {
      setImportSummary("Import failed");
    },
  });

  useEffect(() => {
    if (importSummary) {
      const t = setTimeout(() => setImportSummary(null), 4000);
      return () => clearTimeout(t);
    }
  }, [importSummary]);

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

  const pickHybridIcon = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return hash % 2 === 0 ? ICON_HYBRID_A : ICON_HYBRID_B;
  };

  const baseLeafFor = (s: Strain) => {
    switch (s.type) {
      case "indica":
        return ICON_INDICA;
      case "sativa":
        return ICON_SATIVA;
      case "hybrid":
        return pickHybridIcon(s.icon_seed || s.name);
      default:
        return undefined as unknown as never;
    }
  };

  const renderStrainItem = ({ item }: { item: Strain }) => (
    <View style={styles.strainItem}>
      <StrainIcon params={item.icon_render_params} size={72} baseLeafSource={baseLeafFor(item)} fillSeedUUID={item.strain_id} />
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

      {importSummary && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{importSummary}</Text>
        </View>
      )}

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

      <TouchableOpacity
        accessibilityRole="button"
        testID="import-button"
        style={[styles.fab, importMutation.isPending && styles.fabDisabled]}
        onPress={() => importMutation.mutate()}
        disabled={importMutation.isPending}
      >
        <DownloadCloud color="#0a0a0a" size={20} />
        <Text style={styles.fabText}>{importMutation.isPending ? "Importing..." : "Import"}</Text>
      </TouchableOpacity>
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    backgroundColor: "#4ade80",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#4ade80",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  fabDisabled: {
    opacity: 0.6,
  },
  fabText: {
    color: "#0a0a0a",
    fontWeight: "800" as const,
  },
  banner: {
    backgroundColor: "#16331f",
    borderColor: "#235c37",
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  bannerText: {
    color: "#8ef0b1",
    fontWeight: "700" as const,
  },
});
