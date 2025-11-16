# Local Backend Migration Complete ✅

All API calls now go through the local backend instead of the Rork-provided backend.

## Changes Made

### 1. **lib/trpc.ts**
- Updated to use `LOCALBACKEND_CONFIG.BASE_URL` instead of `process.env.EXPO_PUBLIC_BACKEND_URL`
- Changed token storage key from `"stonerstats_auth_token"` to `"localbackend_auth_token"`
- All tRPC calls now route to local backend at `/api/trpc`

### 2. **contexts/AppContext.tsx**
- Updated `AUTH_TOKEN` storage key to `"localbackend_auth_token"` to match local backend

### 3. **app/auth/login.tsx**
- Replaced `trpc.auth.login.useMutation()` with direct `localBackendAPI.login()` calls
- Maps local backend user response to app user format
- Uses loading state instead of mutation.isPending

### 4. **app/auth/signup.tsx**
- Replaced `trpc.auth.signup.useMutation()` with direct `localBackendAPI.signup()` calls
- Maps local backend user response to app user format
- Uses loading state instead of mutation.isPending

### 5. **app/(tabs)/feed.tsx**
- Replaced `trpc.sessions.getFeed.useQuery()` with React Query + `localBackendAPI.getSessions()`
- Replaced `trpc.sessions.like/unlike` with placeholder mutations
- Transforms local backend session data into the expected feed format
- Fetches strains and sessions separately, then joins them client-side

### 6. **app/(tabs)/log.tsx**
- Replaced `trpc.strains.getAll.useQuery()` with React Query + `localBackendAPI.getStrains()`
- Replaced `trpc.sessions.create.useMutation()` with React Query + `localBackendAPI.createSession()`
- Transforms local backend strains into app strain format with icon rendering parameters
- Combines user strains from backend with explore strains from constants

## Local Backend Configuration

The app now uses the URL configured in `constants/localBackendConfig.ts`:

```typescript
export const SERVER_OPTIONS: ServerOption[] = [
  {
    id: 'new-local',
    name: 'Local Server (New)',
    url: 'http://192.168.10.226:4000',
    description: 'Latest server instance',
  },
  // ... other options
];
```

## How It Works

1. **Connection Check**: `ConnectionLoader` component tests connection to local backend on startup
2. **Authentication**: Login/signup flows save token to AsyncStorage with key `"localbackend_auth_token"`
3. **API Calls**: All screens use `localBackendAPI` utility which:
   - Automatically adds auth token to requests
   - Handles errors and network issues
   - Provides comprehensive logging

4. **React Query Integration**: Feed and Log screens use React Query for:
   - Caching data
   - Automatic refetching
   - Loading states
   - Error handling

## Testing

To test the app:

1. Make sure local backend server is running on the configured IP:port
2. Start the app with `bun start` or `npx expo start`
3. Use Expo Go app on mobile device (same WiFi network)
4. App will connect to local backend on startup
5. All operations (login, signup, logging sessions, viewing feed) use local backend

## Backend Endpoints Used

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/strains` - Get all strains
- `POST /api/strains` - Create strain
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create session
- `GET /api/health` - Health check

All endpoints documented in `utils/localBackendAPI.ts`
