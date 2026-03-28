# 🏗️ LocalBackend Architecture Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    STONERSTATS MVP                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐           ┌──────────────────┐
│   📱 MOBILE APP  │           │   💻 WEB APP     │
│   (Expo Go)      │           │   (Disabled)     │
└────────┬─────────┘           └────────┬─────────┘
         │                              │
         │  HTTP/REST API               │
         │  (JSON)                      │
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   🌐 LOCAL BACKEND SERVER    │
         │   Express.js on port 4000    │
         │   http://192.168.x.x:4000    │
         └──────────────┬───────────────┘
                        │
         ┌──────────────┴───────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────┐
│  📁 JSON FILES  │          │  🔐 BCrypt Auth │
│  /localbackend/ │          │  JWT Tokens     │
│  /data/         │          └─────────────────┘
└─────────────────┘
    │
    ├── users.json       (user accounts)
    ├── strains.json     (strain library)
    └── sessions.json    (smoke sessions)
```

---

## Request Flow

### Signup Flow
```
1. USER ACTION
   User fills signup form
   ↓

2. FRONTEND
   app/auth/signup.tsx
   Collects: display_name, handle, password
   ↓

3. API CALL
   POST http://192.168.x.x:4000/api/auth/signup
   Body: { display_name, handle, password }
   ↓

4. BACKEND ROUTING
   localbackend/index.js
   → routes/auth.js
   → controllers/authController.js
   ↓

5. AUTHENTICATION
   • Check if handle exists
   • Hash password with bcrypt
   • Generate user_id (UUID)
   • Create user object
   • Save to users.json
   • Generate JWT token
   ↓

6. RESPONSE
   200 OK
   { user: {...}, token: "jwt..." }
   ↓

7. FRONTEND PROCESSING
   • Save token to AsyncStorage
   • Set user in context
   • Navigate to /(tabs)/feed
   ↓

8. SUCCESS ✅
   User is logged in
```

### Login Flow
```
1. USER ACTION
   User enters handle + password
   ↓

2. FRONTEND
   app/auth/login.tsx
   ↓

3. API CALL
   POST /api/auth/login
   Body: { handle, password }
   ↓

4. BACKEND VALIDATION
   • Find user by handle
   • Compare password with bcrypt
   • If valid, generate JWT
   • Return user + token
   ↓

5. SUCCESS ✅
   Token saved, user logged in
```

### Log Session Flow
```
1. USER ACTION
   User fills session form
   (strain, method, amount, effects, etc.)
   ↓

2. FRONTEND
   app/(tabs)/log.tsx
   Uses tRPC client (trpc.sessions.create.useMutation)
   ↓

3. TRPC → REST TRANSLATION
   lib/trpc.ts
   Converts tRPC call to HTTP request
   ↓

4. API CALL
   POST /api/sessions
   Headers: { Authorization: "Bearer <token>" }
   Body: { strain_id, method, amount, ... }
   ↓

5. BACKEND PROCESSING
   • Validate JWT token
   • Verify strain exists
   • Generate session_id (UUID)
   • Add timestamps
   • Save to sessions.json
   ↓

6. RESPONSE
   200 OK
   { session: {...} }
   ↓

7. FRONTEND UPDATE
   • React Query invalidates cache
   • Feed refetches
   • New session appears
   ↓

8. SUCCESS ✅
   Session logged, visible in feed
```

### Get Feed Flow
```
1. USER OPENS FEED TAB
   app/(tabs)/feed.tsx
   ↓

2. REACT QUERY
   trpc.sessions.getFeed.useQuery()
   ↓

3. API CALL
   GET /api/sessions/feed
   Headers: { Authorization: "Bearer <token>" }
   ↓

4. BACKEND PROCESSING
   • Validate token
   • Load sessions.json
   • Load users.json
   • Load strains.json
   • Join data (session + user + strain)
   • Sort by created_at DESC
   • Add has_liked flag for current user
   • Return enriched array
   ↓

5. RESPONSE
   200 OK
   [
     {
       session: {...},
       user: {...},
       strain: {...}
     },
     ...
   ]
   ↓

