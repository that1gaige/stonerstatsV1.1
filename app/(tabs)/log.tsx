import { StrainIcon } from "@/components/StrainIcon";
import { getStrainIcon } from "@/constants/icons";
import { EXPLORE_STRAINS_DATA } from "@/constants/exploreStrains";
import { EffectTag, Method, Strain } from "@/types";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Check, Scan } from "lucide-react-native";
import { router } from "expo-router";
import { trpc } from "@/lib/trpc";
import { useApp } from "@/contexts/AppContext";

const METHODS: Method[] = ["joint", "bong", "pipe", "vape", "edible", "dab"];
const EFFECTS: EffectTag[] = [
  "relaxed",
  "creative",
  "focused",
  "sleepy",
  "euphoric",
  "hungry",
  "social",
  "pain_relief",
  "energetic",
  "happy",
];

export default function LogScreen() {
  const { user } = useApp();
  const strainsQuery = trpc.strains.getAll.useQuery();
  const createSessionMutation = trpc.sessions.create.useMutation({
    onSuccess: () => {
      Alert.alert("Success", "Session logged!");
      setSelectedStrain(null);
      setMethod("joint");
      setAmount("0.5");
      setMoodBefore(null);
      setMoodAfter(null);
      setSelectedEffects(new Set());
      setNotes("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  
  const allStrains = useMemo<Strain[]>(() => {
    const userStrains = strainsQuery.data || [];
    const exploreStrains: Strain[] = EXPLORE_STRAINS_DATA.map((strain, idx) => ({
      strain_id: `explore_${strain.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: strain.name,
      type: strain.type,
      terp_profile: [...strain.terp_profile] as any,
      description: strain.description,
      icon_seed: `explore_${idx}`,
      icon_render_params: {
        leaf_count: 5,
        leaf_spread_pct: 75,
        serration_depth_pct: 30,
        stem_length_pct: 40,
        rotation_jitter_deg: 15,
        stroke_px: 2,
        outer_glow_enabled: true,
        outer_glow_intensity_pct: 50,
        texture_noise_seed: idx,
        background_hue: strain.type === 'indica' ? 270 : strain.type === 'sativa' ? 140 : 30,
        palette: {
          base_hue: strain.type === 'indica' ? 270 : strain.type === 'sativa' ? 140 : 30,
          accent_hue_shift_deg: 20,
          saturation_pct: 65,
          lightness_pct: 50,
          stroke_variant_lightness_delta: -10,
          glow_variant_lightness_delta: 15,
        },
        gradient: {
          enabled: false,
          type: 'linear' as const,
          angle_deg: 45,
          blend_mode: 'overlay' as const,
          opacity_pct: 30,
          stops: [],
        },
      },
      created_at: new Date(),
      source: 'developer' as const,
    }));

    const deduped = new Map<string, Strain>();
    for (const s of userStrains) {
      const key = s.strain_id && s.strain_id.length > 0 ? s.strain_id : s.name;
      if (!deduped.has(key)) deduped.set(key, s);
    }
    for (const s of exploreStrains) {
      const key = s.strain_id && s.strain_id.length > 0 ? s.strain_id : s.name;
      if (!deduped.has(key)) deduped.set(key, s);
    }

    const result = Array.from(deduped.values());
    result.sort((a, b) => {
      const aIsUser = a.source === 'user';
      const bIsUser = b.source === 'user';
      if (aIsUser && !bIsUser) return -1;
      if (!aIsUser && bIsUser) return 1;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [strainsQuery.data]);

  const [method, setMethod] = useState<Method>("joint");
  const [amount, setAmount] = useState("0.5");
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<Set<EffectTag>>(new Set());
  const [notes, setNotes] = useState("");
  const [showStrainPicker, setShowStrainPicker] = useState(false);

  const toggleEffect = (effect: EffectTag) => {
    const newSet = new Set(selectedEffects);
    if (newSet.has(effect)) {
      newSet.delete(effect);
    } else {
      if (newSet.size >= 5) {
        Alert.alert("Max Effects", "You can select up to 5 effects");
        return;
      }
      newSet.add(effect);
    }
    setSelectedEffects(newSet);
  };

  const handleSubmit = async () => {
    if (!selectedStrain) {
      Alert.alert("Missing Strain", "Please select a strain");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    createSessionMutation.mutate({
      strain_id: selectedStrain.strain_id,
      method,
      amount: amountNum,
      amount_unit: user.preferences.default_unit,
      mood_before: moodBefore || undefined,
      mood_after: moodAfter || undefined,
      effects_tags: Array.from(selectedEffects),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Strain</Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/scan")}
          >
            <Scan size={20} color="#4ade80" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        {selectedStrain ? (
          <TouchableOpacity
            style={styles.selectedStrain}
            onPress={() => setShowStrainPicker(true)}
          >
            <StrainIcon params={selectedStrain.icon_render_params} size={48} baseLeafSource={getStrainIcon(selectedStrain)} fillSeedUUID={selectedStrain.strain_id} />
            <View style={styles.strainInfo}>
              <Text style={styles.strainName}>{selectedStrain.name}</Text>
              <Text style={styles.strainType}>{selectedStrain.type}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowStrainPicker(true)}
          >
            <Text style={styles.selectButtonText}>Select Strain</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showStrainPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStrainPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStrainPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Strain</Text>
              <TouchableOpacity
                onPress={() => setShowStrainPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {allStrains.map((strain, index) => (
                <TouchableOpacity
                  key={strain.strain_id && strain.strain_id.length > 0 ? strain.strain_id : `${strain.name}-${index}`}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedStrain(strain);
                    setShowStrainPicker(false);
                  }}
                >
                  <StrainIcon params={strain.icon_render_params} size={40} baseLeafSource={getStrainIcon(strain)} fillSeedUUID={strain.strain_id} />
                  <View style={styles.pickerItemInfo}>
                    <Text style={styles.pickerItemText}>{strain.name}</Text>
                    {strain.source === 'user' && (
                      <Text style={styles.pickerItemBadge}>My Strain</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Method</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.methodGrid}
        >
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.methodChip, method === m && styles.methodChipActive]}
              onPress={() => setMethod(m)}
            >
              <Text
                style={[
                  styles.methodChipText,
                  method === m && styles.methodChipTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount ({user.preferences.default_unit})</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.5"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Before (1-5)</Text>
        <View style={styles.moodRow}>
          {[1, 2, 3, 4, 5].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.moodButton, moodBefore === m && styles.moodButtonActive]}
              onPress={() => setMoodBefore(m)}
            >
              <Text
                style={[
                  styles.moodButtonText,
                  moodBefore === m && styles.moodButtonTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood After (1-5)</Text>
        <View style={styles.moodRow}>
          {[1, 2, 3, 4, 5].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.moodButton, moodAfter === m && styles.moodButtonActive]}
              onPress={() => setMoodAfter(m)}
            >
              <Text
                style={[
                  styles.moodButtonText,
                  moodAfter === m && styles.moodButtonTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Effects (max 5)</Text>
        <View style={styles.effectsGrid}>
          {EFFECTS.map((effect) => (
            <TouchableOpacity
              key={effect}
              style={[
                styles.effectChip,
                selectedEffects.has(effect) && styles.effectChipActive,
              ]}
              onPress={() => toggleEffect(effect)}
            >
              {selectedEffects.has(effect) && (
                <Check size={14} color="#fff" style={styles.checkIcon} />
              )}
              <Text
                style={[
                  styles.effectChipText,
                  selectedEffects.has(effect) && styles.effectChipTextActive,
                ]}
              >
                {effect}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="How was your experience?"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, createSessionMutation.isPending && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={createSessionMutation.isPending}
      >
        {createSessionMutation.isPending ? (
          <ActivityIndicator color="#0a0a0a" />
        ) : (
          <Text style={styles.submitButtonText}>Log Session</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#4ade80",
  },
  selectedStrain: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  strainInfo: {
    flex: 1,
  },
  strainName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 4,
  },
  strainType: {
    fontSize: 14,
    color: "#888",
    textTransform: "capitalize",
  },
  selectButton: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#333",
    borderStyle: "dashed",
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#666",
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
    borderRadius: 16,
    width: "100%",
    maxHeight: 500,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "700" as const,
  },
  modalScroll: {
    padding: 8,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: 4,
  },
  pickerItemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600" as const,
  },
  pickerItemBadge: {
    fontSize: 12,
    color: "#4ade80",
    fontWeight: "700" as const,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodGrid: {
    gap: 8,
  },
  methodChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#fff",
    borderWidth: 2,
    borderColor: "#333",
  },
  notesInput: {
    minHeight: 100,
    paddingTop: 16,
  },
  moodRow: {
    flexDirection: "row",
    gap: 12,
  },
  moodButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#333",
  },
  moodButtonActive: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
  },
  moodButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#999",
  },
  moodButtonTextActive: {
    color: "#0a0a0a",
  },
  effectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  checkIcon: {
    marginRight: 2,
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
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0a0a0a",
  },
});
