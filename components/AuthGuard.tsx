import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { router, useSegments } from "expo-router";
import React from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useApp();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/feed");
    }
  }, [isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}