6. FRONTEND RENDERING
   • FlatList renders sessions
   • Shows user avatar, strain icon
   • Displays spark counts
   • Enables spark/unspark actions
   ↓

7. SUCCESS ✅
   Feed displays all sessions
```

---

## File Structure Deep Dive

### Backend Directory
```
localbackend/
│
├── index.js                    # Main server entry point
│   ├── Express app setup
│   ├── CORS configuration
│   ├── Body parser middleware
│   ├── Route mounting
│   └── Server start (port 4000)
│
├── routes/
│   ├── auth.js                 # Auth endpoints
│   │   ├── POST /signup
│   │   ├── POST /login
│   │   └── GET  /me
│   │
│   ├── strains.js              # Strain endpoints
│   │   ├── GET    /strains
│   │   ├── POST   /strains
│   │   ├── GET    /strains/:id
│   │   └── DELETE /strains/:id
│   │
│   └── sessions.js             # Session endpoints
│       ├── GET    /sessions
│       ├── POST   /sessions
│       ├── GET    /sessions/feed
│       ├── POST   /sessions/:id/like
│       └── DELETE /sessions/:id/like
│
├── controllers/
│   ├── authController.js       # Auth business logic
│   │   ├── signup()
│   │   ├── login()
│   │   └── getMe()
│   │
│   ├── strainsController.js    # Strains business logic
│   │   ├── getAllStrains()
│   │   ├── createStrain()
│   │   ├── getStrainById()
│   │   └── deleteStrain()
│   │
│   └── sessionsController.js   # Sessions business logic
│       ├── getAllSessions()
│       ├── createSession()
│       ├── getFeed()
│       ├── likeSession()
│       └── unlikeSession()
│
├── middleware/
│   └── auth.js                 # JWT verification
│       └── verifyToken()
│
├── config/
│   └── dataManager.js          # JSON file operations
│       ├── readData()
│       └── writeData()
│
└── data/                       # JSON storage
    ├── users.json              # User accounts
    ├── strains.json            # Strain library
    └── sessions.json           # Smoke sessions
```

---

## Data Models

### User Object
```json
{
  "user_id": "uuid-v4",
  "display_name": "John Doe",
  "handle": "johndoe",
  "password_hash": "bcrypt-hash",
  "created_at": "2025-01-17T10:30:00.000Z",
  "following_user_ids": ["uuid-1", "uuid-2"],
  "preferences": {
    "default_unit": "g",
    "dark_mode": true,
    "notifications_enabled": true,
    "privacy_level": "public"
  }
}
```

### Strain Object
```json
{
  "strain_id": "uuid-v4",
  "name": "Blue Dream",
  "type": "hybrid",
  "terp_profile": ["myrcene", "pinene", "caryophyllene"],
  "description": "A balanced hybrid...",
  "breeder": "DJ Short",
  "icon_seed": "uuid-v4",
  "icon_render_params": {
    "leaf_count": 7,
    "leaf_spread_pct": 80,
    "serration_depth_pct": 35,
    "palette": { ... },
    "gradient": { ... }
  },
  "created_at": "2025-01-17T10:30:00.000Z",
  "created_by": "user-uuid",
  "source": "user"
}
```

### Session Object
```json
{
  "session_id": "uuid-v4",
  "user_id": "user-uuid",
  "strain_id": "strain-uuid",
  "method": "joint",
  "amount": 0.5,
  "amount_unit": "g",
  "mood_before": 3,
  "mood_after": 5,
  "effects_tags": ["relaxed", "creative", "happy"],
  "notes": "Perfect for evening chill",
  "created_at": "2025-01-17T10:30:00.000Z",
  "liked_by_user_ids": ["uuid-1", "uuid-2"],
  "likes_count": 2
}
```

---

## Authentication System

### JWT Token Structure
```json
{
  "user_id": "uuid-v4",
  "handle": "johndoe",
  "iat": 1705492200,
  "exp": 1705578600
}
```

### Token Flow
```
1. USER LOGS IN
   ↓
