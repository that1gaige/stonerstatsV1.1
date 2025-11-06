import { useApp } from "@/contexts/AppContext";
import { Strain, StrainType, TerpProfile } from "@/types";
import { StrainIcon } from "@/components/StrainIcon";
import { createStrain } from "@/utils/iconGenerator";
const ICON_INDICA = require("@/assets/images/iconindica.png");
const ICON_SATIVA = require("@/assets/images/iconsativa.png");
const ICON_HYBRID_A = require("@/assets/images/iconhybrid.png");
const ICON_HYBRID_B = require("@/assets/images/iconhybrid2.png");
import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Search, Plus, Check } from "lucide-react-native";

const STRAIN_TYPES: StrainType[] = ["indica", "sativa", "hybrid"];
const TERPS: TerpProfile[] = [
  "limonene",
  "myrcene",
  "pinene",
  "caryophyllene",
  "linalool",
  "humulene",
  "terpinolene",
];

export default function LibraryScreen() {
  const { strains, addStrain } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<StrainType>>(new Set());
  const [bannerText, setBannerText] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newType, setNewType] = useState<StrainType>("hybrid");

  const [newDesc, setNewDesc] = useState<string>("");
  const [newTerps, setNewTerps] = useState<Set<TerpProfile>>(new Set());

  useEffect(() => {
    if (bannerText) {
      const t = setTimeout(() => setBannerText(null), 4000);
      return () => clearTimeout(t);
    }
  }, [bannerText]);

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

  const toggleTerp = (terp: TerpProfile) => {
    const next = new Set(newTerps);
    if (next.has(terp)) next.delete(terp); else next.add(terp);
    setNewTerps(next);
  };

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert("Missing name", "Please enter a strain name");
      return;
    }
    try {
      const created = createStrain(name, newType, {
        terp_profile: Array.from(newTerps),
        description: newDesc.trim() || undefined,
        created_by: "user_default",
        source: "user",
      });
      await addStrain(created);
      setBannerText(`Added ${created.name}`);
      setShowAdd(false);
      setNewName("");
      setNewType("hybrid");

      setNewDesc("");
      setNewTerps(new Set());
    } catch (e) {
      Alert.alert("Failed", "Could not add strain");
    }
  };

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

      {bannerText && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{bannerText}</Text>
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

      {showAdd && (
        <View style={styles.addSheet}>
          <View style={styles.addHeader}>
            <Text style={styles.addTitle}>Add Strain</Text>
            <TouchableOpacity onPress={() => setShowAdd(false)} style={styles.closePill}>
              <Text style={styles.closePillText}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              testID="add-name"
              style={styles.input}
              placeholder="e.g. Purple Nebula"
              placeholderTextColor="#666"
              value={newName}
              onChangeText={setNewName}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.rowChips}>
              {STRAIN_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.methodChip, newType === t && styles.methodChipActive]}
                  onPress={() => setNewType(t)}
                >
                  <Text style={[styles.methodChipText, newType === t && styles.methodChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>Terpenes</Text>
            <View style={styles.rowWrap}>
              {TERPS.map((tp) => (
                <TouchableOpacity
                  key={tp}
                  style={[styles.effectChip, newTerps.has(tp) && styles.effectChipActive]}
                  onPress={() => toggleTerp(tp)}
                >
                  {newTerps.has(tp) && <Check size={14} color="#fff" />}
                  <Text style={[styles.effectChipText, newTerps.has(tp) && styles.effectChipTextActive]}>{tp}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <View style={styles.formRow}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              testID="add-description"
              style={[styles.input, styles.notesInput]}
              placeholder="Aroma, lineage, effects..."
              placeholderTextColor="#666"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
            />
          </View>

          <TouchableOpacity testID="add-submit" style={styles.submitButton} onPress={handleAdd}>
            <Text style={styles.submitButtonText}>Add Strain</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        accessibilityRole="button"
        testID="add-button"
        style={styles.fab}
        onPress={() => setShowAdd(true)}
      >
        <Plus color="#0a0a0a" size={20} />
        <Text style={styles.fabText}>Add</Text>
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
  addSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#121212",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderColor: "#2a2a2a",
  },
  addHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#fff",
  },
  closePill: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  closePillText: {
    color: "#e5e7eb",
    fontWeight: "700" as const,
  },
  formRow: {
    gap: 8,
  },
  label: {
    color: "#9ca3af",
    fontWeight: "700" as const,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  rowChips: {
    flexDirection: "row",
    gap: 8,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  methodChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#333",
  },
  methodChipActive: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
  },
  methodChipText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#999",
    textTransform: "capitalize",
  },
  methodChipTextActive: {
    color: "#0a0a0a",
  },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#fff",
    borderWidth: 2,
    borderColor: "#333",
  },
  notesInput: {
    minHeight: 100,
  },
  effectChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#333",
    gap: 6,
  },
  effectChipActive: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
    borderColor: "#4ade80",
  },
  effectChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#999",
    textTransform: "capitalize",
  },
  effectChipTextActive: {
    color: "#4ade80",
  },
  submitButton: {
    backgroundColor: "#4ade80",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#0a0a0a",
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
