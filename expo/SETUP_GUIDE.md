# 📱 TokeTracker - Setup Guide

TokeTracker is a mobile-first cannabis tracking app that connects to a local backend server.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
# or
bun install
```

### Step 2: Start the Local Backend
Navigate to the `localbackend` folder and run:
```bash
cd localbackend
start_server.bat
```

The server will:
- ✅ Auto-install dependencies
- ✅ Detect your computer's IP address
- ✅ Update app configuration automatically
- ✅ Start on port 4000

### Step 3: Run the App on Your Phone
```bash
npx expo start
```

Then:
1. Open **Expo Go** app on your phone
2. Scan the QR code
3. App connects automatically!

---

## ⚠️ Important Requirements

### Must Have:
- ✅ **Physical mobile device** (iOS or Android)
- ✅ **Expo Go app** installed ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- ✅ **Same WiFi network** for computer and phone
- ✅ **Node.js** installed on your computer

### Won't Work:
- ❌ Web browser preview (blocked by browser security)
- ❌ Different WiFi networks
- ❌ Mobile data on phone

---

## 🔧 Troubleshooting

### Connection Failed?

**1. Check Server Console**
Look for this output:
```
================================
🌿 StonerStats Backend Server
================================
Network: http://192.168.x.x:4000
```

**2. Verify IP Address**
The IP shown above should match your network. If not:

```bash
# From project root
node update-server-ip.js
```

Then restart the server.

**3. Check Same WiFi**
- Computer and phone must be on the **exact same WiFi network**
- Not 5GHz vs 2.4GHz
- Not guest network vs main network

**4. Try Manual Server Selection**
In the connection screen:
1. Tap the gear icon (⚙)
2. Select different server option
3. Or try "Localhost" option if using simulator

**5. Firewall Issues**
Allow Node.js through Windows Firewall when prompted

### Still Not Working?

**Check these:**
- ✅ Server is running (console window open)
- ✅ Phone has Expo Go installed
- ✅ Both on same WiFi
- ✅ Firewall allows connections
- ✅ Antivirus isn't blocking
- ✅ Port 4000 isn't used by another app

---

## 📂 Project Structure

```
TokeTracker/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Main tab navigation
│   ├── auth/              # Login/signup screens
│   └── _layout.tsx        # Root layout
├── components/            # React components
├── localbackend/          # Local server (Node.js)
│   ├── start_server.bat   # ⭐ Start server here
│   ├── index.js           # Express server
│   └── data/              # JSON data storage
├── constants/             # Config and constants
│   └── localBackendConfig.ts  # Server IP config
└── lib/                   # Utilities and tRPC
```

---

## 🎯 What This App Does

**TokeTracker** helps you:
- 📊 Log and track cannabis sessions
- 📚 Browse strain library
- 📈 View usage statistics
- 📱 Share on social feed
- 👤 Manage your profile

All data is stored **locally on your computer** - no cloud required!

---

## 🛠️ Development Commands

```bash
# Start Expo dev server
npx expo start

# Start local backend
cd localbackend
start_server.bat

# Update server IP
node update-server-ip.js

# Type check
npm run check-types

# Clear cache
npx expo start --clear
```

---

## 📱 Testing on Device

### iOS (Expo Go)
1. Install Expo Go from App Store
2. Scan QR code with Camera app
3. Opens in Expo Go automatically

### Android (Expo Go)
1. Install Expo Go from Play Store
2. Scan QR code from within Expo Go app
3. App loads automatically

---

## 🐛 Common Errors

### "Connection timeout"
→ Server not running or wrong IP address

### "XHR aborted"
→ Network issue or firewall blocking

### "Mixed content blocked"
→ Don't use web preview, use mobile device

### "Request failed"
→ Check server console for errors

---

## 💡 Pro Tips

1. **Keep server console visible** - shows all requests and errors
2. **Use "Retry Now" button** - faster than waiting for auto-retry
3. **Check server IP in console** - confirm it matches your network
4. **Restart server after IP change** - updates configuration
5. **Use localhost option** - for iOS Simulator or Android Emulator

---

## 🔐 Security Note

This is a **local development setup** - the server runs on your computer and is only accessible on your local network. Perfect for personal use and testing!

---

## 📚 More Help

- **Quick Start Guide**: `localbackend/QUICK_START.md`
- **Server Details**: `localbackend/SERVER_README.txt`
- **Architecture**: `LOCALBACKEND_ARCHITECTURE.md`

---

## ✨ Features

- 🔥 Real-time session tracking
- 📊 Detailed statistics and insights
- 🌿 Comprehensive strain library
- 📱 Social feed for sharing
- 🔒 All data stored locally
- 🎨 Beautiful mobile-first design

---

Need help? Check the console logs - they're very detailed! 🕵️
