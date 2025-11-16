import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  console.log('[tRPC] Using backend URL:', url);
  return url;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      async headers() {
        const token = await AsyncStorage.getItem("stonerstats_auth_token");
        console.log('[tRPC] Request with token:', token ? 'present' : 'none');
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});