2. Server generates JWT
   jwt.sign({ user_id, handle }, SECRET, { expiresIn: '24h' })
   ↓
3. Token sent to client
   Response: { token: "eyJhbGc..." }
   ↓
4. Client stores token
   AsyncStorage.setItem('stonerstats_auth_token', token)
   ↓
5. All protected requests include token
   Headers: { Authorization: "Bearer eyJhbGc..." }
   ↓
6. Middleware verifies token
   jwt.verify(token, SECRET)
   ↓
7. Request proceeds with user context
   req.user = { user_id, handle }
```

---

## API Response Formats

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `409` - Conflict (duplicate)
- `500` - Server error

---

## Network Configuration

### Required Setup
```
┌─────────────────────────────────────┐
│  Computer (192.168.1.100)          │
│  ├── Node.js server (port 4000)    │
│  └── Expo dev server (port 19000)  │
└─────────────────────────────────────┘
                 │
        Same WiFi Network
                 │
┌─────────────────────────────────────┐
│  Phone (192.168.1.101)             │
│  └── Expo Go app                    │
└─────────────────────────────────────┘
```

### Firewall Rules Needed
- Allow inbound on port 4000 (backend)
- Allow inbound on port 19000 (Expo)
- No need for port forwarding (local network only)

### Common Network Issues
1. **CORS Error** - Backend has CORS enabled for `*`
2. **Timeout** - Phone not on same WiFi
3. **Connection Refused** - Firewall blocking ports
4. **Wrong IP** - IP changed, update config file

---

## Security Considerations

### Current Security (Development)
- ✅ Password hashing with bcrypt
- ✅ JWT tokens for auth
- ✅ Authorization middleware
- ✅ Input validation (basic)
- ⚠️ No HTTPS (local HTTP only)
- ⚠️ Weak JWT secret
- ⚠️ No rate limiting
- ⚠️ No request sanitization

### Production Security Needs
- 🔒 HTTPS/SSL certificates
- 🔒 Strong JWT secret from env vars
- 🔒 Token expiration + refresh tokens
- 🔒 Rate limiting (express-rate-limit)
- 🔒 Input sanitization (express-validator)
- 🔒 SQL injection prevention (use ORM)
- 🔒 XSS protection
- 🔒 CSRF tokens
- 🔒 Content Security Policy headers
- 🔒 Helmet.js middleware

---

## Performance Optimization

### Current Limitations
- 📁 JSON files (slow for large datasets)
- 🐌 No caching
- 🐌 No pagination
- 🐌 No database indexes
- 🐌 No query optimization

### Production Optimizations
- 🚀 Real database (PostgreSQL)
- 🚀 Redis caching
- 🚀 Pagination (limit/offset)
- 🚀 Database indexes
- 🚀 Query optimization
- 🚀 CDN for assets
- 🚀 Image compression
- 🚀 Lazy loading

---

## Scaling Path

### Phase 1: Local Dev (Current)
```
1 user → JSON files → Works perfectly
```

### Phase 2: Small Beta
```
10-100 users → SQLite → Should be fine
```

### Phase 3: Public Beta
```
100-1000 users → PostgreSQL + Redis → Need optimization
```

### Phase 4: Production
```
1000+ users → PostgreSQL + Redis + CDN + Load Balancer
```

---

## Monitoring & Debugging

### Server Logs
The backend logs everything:
```bash
node index.js

# You'll see:
[2025-01-17T10:30:00.000Z] POST /api/auth/signup
[2025-01-17T10:30:01.000Z] POST /api/auth/login
[2025-01-17T10:30:05.000Z] GET /api/sessions/feed
```

### React Query DevTools
Enable to see all API calls in app:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Add to root component
```

### Network Inspection
Use Charles Proxy or similar to inspect:
- Request headers
- Request body
- Response status
- Response body
- Timing

---

## Common Backend Tasks

### Reset Database
```bash
cd localbackend/data
# Delete all data
rm users.json strains.json sessions.json
# Server will recreate empty files
```

