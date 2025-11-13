import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { AuthGuard } from "@/components/AuthGuard";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { LOCALBACKEND_CONFIG } from "@/constants/localBackendConfig";

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
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      console.log('[App] Checking connection to local backend...');
      console.log('[App] Server URL:', LOCALBACKEND_CONFIG.BASE_URL);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${LOCALBACKEND_CONFIG.BASE_URL}/api/health`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[App] Connected to local backend:', data);
          setConnectionError(null);
        } else {
          const errorMsg = `Server returned status: ${response.status}`;
          console.error('[App] Connection failed:', errorMsg);
          setConnectionError(errorMsg);
          Alert.alert(
            'Server Connection Failed',
            `${errorMsg}\n\nMake sure your local server is running at:\n${LOCALBACKEND_CONFIG.BASE_URL}`,
            [{ text: 'OK' }]
          );
        }
      } catch (error: any) {
        const errorMsg = error.name === 'AbortError' 
          ? 'Connection timeout - server not responding'
          : `Cannot connect to server: ${error.message}`;
        
        console.error('[App] Connection error:', errorMsg);
        setConnectionError(errorMsg);
        
        Alert.alert(
          'Cannot Connect to Server',
          `${errorMsg}\n\nPlease ensure:\n1. Your local server is running\n2. Server is at: ${LOCALBACKEND_CONFIG.BASE_URL}\n3. Your device is on the same network`,
          [{ text: 'OK' }]
        );
      } finally {
        setIsConnecting(false);
        SplashScreen.hideAsync();
      }
    };

    checkConnection();
  }, []);

  if (isConnecting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ade80" />
        <Text style={styles.loadingText}>Connecting to server...</Text>
        <Text style={styles.serverUrl}>{LOCALBACKEND_CONFIG.BASE_URL}</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600' as const,
  },
  serverUrl: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
});
