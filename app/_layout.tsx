import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { trpc, trpcClient } from "@/lib/trpc";
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

  const handleConnectionSuccess = () => {
    console.log('[App] Connection established successfully');
    setIsConnected(true);
    SplashScreen.hideAsync();
  };

  if (!isConnected) {
    return <ConnectionLoader onConnectionSuccess={handleConnectionSuccess} />;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
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


