# Simplified Backend Architecture

## The Problem We Fixed

Previously, the app had **3 different auth systems** fighting each other:
1. Rork tRPC Backend (TypeScript)
2. Local Backend tRPC Adapter (JavaScript) 
3. Local Backend REST API (JavaScript)

This caused "Unable to transform response from server" errors because:
- The tRPC adapter returned different field names (`username`) than the Rork backend expected (`displayName`, `handle`)
- Schema mismatches between systems
- Complex routing through multiple layers

## The Solution

**Use ONE system: Simple REST API**

### What Changed

✅ **Signup/Login** now uses direct REST API calls via `localBackendAPI`
✅ **No more tRPC confusion** - removed tRPC adapter from local backend
✅ **Simpler flow**: App → REST API → JSON response
✅ **Works everywhere**: Web, iOS, Android
✅ **Easy to debug**: Simple HTTP requests in network tab

### Architecture Now

```
┌─────────────┐
│   Expo App  │
│ (TypeScript)│
└──────┬──────┘
       │
       │ Direct HTTP calls
       │ (localBackendAPI)
       │
┌──────▼──────────┐
│  Local Backend  │
│   Express.js    │
│   REST API      │
└─────────────────┘
```

### How to Use

#### 1. Start the Local Backend

```bash
cd localbackend
node index.js
```

You'll see:
```
================================
🌿 StonerStats Backend Server
================================
Status: RUNNING
Port: 4000

Access URLs:
  Local:   http://localhost:4000
  Network: http://192.168.10.226:4000
================================
```

#### 2. Update Server IP in App

Edit `constants/localBackendConfig.ts`:

```typescript
export const SERVER_OPTIONS: ServerOption[] = [
  {
    id: 'new-local',
    name: 'Local Server (New)',
    url: 'http://YOUR_IP_HERE:4000',  // ← Update this
    description: 'Latest server instance',
  },
  // ... other options
];
```

#### 3. Test on Mobile (REQUIRED)

⚠️ **Web preview will NOT work with local backend** (CORS + mixed content)

**You MUST use Expo Go on your phone:**
1. Open Expo Go app on your phone
2. Scan the QR code from `bun expo start`
3. Ensure phone is on same WiFi as computer

#### 4. Sign Up Flow

1. App shows ConnectionLoader
2. Tries to connect to selected server
3. Once connected, shows login/signup screens
4. User signs up → Direct REST call to `/api/auth/signup`
5. Response: `{ user: {...}, token: "..." }`
6. App stores token and navigates to feed

### Server Selection

The app now has a built-in server selector in ConnectionLoader:

```
Server Options:
1. Local Server (New) - Your latest IP
2. Local Server (Previous) - Previous IP  
3. Rork Backend (Offline) - Rork-hosted (if available)
```

You can switch servers by clicking the ⚙ button in ConnectionLoader.

### API Endpoints

All endpoints are simple REST:

**Auth:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

**Strains:**
- `GET /api/strains` - List strains
- `POST /api/strains` - Create strain
- `PUT /api/strains/:id` - Update strain
- `DELETE /api/strains/:id` - Delete strain

**Sessions:**
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Data Storage

Local backend stores data in JSON files:
- `localbackend/data/users.json`
- `localbackend/data/strains.json`
- `localbackend/data/sessions.json`

### Troubleshooting

**"Connection timeout"**
- Is the server running? Check terminal
- Is phone on same WiFi as computer?
- Update IP in `localBackendConfig.ts`

**"Unable to transform response"** (SHOULD BE FIXED NOW)
- This error is gone! We removed tRPC adapter

**"Mixed content blocked"**
- Don't use web preview with local backend
- Use Expo Go on mobile device

**"Network error"**
- Check firewall settings
- Ensure server is bound to `0.0.0.0` not `localhost`

### Benefits of This Approach

✅ **Simple** - One clear path from app to backend
✅ **Debuggable** - Standard HTTP requests
✅ **Reliable** - No schema transformation issues
✅ **Cross-platform** - Works on all devices
✅ **Fast development** - Quick iteration with hot reload
✅ **Easy to understand** - Standard REST patterns

### Future Options

If you need the full Rork backend features (tRPC, database, etc.):
1. Keep this local backend for quick testing
2. Deploy to production with full Rork backend
3. App already supports multiple backend URLs
