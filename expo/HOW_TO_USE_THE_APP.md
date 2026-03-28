# StonerStats App - Complete Setup Guide

## 🎯 Quick Start (3 Steps)

### 1. Start the Local Backend Server

```bash
cd localbackend
node index.js
```

You should see:
```
================================
🌿 StonerStats Backend Server
================================
Status: RUNNING
Port: 4000

Access URLs:
  Local:   http://localhost:4000
  Network: http://192.168.10.226:4000  ← YOUR IP HERE
================================
```

**Copy the Network IP** (e.g., `192.168.10.226`)

### 2. Update the App Configuration

Edit `constants/localBackendConfig.ts` and update line 12:

```typescript
{
  id: 'new-local',
  name: 'Local Server (New)',
  url: 'http://YOUR_IP_HERE:4000',  // ← Paste your IP here
  description: 'Latest server instance',
},
```

### 3. Run the App on Your Phone

⚠️ **IMPORTANT: You MUST use a real phone. Web preview will NOT work.**

```bash
bun expo start
```

Then:
1. Open **Expo Go** app on your phone
2. Scan the QR code
3. Wait for connection (you'll see a spinner)
4. Once connected, sign up!

---

## 📱 Using the App

### First Time Setup

1. **Connection Screen**: The app automatically tries to connect to your server
   - Shows spinner and attempt count
   - Displays current server being used
   - Click ⚙ to change servers

2. **Sign Up**:
   - Username: Any name you like
   - Email: Must be valid format (includes @)
   - Password: At least 6 characters
   
3. **You're In!** Welcome to StonerStats

### Main Features

#### 📰 Feed Tab
- See your recent sessions
- Browse strain library
- View community activity (when online)

#### 📚 Library Tab  
- Browse all cannabis strains
- Filter by type (Indica/Sativa/Hybrid)
- Unique generated icons for each strain
- Add strains to your collection

#### 📝 Log Tab
- Log new smoking sessions
- Select strain
- Rate your experience (1-5 stars)
- Add notes about effects

#### 📊 Stats Tab
- View your session history
- Track favorite strains
- See usage patterns
- Personal statistics

#### 👤 Profile Tab
- View/edit your profile
- App settings
- Logout

---

## 🔧 Troubleshooting

### "Connection timeout - server not responding"

**Cause**: App can't reach your local server

**Solutions**:
1. ✅ Is the server running? Check the terminal where you ran `node index.js`
2. ✅ Is your phone on the **same WiFi** as your computer?
3. ✅ Did you update the IP in `localBackendConfig.ts`?
4. ✅ Try pinging your server from phone browser: `http://YOUR_IP:4000/api/health`

### "Mixed content blocked" or "CORS error"

**Cause**: You're trying to use web preview

**Solution**: Use Expo Go on a real phone. Web preview is not supported for local backend.

### "Signup error" or "Login failed"

**Cause**: Backend not responding or wrong endpoint

**Solutions**:
1. Check server console - are you seeing the requests?
2. Restart the server
3. Clear app data (uninstall/reinstall Expo Go app)
4. Check that backend is NOT returning tRPC errors

### App won't load/white screen

**Solutions**:
1. Reload app (shake phone, press R)
2. Clear Metro bundler cache: `bun expo start --clear`
3. Check for JavaScript errors in terminal

### "Can't find module" errors

**Solution**: 
```bash
bun install
```

---

## 🏗 Architecture Overview

### Simple Flow

```
┌──────────────────┐
│   Your Phone     │
│   (Expo Go)      │
└────────┬─────────┘
         │
         │ WiFi (same network)
         │
┌────────▼─────────┐
│  Your Computer   │
│                  │
│  ┌────────────┐  │
│  │  Backend   │  │
│  │  (Node.js) │  │
│  │  Port 4000 │  │
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │   Metro    │  │
│  │  Bundler   │  │
│  │  Port 8081 │  │
│  └────────────┘  │
└──────────────────┘
```

### What Happens When You Sign Up

1. **User fills form** on phone
2. **App makes HTTP POST** to `http://YOUR_IP:4000/api/auth/signup`
3. **Backend receives request**, validates data
4. **Backend hashes password** using bcrypt
5. **Backend saves user** to `localbackend/data/users.json`
6. **Backend creates token** (base64 encoded)
7. **Backend sends response**: `{ user: {...}, token: "..." }`
8. **App receives response**, saves token to AsyncStorage
9. **App navigates** to Feed tab
10. **User is logged in!**

### Data Storage

All data is stored locally in JSON files:

```
localbackend/data/
├── users.json     ← User accounts
├── strains.json   ← Strain library
└── sessions.json  ← Smoking sessions
```

This means:
- ✅ Your data is on your computer
- ✅ Works offline (once set up)
- ✅ No cloud dependency
- ⚠️ Data lost if files deleted
- ⚠️ Not synced between devices

---

## 🎨 Unique Features

### Dynamic Strain Icons

Each strain gets a unique, deterministic leaf icon based on:
- Strain name (as seed)
- Type (Indica/Sativa/Hybrid)
- Random but consistent colors
- Glow effects and gradients

Same strain = same icon every time!

### Server Switching

Built-in UI to switch between:
- Your new local server
- Previous local server IP
- Rork hosted backend (if available)

No need to rebuild the app!

---

## 📝 Development Tips

### Testing Different Scenarios

**Test signup error handling:**
```bash
# Stop the server
# Try to sign up in app
# You should see connection error
```

**Test with multiple users:**
1. Sign up with user1@test.com
2. Log out
3. Sign up with user2@test.com
4. Check `localbackend/data/users.json` - both users there!

**Reset data:**
```bash
cd localbackend/data
rm users.json strains.json sessions.json
# Server will recreate empty files
```

### Checking Logs

**Server logs** (in terminal where you ran `node index.js`):
```
[2025-01-13T10:30:00.000Z] POST /api/auth/signup
New user signed up: user@test.com
```

**App logs** (in Expo terminal):
```
[LocalBackend] POST http://192.168.10.226:4000/api/auth/signup
Signup successful { user: {...}, token: "..." }
```

### Common Development Tasks

**Add new API endpoint:**
1. Add route in `localbackend/routes/` 
2. Add controller in `localbackend/controllers/`
3. Register route in `localbackend/index.js`
4. Add function in `utils/localBackendAPI.ts`
5. Use in your component

**Add new data model:**
1. Create JSON file in `localbackend/data/`
2. Add read/write functions in `localbackend/config/dataManager.js`
3. Create controller
4. Add API endpoints

---

## 🚀 Next Steps

Once comfortable with local backend:

1. **Add more features**: Friends, sharing, analytics
2. **Deploy to production**: Use Rork hosted backend or AWS/Vercel
3. **Add real database**: PostgreSQL, MongoDB, etc.
4. **Add image uploads**: Store strain photos
5. **Add push notifications**: Remind users to log sessions

---

## ⚠️ Important Notes

### This is a LOCAL DEVELOPMENT SETUP

- ✅ Perfect for: Development, testing, learning
- ✅ Great for: Local data, privacy, offline work
- ❌ NOT for: Production, sharing with others, app store

### Security Considerations

- Passwords ARE hashed with bcrypt ✅
- Tokens are base64 (not JWT) ⚠️
- No HTTPS (local only) ⚠️
- Tokens don't expire ⚠️
- No rate limiting ⚠️

**This is fine for local dev!** For production, use proper auth service.

---

## 📚 Related Documentation

- [SIMPLIFIED_BACKEND_GUIDE.md](./SIMPLIFIED_BACKEND_GUIDE.md) - Technical details
- [LOCALBACKEND_USAGE.md](./LOCALBACKEND_USAGE.md) - Backend API reference
- [STRAIN_SYSTEM.md](./STRAIN_SYSTEM.md) - How strain icons work

---

## 🆘 Still Having Issues?

If nothing works:

1. **Restart everything**:
   ```bash
   # Kill all processes (Ctrl+C multiple times)
   cd localbackend
   node index.js
   # In new terminal:
   bun expo start --clear
   ```

2. **Check basics**:
   - Server running? ✓
   - Phone on same WiFi? ✓
   - IP correct in config? ✓
   - Using real phone (not web)? ✓

3. **Nuclear option** (fresh start):
   ```bash
   # Clean everything
   rm -rf node_modules localbackend/data/*.json
   bun install
   cd localbackend && node index.js
   # Then start app on phone
   ```

---

**Happy logging! 🌿📊**
