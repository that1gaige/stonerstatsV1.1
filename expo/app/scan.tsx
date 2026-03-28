import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Camera, X, FlipHorizontal } from "lucide-react-native";
import { router } from "expo-router";
import { Stack } from "expo-router";
import { generateText } from "@rork-ai/toolkit-sdk";
import { Strain, StrainType, TerpProfile } from "@/types";
import { createStrain } from "@/utils/iconGenerator";
import { useApp } from "@/contexts/AppContext";

export default function ScanScreen() {
  const { addStrain } = useApp();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#4ade80" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan strain information from your containers
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (!photo || !photo.base64) {
        Alert.alert("Error", "Failed to capture photo");
        setIsProcessing(false);
        return;
      }

      console.log("Photo captured, analyzing...");

      const analysisPrompt = `Analyze this cannabis/weed container image and extract ALL visible information about the strain. Return a JSON object with this exact structure:

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
- Be thorough - extract ALL text visible on the container
- If you can't find the strain name, look for any product name or prominent text`;

      const response = await generateText({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analysisPrompt,
              },
              {
                type: "image",
                image: `data:image/jpeg;base64,${photo.base64}`,
              },
            ],
          },
        ],
      });

      console.log("AI Response:", response);

      let parsed: any;
      try {
        let cleanedResponse = response.trim();
        
        const codeBlockMatch = cleanedResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          cleanedResponse = codeBlockMatch[1].trim();
        }
        
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON object found in response");
        }
        
        let jsonStr = jsonMatch[0];
        const bracketBalance = (jsonStr.match(/\{/g) || []).length - (jsonStr.match(/\}/g) || []).length;
        if (bracketBalance !== 0) {
          const lastBrace = jsonStr.lastIndexOf('}');
          if (lastBrace !== -1) {
            jsonStr = jsonStr.substring(0, lastBrace + 1);
          }
        }
        
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw response:", response);
        Alert.alert(
          "Scan Failed",
          "Could not extract strain information from the image. Please try again with better lighting or a clearer view of the label."
        );
        setIsProcessing(false);
        return;
      }

      if (!parsed.name || !parsed.type) {
        Alert.alert(
          "Incomplete Data",
          "Could not find essential strain information. Please try again."
        );
        setIsProcessing(false);
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
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error scanning:", error);
      Alert.alert("Error", "Failed to scan container. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Position the strain label within the frame
            </Text>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
              disabled={isProcessing}
            >
              <FlipHorizontal size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#0a0a0a" />
                  <Text style={styles.processingText}>Scanning...</Text>
                </View>
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>

            <View style={{ width: 56 }} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
  },
  topControls: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    alignSelf: "center",
    width: 300,
    height: 400,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#4ade80",
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    paddingHorizontal: 40,
    alignItems: "center",
  },
  instructionsText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomControls: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4ade80",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  processingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  processingText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0a0a0a",
    marginTop: 2,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
  },
  permissionText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#4ade80",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a0a0a",
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
  },
});
