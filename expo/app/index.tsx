import { useApp } from "@/contexts/AppContext";
import { Redirect } from "expo-router";
import { View, StyleSheet, Animated, Easing, Text } from "react-native";
import { Flame } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";

export default function Index() {
  const { isAuthenticated, isLoading } = useApp();
  const [showAnimation, setShowAnimation] = useState(true);

  const flameScale = useRef(new Animated.Value(0)).current;
  const flameOpacity = useRef(new Animated.Value(1)).current;
  const smokeOpacity1 = useRef(new Animated.Value(0)).current;
  const smokeOpacity2 = useRef(new Animated.Value(0)).current;
  const smokeOpacity3 = useRef(new Animated.Value(0)).current;
  const smokeY1 = useRef(new Animated.Value(0)).current;
  const smokeY2 = useRef(new Animated.Value(0)).current;
  const smokeY3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(flameScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(flameOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(flameOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(smokeOpacity1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(smokeY1, {
            toValue: -100,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(smokeOpacity2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(smokeY2, {
            toValue: -120,
            duration: 1400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(smokeOpacity1, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(smokeOpacity3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(smokeY3, {
            toValue: -140,
            duration: 1600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(smokeOpacity2, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(smokeOpacity3, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowAnimation(false);
      });
    }
  }, [isLoading]);

  if (isLoading && showAnimation) {
    return (
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.flameContainer,
              {
                opacity: flameOpacity,
                transform: [{ scale: flameScale }],
              },
            ]}
          >
            <Flame size={120} color="#4ade80" fill="#4ade80" />
          </Animated.View>

          <Animated.View
            style={[
              styles.smokeCircle,
              {
                opacity: smokeOpacity1,
                transform: [{ translateY: smokeY1 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.smokeCircle,
              styles.smokeCircle2,
              {
                opacity: smokeOpacity2,
                transform: [{ translateY: smokeY2 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.smokeCircle,
              styles.smokeCircle3,
              {
                opacity: smokeOpacity3,
                transform: [{ translateY: smokeY3 }],
              },
            ]}
          />

          <Text style={styles.animationText}>Let's burn 🔥</Text>
        </View>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/feed" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  flameContainer: {
    marginBottom: 20,
  },
  smokeCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(74, 222, 128, 0.3)",
    top: 80,
  },
  smokeCircle2: {
    width: 90,
    height: 90,
    borderRadius: 45,
    left: -15,
  },
  smokeCircle3: {
    width: 100,
    height: 100,
    borderRadius: 50,
    left: 10,
  },
  animationText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#4ade80",
    marginTop: 180,
    letterSpacing: 1,
  },
});
