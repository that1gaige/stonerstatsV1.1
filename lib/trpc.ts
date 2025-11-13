import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALBACKEND_CONFIG } from "@/constants/localBackendConfig";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  console.log('[tRPC] Using local backend URL:', LOCALBACKEND_CONFIG.BASE_URL);
  return LOCALBACKEND_CONFIG.BASE_URL;
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      async headers() {
        const token = await AsyncStorage.getItem("localbackend_auth_token");
        console.log('[tRPC] Request with token:', token ? 'present' : 'none');
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});
