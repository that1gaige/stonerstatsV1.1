# ✅ Testing Checklist - New Simplified Backend

## Pre-Flight Check

Before testing the app, verify these:

### 1. Server is Running
```bash
cd localbackend
node index.js
```

**Expected output:**
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

✅ Server shows "RUNNING"
✅ You see a Network IP address
✅ Port is 4000

### 2. Server Responds to Health Check

**On your computer:**
```bash
curl http://localhost:4000/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "service": "stonerstats-localbackend",
  "version": "1.0.0",
  "timestamp": "2025-01-13T..."
}
```

✅ Returns JSON
✅ Status is "ok"

### 3. IP is Updated in App

**File:** `constants/localBackendConfig.ts`

**Line 12 should match your Network IP:**
```typescript
url: 'http://YOUR_NETWORK_IP:4000',  // ← This should match
```

✅ IP matches what server shows
✅ Port is 4000
✅ File is saved

---

## Testing on Phone

### 4. Start Expo and Connect Phone

```bash
bun expo start
```

Then:
1. Open Expo Go on your phone
2. Scan QR code
3. Wait for app to load

✅ App loads on phone
✅ You see ConnectionLoader screen

### 5. Connection Test

**What you should see:**
- Spinner animation
- "Connecting to Server"
- "Attempt 1"
- Server info showing your IP

**After 1-5 seconds:**
- ✅ Connection successful
- ✅ Navigate to Login/Signup screen

**If it fails:**
- Check server is still running (check terminal)
- Check phone is on same WiFi as computer
- Check IP is correct in config
- See troubleshooting in HOW_TO_USE_THE_APP.md

### 6. Signup Test

Fill in the form:
- Username: `testuser`
- Email: `test@example.com`
- Password: `test123`

Click "Sign Up"

**Expected in app:**
- ✅ Loading spinner appears
- ✅ After 1-2 seconds: Navigate to Feed tab
- ✅ You're logged in!

**Expected in server terminal:**
```
[2025-01-13T...] POST /api/auth/signup
New user signed up: test@example.com
```

✅ Server logged the signup
✅ User created in `localbackend/data/users.json`

**Expected in Expo terminal:**
```
[LocalBackend] POST http://YOUR_IP:4000/api/auth/signup
[LocalBackend] Headers: {...}
[LocalBackend] Body: {"email":"test@example.com",...}
[LocalBackend] Response status: 201 Created
[LocalBackend] Response data: {"user":{...},"token":"..."}
[LocalBackend] Token saved to AsyncStorage
[LocalBackend] Signup successful: test@example.com
Signup successful {...}
```

✅ Detailed logs show the flow
✅ No errors
✅ Token saved

### 7. Verify User Data

**Check file:** `localbackend/data/users.json`

Should contain:
```json
[
  {
    "id": "uuid-here",
    "email": "test@example.com",
    "username": "testuser",
    "password": "hashed-password-here",
    "createdAt": "2025-01-13T..."
  }
]
```

✅ User exists in file
✅ Password is hashed (long random string)
✅ Email and username match

### 8. Logout and Login Test

In app:
1. Go to Profile tab
2. Click "Logout"
3. ✅ Navigate back to Login screen

Fill in login form:
- Email: `test@example.com`
- Password: `test123`

Click "Log In"

**Expected:**
- ✅ Loading spinner
- ✅ Navigate to Feed tab
- ✅ You're logged in again!

**Expected in server terminal:**
```
[2025-01-13T...] POST /api/auth/login
User logged in: test@example.com
```

✅ Login successful
✅ Same user, new token

### 9. Multiple User Test

Create second user:
1. Logout
2. Signup with:
   - Username: `testuser2`
   - Email: `test2@example.com`
   - Password: `test456`

**Expected in `users.json`:**
```json
[
  { "email": "test@example.com", ... },
  { "email": "test2@example.com", ... }
]
```

✅ Two users in file
✅ Both can login independently

### 10. Error Handling Test

**Test: Duplicate email**
1. Logout
2. Try to signup with `test@example.com` again

**Expected:**
- ❌ Error alert: "Email already exists"
- ✅ Stay on signup screen

**Test: Short password**
1. Try password "123" (less than 6 chars)

**Expected:**
- ❌ Error alert: "Password must be at least 6 characters"
- ✅ Stay on signup screen

**Test: Server offline**
1. Stop the server (Ctrl+C in server terminal)
2. Try to signup

**Expected:**
- ❌ ConnectionLoader shows "Connection Failed"
- ❌ Error: "Connection timeout"
- ✅ Retry countdown starts
- ✅ App keeps trying

✅ All errors handled gracefully

---

## Success Criteria

All these should be ✅:

**Backend:**
- [✅] Server starts without errors
- [✅] Health check returns 200 OK
- [✅] Logs show requests
- [✅] Data files are created

**Connection:**
- [✅] App connects to server
- [✅] ConnectionLoader works
- [✅] Can switch servers in UI

**Auth:**
- [✅] Signup creates user
- [✅] Login works with correct credentials
- [✅] Token is saved
- [✅] Logout clears session

**Error Handling:**
- [✅] Duplicate email rejected
- [✅] Short password rejected  
- [✅] Network errors show message
- [✅] No crashes

**Data:**
- [✅] Users saved to JSON file
- [✅] Passwords are hashed
- [✅] Tokens are generated

---

## What If Something Fails?

### Signup Error: "Cannot reach server"

**Debug steps:**
1. Check server terminal - is it running?
2. Try health check: `curl http://YOUR_IP:4000/api/health`
3. Check phone WiFi - same network?
4. Restart server
5. Restart app (shake phone, press R)

### Signup Error: Different message

**Debug steps:**
1. Read the error message carefully
2. Check Expo terminal for detailed logs
3. Check server terminal for error logs
4. Look for `[LocalBackend]` logs showing the request/response
5. See PROBLEM_SOLVED.md for common issues

### No logs appearing

**Debug steps:**
1. Enable Remote JS Debugging (shake phone, select option)
2. Check console in browser dev tools
3. Ensure `console.log` statements are present in code

### App crashes

**Debug steps:**
1. Check for red error screen
2. Read error message and stack trace
3. Common cause: Type mismatch in userData
4. Check that response matches expected format

---

## Next Steps After All Tests Pass

1. 🎉 **Celebrate!** It works!
2. 📚 Read HOW_TO_USE_THE_APP.md for full usage guide
3. 🚀 Start building your app features
4. 💾 Consider adding database for production
5. 🔐 Add proper JWT auth for production
6. 📱 Test on different devices/networks

---

## Quick Reference

**Start server:**
```bash
cd localbackend && node index.js
```

**Start app:**
```bash
bun expo start
```

**Health check:**
```bash
curl http://YOUR_IP:4000/api/health
```

**Reset data:**
```bash
rm localbackend/data/*.json
```

**View logs:**
- Server: Terminal where `node index.js` is running
- App: Terminal where `bun expo start` is running
- Phone: Shake device → "Show Dev Menu" → "Debug Remote JS"

---

**Everything working? You're ready to build! 🚀**
