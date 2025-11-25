# 🚀 TokeTracker Local Backend - Quick Start Guide

## Step 1: Start the Server

1. Navigate to the `localbackend` folder
2. Double-click `start_server.bat`
3. The server will:
   - Install dependencies (first time only)
   - Auto-detect your computer's IP address
   - Update the app configuration automatically
   - Start the server on port 4000

## Step 2: Test on Your Phone

1. Make sure your phone is on the **SAME WiFi network** as your computer
2. Open the **Expo Go** app on your phone
3. Scan the QR code from your Expo terminal
4. The app will connect to your local backend automatically

## ⚠️ Important Notes

- **Web preview WILL NOT WORK** - the browser blocks HTTP connections
- **Must use Expo Go app** on a physical device
- **Same WiFi network** is required for phone and computer
- Server console will show your network IP address

## 🔧 Troubleshooting

### Can't Connect?

**Check the server console for your IP address:**
```
Network: http://192.168.x.x:4000
```

**If the IP doesn't match your network:**

1. Close the server (Ctrl+C or close window)
2. From the project root, run:
   ```bash
   node update-server-ip.js
   ```
3. Restart the server with `start_server.bat`

### Still having issues?

1. **Firewall blocking?** - Allow Node.js through Windows Firewall
2. **Wrong network?** - Make sure computer and phone are on the same WiFi
3. **Port in use?** - Close other apps using port 4000
4. **Antivirus?** - Temporarily disable to test

## 📱 Connection Tester

The app has a built-in connection loader that will:
- Try to connect every 10 seconds
- Show detailed error messages
- Let you switch between server options
- Display your current server URL

**Use the gear icon (⚙)** to manually select different server options if auto-detection fails.

## 🎯 Server Status

When running correctly, you'll see:
```
================================
🌿 StonerStats Backend Server
================================
Status: RUNNING
Port: 4000

Access URLs:
  Local:   http://localhost:4000
  Network: http://192.168.x.x:4000

Health Check:
  http://localhost:4000/api/health
================================
```

Copy the **Network URL** and use the app's server switcher if needed.
