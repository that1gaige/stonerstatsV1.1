import { useApp } from "@/contexts/AppContext";
import { Strain, StrainType, TerpProfile } from "@/types";
import { StrainIcon } from "@/components/StrainIcon";
import { createStrain } from "@/utils/iconGenerator";
import { getStrainIcon } from "@/constants/icons";
import { DEMO_STRAINS_DATA } from "@/constants/demoStrains";
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
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Search, Plus, Check, Camera, Upload, X } from "lucide-react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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

const ALL_STRAINS = DEMO_STRAINS_DATA.map((d) =>
  createStrain(d.name, d.type, {
    terp_profile: [...d.terp_profile],
    description: d.description,
    source: "developer",
  })
);

type TabType = "my-strains" | "explore";

export default function LibraryScreen() {
  const { strains, addStrain } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("my-strains");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<StrainType>>(new Set());
  const [bannerText, setBannerText] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
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

  const userStrains = useMemo(() => {
    return strains.filter((s) => s.source === "user" || !s.source);
  }, [strains]);

  const dataSource = activeTab === "my-strains" ? userStrains : ALL_STRAINS;

  const filteredStrains = useMemo(() => {
    let filtered = dataSource;

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
  }, [dataSource, searchQuery, selectedTypes]);

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
      <StrainIcon
        params={item.icon_render_params}
        size={72}
        baseLeafSource={getStrainIcon(item)}
        fillSeedUUID={item.strain_id}
      />
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
        {item.description && (
          <Text style={styles.descText} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </View>
  );

  const toggleTerp = (terp: TerpProfile) => {
    const next = new Set(newTerps);
    if (next.has(terp)) next.delete(terp);
    else next.add(terp);
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

  const handleUploadPhoto = async () => {
    try {
      setShowScanModal(false);
      setIsUploadProcessing(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant photo library access to upload images"
        );
        setIsUploadProcessing(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as any,
        allowsMultipleSelection: true,
        selectionLimit: 2,
        base64: true,
        quality: 0.8,
      });

      if (result.canceled) {
        setIsUploadProcessing(false);
        return;
      }

      if (result.assets.length === 0) {
        Alert.alert("No Image", "Please select at least one image");
        setIsUploadProcessing(false);
        return;
      }

      console.log(`Processing ${result.assets.length} image(s)...`);

      const analysisPrompt = `Analyze ${result.assets.length === 2 ? "these 2 images of the same" : "this"} cannabis/weed container and extract ALL visible information about the strain. ${result.assets.length === 2 ? "Combine information from both images." : ""} Return a JSON object with this exact structure:

{
  "name": "strain name (REQUIRED)",
  "type": "indica" or "sativa" or "hybrid" (REQUIRED, if not visible, make educated guess based on name or appearance)",
  "thc": "THC percentage if visible (e.g., '24.5%')",
  "cbd": "CBD percentage if visible (e.g., '0.3%')",
  "terpenes": ["array of terpene names if visible, e.g., 'limonene', 'myrcene', 'pinene', 'caryophyllene', 'linalool', 'humulene', 'terpinolene'"],
  "breeder": "breeder/brand name if visible",
  "description": "any visible description or effects",
  "batch": "batch number if visible",
  "harvest_date": "harvest date if visible",
  "package_date": "package date if visible",
  "lab": "lab name if visible"
}

IMPORTANT: 
- Only include fields with visible information
- For "type", if you see words like "indica", "sativa", or "hybrid" on the label, use that. Otherwise make an educated guess.
- Be thorough - extract ALL text visible on the container${result.assets.length === 2 ? " from BOTH images" : ""}
- If you can't find the strain name, look for any product name or prominent text`;

      const { generateText } = await import("@rork-ai/toolkit-sdk");

      const contentParts: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = [
        { type: "text", text: analysisPrompt },
      ];

      for (const asset of result.assets) {
        if (asset.base64) {
          contentParts.push({
            type: "image",
            image: `data:image/jpeg;base64,${asset.base64}`,
          });
        }
      }

      const response = await generateText({
        messages: [
          {
            role: "user",
            content: contentParts,
          },
        ],
      });

      console.log("AI Response:", response);

      let parsed: any;
      try {
        if (!response || typeof response !== 'string') {
          throw new Error("Invalid response from AI");
        }

        let cleanedResponse = response.trim();
        
        if (cleanedResponse.length === 0) {
          throw new Error("Empty response from AI");
        }
        
        const codeBlockMatch = cleanedResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          cleanedResponse = codeBlockMatch[1].trim();
        }
        
        let jsonStr = cleanedResponse;
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
        
        const openBraces = (jsonStr.match(/\{/g) || []).length;
        const closeBraces = (jsonStr.match(/\}/g) || []).length;
        
        if (openBraces > closeBraces) {
          jsonStr = jsonStr + '}'.repeat(openBraces - closeBraces);
        } else if (closeBraces > openBraces) {
          const lastBrace = jsonStr.lastIndexOf('}');
          if (lastBrace !== -1) {
            jsonStr = jsonStr.substring(0, lastBrace + 1);
          }
        }
        
        parsed = JSON.parse(jsonStr);
      } catch (parseError: any) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw response:", response);
        console.error("Parse error message:", parseError?.message || String(parseError));
        Alert.alert(
          "Scan Failed",
          "Could not extract strain information from the image(s). Please try again with better lighting or a clearer view of the label."
        );
        setIsUploadProcessing(false);
        return;
      }

      if (!parsed.name || !parsed.type) {
        Alert.alert(
          "Incomplete Data",
          "Could not find essential strain information. Please try again."
        );
        setIsUploadProcessing(false);
        return;
      }

      const validTerpenes: TerpProfile[] = [];
      if (parsed.terpenes && Array.isArray(parsed.terpenes)) {
        const validTerpeneNames: TerpProfile[] = [
          "limonene",
          "myrcene",
          "pinene",
          "caryophyllene",
          "linalool",
          "humulene",
          "terpinolene",
        ];
        for (const terp of parsed.terpenes) {
          const normalized = terp.toLowerCase() as TerpProfile;
          if (validTerpeneNames.includes(normalized)) {
            validTerpenes.push(normalized);
          }
        }
      }

      const strainType: StrainType =
        parsed.type === "indica" || parsed.type === "sativa" || parsed.type === "hybrid"
          ? parsed.type
          : "hybrid";

      let descriptionParts: string[] = [];
      if (parsed.description) descriptionParts.push(parsed.description);
      if (parsed.thc) descriptionParts.push(`THC: ${parsed.thc}`);
      if (parsed.cbd) descriptionParts.push(`CBD: ${parsed.cbd}`);
      if (parsed.batch) descriptionParts.push(`Batch: ${parsed.batch}`);
      if (parsed.harvest_date) descriptionParts.push(`Harvested: ${parsed.harvest_date}`);
      if (parsed.package_date) descriptionParts.push(`Packaged: ${parsed.package_date}`);
      if (parsed.lab) descriptionParts.push(`Lab: ${parsed.lab}`);

      const newStrain = createStrain(parsed.name, strainType, {
        terp_profile: validTerpenes.length > 0 ? validTerpenes : undefined,
        description: descriptionParts.join("\n") || undefined,
        breeder: parsed.breeder || undefined,
        source: "user",
        created_by: "user_default",
      });

      await addStrain(newStrain);

      Alert.alert(
        "Strain Added!",
        `${parsed.name} has been added to your library`,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );

      setBannerText(`Added ${parsed.name}`);
      setIsUploadProcessing(false);
    } catch (error) {
      console.error("Error uploading and scanning:", error);
      Alert.alert("Error", "Failed to process images. Please try again.");
      setIsUploadProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "my-strains" && styles.tabActive]}
          onPress={() => setActiveTab("my-strains")}
        >
          <Text style={[styles.tabText, activeTab === "my-strains" && styles.tabTextActive]}>
            My Strains
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "explore" && styles.tabActive]}
          onPress={() => setActiveTab("explore")}
        >
          <Text style={[styles.tabText, activeTab === "explore" && styles.tabTextActive]}>
            Explore
          </Text>
        </TouchableOpacity>
      </View>

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
        keyExtractor={(item, index) =>
          item.strain_id && item.strain_id.length > 0 ? item.strain_id : `${item.name}-${index}`
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No strains found</Text>
            <Text style={styles.emptySubtext}>
              {activeTab === "my-strains"
                ? "Add your first strain or scan a container"
                : "Try adjusting your search or filters"}
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
                  <Text
                    style={[styles.methodChipText, newType === t && styles.methodChipTextActive]}
                  >
                    {t}
                  </Text>
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
                  <Text
                    style={[styles.effectChipText, newTerps.has(tp) && styles.effectChipTextActive]}
                  >
                    {tp}
                  </Text>
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

          <TouchableOpacity
            testID="add-submit"
            style={styles.submitButton}
            onPress={handleAdd}
          >
            <Text style={styles.submitButtonText}>Add Strain</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "my-strains" && userStrains.length === 0 && (
        <>
          <TouchableOpacity
            accessibilityRole="button"
            testID="scan-button"
            style={styles.scanFab}
            onPress={() => setShowScanModal(true)}
          >
            <Camera color="#0a0a0a" size={20} />
            <Text style={styles.fabText}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            testID="add-button"
            style={styles.fab}
            onPress={() => setShowAdd(true)}
          >
            <Plus color="#0a0a0a" size={20} />
            <Text style={styles.fabText}>Add</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={showScanModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScanModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowScanModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Strain</Text>
              <TouchableOpacity onPress={() => setShowScanModal(false)}>
                <X size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Choose an option</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowScanModal(false);
                router.push("/scan");
              }}
            >
              <View style={styles.modalOptionIcon}>
                <Camera size={28} color="#4ade80" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Take Photo</Text>
                <Text style={styles.modalOptionDesc}>Open camera to scan container</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleUploadPhoto}
              disabled={isUploadProcessing}
            >
              <View style={styles.modalOptionIcon}>
                {isUploadProcessing ? (
                  <ActivityIndicator size="small" color="#4ade80" />
                ) : (
                  <Upload size={28} color="#4ade80" />
                )}
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Upload Photo</Text>
                <Text style={styles.modalOptionDesc}>Select up to 2 photos (same strain)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
  },
  tabActive: {
    backgroundColor: "#4ade80",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#666",
  },
  tabTextActive: {
    color: "#0a0a0a",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
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
    paddingBottom: 100,
  },
  strainItem: {
    flexDirection: "row",
    alignItems: "flex-start",
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
  descText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginTop: 2,
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
    textAlign: "center",
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
    maxHeight: "80%",
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
  scanFab: {
    position: "absolute",
    right: 20,
    bottom: 100,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#fff",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  modalOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 4,
  },
  modalOptionDesc: {
    fontSize: 14,
    color: "#888",
  },
});