### Add Test Data
```bash
# Use server endpoints or manually edit JSON files
# Example: Add test user to users.json
```

### Change Port
```javascript
// localbackend/index.js
const PORT = process.env.PORT || 4000; // Change 4000
```

### Enable HTTPS (Local)
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update index.js
const https = require('https');
const fs = require('fs');

const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app);

server.listen(4000);
```

---

## Migration to Production

### Step 1: Choose Backend Platform
- **Railway** - Easy, PostgreSQL included
- **Render** - Free tier, good docs
- **Fly.io** - Fast, global edge
- **Vercel** - Serverless, great DX
- **AWS/GCP/Azure** - Enterprise-grade

### Step 2: Database Migration
```javascript
// Replace JSON files with Prisma ORM
npm install @prisma/client

// schema.prisma
model User {
  id            String   @id @default(uuid())
  displayName   String
  handle        String   @unique
  passwordHash  String
  createdAt     DateTime @default(now())
  // ...
}
```

### Step 3: Environment Variables
```bash
# .env
DATABASE_URL="postgresql://..."
JWT_SECRET="strong-secret-here"
NODE_ENV="production"
```

### Step 4: Deploy
```bash
# Railway example
railway login
railway init
railway up
```

### Step 5: Update App Config
```typescript
// Update API URL to production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.railway.app'
  : 'http://192.168.x.x:4000';
```

---

## Troubleshooting Guide

### Issue: Server Won't Start
**Symptoms:** Port already in use

**Solution:**
```bash
# Find process using port 4000
lsof -i :4000
# Kill it
kill -9 <PID>
# Or use different port
```

### Issue: CORS Error
**Symptoms:** Network error in app

**Solution:**
```javascript
// localbackend/index.js
// Ensure CORS is configured
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

### Issue: JWT Invalid
**Symptoms:** 401 Unauthorized

**Solution:**
- Check token is being sent in header
- Verify JWT_SECRET matches
- Token might be expired
- Logout and login again

### Issue: JSON File Corrupted
**Symptoms:** Server crash on startup

**Solution:**
```bash
# Validate JSON
cat localbackend/data/users.json | jq .
# If invalid, fix manually or delete and restart
```

---

## Best Practices

### Development
1. ✅ Always run server before starting app
2. ✅ Check server logs for errors
3. ✅ Use meaningful variable names
4. ✅ Add console.log for debugging
5. ✅ Test on real device, not web
6. ✅ Keep JSON files backed up
7. ✅ Use Postman to test endpoints
8. ✅ Read error messages carefully

### Code Organization
1. ✅ Controllers for business logic
2. ✅ Routes for endpoint definitions
3. ✅ Middleware for cross-cutting concerns
4. ✅ Models for data structures
5. ✅ Utils for helper functions
6. ✅ Config for settings

### Error Handling
```javascript
// Always wrap async code
try {
  const result = await someAsyncFunction();
  res.json({ data: result });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}
```

---

## Quick Reference

### Start Everything
```bash
# Terminal 1: Backend
cd localbackend && node index.js

# Terminal 2: App
bun expo start
```

### Test Endpoints
```bash
# Health check
curl http://192.168.x.x:4000/api/health

# Signup
curl -X POST http://192.168.x.x:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"display_name":"Test","handle":"test","password":"test123"}'

# Login
curl -X POST http://192.168.x.x:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"handle":"test","password":"test123"}'
```

### Reset App
```bash
# Clear all app data
# iOS: Delete app and reinstall
# Android: Settings → Apps → Expo Go → Clear data
```

---

## Summary

You now understand:
- ✅ How the backend server works
- ✅ How requests flow through the system
- ✅ How data is stored and retrieved
- ✅ How authentication is handled
- ✅ How to debug and troubleshoot
- ✅ How to scale to production

**The localbackend is simple, reliable, and perfect for MVP development!**

For more details, see:
- [MVP_GUIDE.md](./MVP_GUIDE.md) - Complete app overview
- [START_HERE.md](./START_HERE.md) - Quick start
- [HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md) - User guide

**Happy developing! 🌿🚀**
