import { useApp } from "@/contexts/AppContext";
import { StrainIcon } from "@/components/StrainIcon";
const ICON_INDICA = require("@/assets/images/iconindica.png");
const ICON_SATIVA = require("@/assets/images/iconsativa.png");
const ICON_HYBRID_A = require("@/assets/images/iconhybrid.png");
const ICON_HYBRID_B = require("@/assets/images/iconhybrid2.png");
import { EffectTag, Method, SmokeSession, Strain } from "@/types";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Check } from "lucide-react-native";

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
  const { strains, user, addSession } = useApp();
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const dedupedStrains = useMemo<Strain[]>(() => {
    const m = new Map<string, Strain>();
    for (const s of strains) {
      const key = s.strain_id && s.strain_id.length > 0 ? s.strain_id : s.name;
      if (!m.has(key)) m.set(key, s);
    }
    return Array.from(m.values());
  }, [strains]);
  const [method, setMethod] = useState<Method>("joint");
  const [amount, setAmount] = useState("0.5");
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<Set<EffectTag>>(new Set());
  const [notes, setNotes] = useState("");
  const [showStrainPicker, setShowStrainPicker] = useState(false);

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

    const session: SmokeSession = {
      session_id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      user_id: user.user_id,
      strain_id: selectedStrain.strain_id,
      method,
      amount: amountNum,
      amount_unit: user.preferences.default_unit,
      mood_before: moodBefore || undefined,
      mood_after: moodAfter || undefined,
      effects_tags: Array.from(selectedEffects),
      notes: notes.trim() || undefined,
      created_at: new Date(),
    };

    await addSession(session);

    setSelectedStrain(null);
    setMethod("joint");
    setAmount("0.5");
    setMoodBefore(null);
    setMoodAfter(null);
    setSelectedEffects(new Set());
    setNotes("");

    Alert.alert("Success", "Session logged!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strain</Text>
        {selectedStrain ? (
          <TouchableOpacity
            style={styles.selectedStrain}
            onPress={() => setShowStrainPicker(true)}
          >
            <StrainIcon params={selectedStrain.icon_render_params} size={48} baseLeafSource={baseLeafFor(selectedStrain)} fillSeedUUID={selectedStrain.strain_id} />
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

      {showStrainPicker && (
        <View style={styles.picker}>
          <ScrollView style={styles.pickerScroll}>
            {dedupedStrains.map((strain, index) => (
              <TouchableOpacity
                key={strain.strain_id && strain.strain_id.length > 0 ? strain.strain_id : `${strain.name}-${index}`}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedStrain(strain);
                  setShowStrainPicker(false);
                }}
              >
                <StrainIcon params={strain.icon_render_params} size={40} baseLeafSource={baseLeafFor(strain)} fillSeedUUID={strain.strain_id} />
                <Text style={styles.pickerItemText}>{strain.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Log Session</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#fff",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  picker: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 24,
    maxHeight: 300,
    overflow: "hidden",
  },
  pickerScroll: {
    padding: 8,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600" as const,
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
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0a0a0a",
  },
});
