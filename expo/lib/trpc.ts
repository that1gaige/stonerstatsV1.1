import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

type TrpcClient = ReturnType<typeof trpc.createClient>;

const resolveBaseUrl = (overrideUrl?: string) => {
  const base = overrideUrl || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  console.log('[tRPC] Using backend URL:', base);
  return base;
};

export const createTRPCClient = (overrideUrl?: string): TrpcClient =>
  trpc.createClient({
    links: [
      httpLink({
        url: `${resolveBaseUrl(overrideUrl)}/api/trpc`,
        transformer: superjson,
        async headers() {
          const token = await AsyncStorage.getItem('stonerstats_auth_token');
          console.log('[tRPC] Request with token:', token ? 'present' : 'none');
          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
      }),
    ],
  });
