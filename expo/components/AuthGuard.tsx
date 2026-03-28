import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { router, useSegments, usePathname } from "expo-router";
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useApp();
  const segments = useSegments();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const isIndexRoute = pathname === "/";

    if (!isAuthenticated && !inAuthGroup && !isIndexRoute) {
      setIsNavigating(true);
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup && !isIndexRoute) {
      setIsNavigating(true);
      router.replace("/(tabs)/feed");
    } else {
      setIsNavigating(false);
    }
  }, [isAuthenticated, isLoading, segments, pathname]);

  if (isLoading || isNavigating) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
});
