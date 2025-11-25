import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { AuthGuard } from "@/components/AuthGuard";
import { ConnectionLoader } from "@/components/ConnectionLoader";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="scan" options={{ headerShown: false, presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isConnected, setIsConnected] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [backendUrl, setBackendUrl] = useState<string | null>(null);
  const [trpcClientInstance, setTrpcClientInstance] = useState<ReturnType<typeof createTRPCClient> | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleConnectionSuccess = useCallback((url: string) => {
    console.log('[App] Connection established successfully at', url);
    setBackendUrl(url);
    setTrpcClientInstance(createTRPCClient(url));
    setIsConnected(true);
    SplashScreen.hideAsync();
  }, []);

  if (!isHydrated) {
    return null;
  }

  if (!isConnected || !trpcClientInstance || !backendUrl) {
    return <ConnectionLoader onConnectionSuccess={handleConnectionSuccess} />;
  }

  return (
    <trpc.Provider client={trpcClientInstance} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthGuard>
            <GestureHandlerRootView>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </AuthGuard>
        </AppProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}


