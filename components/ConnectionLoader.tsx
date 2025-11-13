import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LOCALBACKEND_CONFIG } from '@/constants/localBackendConfig';

interface ConnectionLoaderProps {
  onConnectionSuccess: () => void;
}

export function ConnectionLoader({ onConnectionSuccess }: ConnectionLoaderProps) {
  const [attemptCount, setAttemptCount] = useState(1);
  const [lastError, setLastError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const checkConnection = async () => {
    console.log(`[ConnectionLoader] ========== Attempt ${attemptCount} ==========`);
    console.log('[ConnectionLoader] Server URL:', LOCALBACKEND_CONFIG.BASE_URL);
    console.log('[ConnectionLoader] Full health check URL:', `${LOCALBACKEND_CONFIG.BASE_URL}/api/health`);
    
    const isWeb = typeof window !== 'undefined' && !window.navigator.product?.includes('ReactNative');
    const isHttps = typeof window !== 'undefined' && window.location?.protocol === 'https:';
    const targetIsHttp = LOCALBACKEND_CONFIG.BASE_URL.startsWith('http://');
    
    if (isWeb && isHttps && targetIsHttp) {
      console.error('[ConnectionLoader] ⚠️ MIXED CONTENT BLOCKED BY BROWSER');
      console.error('[ConnectionLoader] Cannot connect from HTTPS page to HTTP server');
      console.error('[ConnectionLoader] Please use the Expo Go app on mobile or run locally with HTTP');
      setLastError('Browser security blocked: Cannot connect from HTTPS to HTTP server. Please test on mobile device with Expo Go app.');
      return;
    }
    
    try {
      console.log('[ConnectionLoader] Using XMLHttpRequest to bypass extension interference...');
      
      const result = await new Promise<{ success: boolean; data?: any; error?: string; status?: number }>((resolve) => {
        const xhr = new XMLHttpRequest();
        const timeout = setTimeout(() => {
          xhr.abort();
          resolve({ success: false, error: 'Connection timeout - server not responding' });
        }, 8000);

        xhr.onload = () => {
          clearTimeout(timeout);
          console.log('[ConnectionLoader] XHR completed, status:', xhr.status);
          console.log('[ConnectionLoader] Response:', xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ success: true, data, status: xhr.status });
            } catch (e) {
              resolve({ success: false, error: 'Invalid JSON response', status: xhr.status });
            }
          } else {
            resolve({ success: false, error: `Server returned status: ${xhr.status}`, status: xhr.status });
          }
        };

        xhr.onerror = () => {
          clearTimeout(timeout);
          console.error('[ConnectionLoader] XHR error event');
          resolve({ success: false, error: 'Network error - cannot reach server' });
        };

        xhr.onabort = () => {
          clearTimeout(timeout);
          console.error('[ConnectionLoader] XHR aborted');
          resolve({ success: false, error: 'Request aborted' });
        };

        xhr.open('GET', `${LOCALBACKEND_CONFIG.BASE_URL}/api/health`, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
      });

      if (result.success) {
        console.log('[ConnectionLoader] ✅ Connected successfully:', result.data);
        setLastError(null);
        onConnectionSuccess();
      } else {
        console.error('[ConnectionLoader] ❌ Connection failed:', result.error);
        setLastError(result.error || 'Connection failed');
        scheduleRetry();
      }
    } catch (error: any) {
      console.error('[ConnectionLoader] ❌ Exception caught:', error);
      console.error('[ConnectionLoader] Error type:', error.constructor?.name);
      console.error('[ConnectionLoader] Error message:', error.message);
      
      const errorMsg = error.message || 'Unknown error occurred';
      setLastError(errorMsg);
      scheduleRetry();
    }
  };

  const scheduleRetry = () => {
    console.log('[ConnectionLoader] Scheduling retry in 10 seconds...');
    setCountdown(10);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setAttemptCount((prev) => prev + 1);
    }, 10000);
  };

  useEffect(() => {
    checkConnection();
  }, [attemptCount]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              transform: [{ rotate: spin }, { scale: pulseValue }],
            },
          ]}
        >
          <View style={styles.spinner}>
            <View style={styles.spinnerInner} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Connecting to Server</Text>
        <Text style={styles.subtitle}>Attempt {attemptCount}</Text>

        <View style={styles.serverInfo}>
          <Text style={styles.serverLabel}>Server:</Text>
          <Text style={styles.serverUrl}>{LOCALBACKEND_CONFIG.BASE_URL}</Text>
        </View>

        {lastError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Connection Failed</Text>
            <Text style={styles.errorMessage}>{lastError}</Text>
            {countdown > 0 && (
              <Text style={styles.retryText}>
                Retrying in {countdown} second{countdown !== 1 ? 's' : ''}...
              </Text>
            )}
          </View>
        )}

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Troubleshooting:</Text>
          <Text style={styles.helpText}>• Ensure your server is running (check console)</Text>
          <Text style={styles.helpText}>• Testing on mobile? Use Expo Go app with QR code</Text>
          <Text style={styles.helpText}>• Testing on web? It may not work due to browser security</Text>
          <Text style={styles.helpText}>• Check device is on same WiFi network</Text>
          <Text style={styles.helpText}>• Update IP in constants/localBackendConfig.ts</Text>
        </View>
      </View>

      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: spinValue.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [1, 0.3, 0.3, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: spinValue.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [0.3, 1, 0.3, 0.3],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: spinValue.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [0.3, 0.3, 1, 0.3],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  spinnerContainer: {
    marginBottom: 32,
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1a1a1a',
    borderTopColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f0f0f',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  serverInfo: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  serverLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600' as const,
  },
  serverUrl: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '500' as const,
  },
  errorContainer: {
    backgroundColor: '#1a0a0a',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ff4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#ff6666',
    marginBottom: 8,
    lineHeight: 18,
  },
  retryText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600' as const,
  },
  helpContainer: {
    backgroundColor: '#0f0f0f',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#888',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
});
