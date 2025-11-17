# ✅ StonerStats MVP - Complete Setup Checklist

Use this checklist to get your MVP running from scratch.

---

## 📋 Pre-Requirements

### ✅ Software Installed
- [ ] **Node.js** (v18 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org
  
- [ ] **Bun** (for running Expo)
  - Check: `bun --version`
  - Install: `curl -fsSL https://bun.sh/install | bash`
  
- [ ] **Expo Go** app on phone
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

### ✅ Network Setup
- [ ] Computer and phone on **same WiFi network**
- [ ] Firewall allows port 4000 (backend)
- [ ] Firewall allows port 19000 (Expo)
- [ ] WiFi is not a public/guest network (must allow device-to-device)

---

## 🏗️ Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd localbackend
```
- [ ] Confirmed in `localbackend/` folder

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] No errors during install
- [ ] `node_modules/` folder created

### Step 3: Start the Server
```bash
node index.js
```

Expected output:
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

- [ ] Server starts without errors
- [ ] Shows `Status: RUNNING`
- [ ] Network URL is displayed
- [ ] **COPY THE NETWORK URL** (you'll need it!)

Example: `http://192.168.10.226:4000`

### Step 4: Test Server Connection
Open a **new terminal** (keep server running):

```bash
curl http://192.168.x.x:4000/api/health
```
(Replace with YOUR network URL)

Expected response:
```json
{
  "status": "ok",
  "service": "stonerstats-localbackend",
  "version": "1.0.0",
  "timestamp": "2025-01-17T10:30:00.000Z"
}
```

- [ ] Response received
- [ ] Status is "ok"
- [ ] No errors

---

## 📱 Frontend Setup

### Step 5: Open New Terminal
**Keep the backend server running in first terminal!**

### Step 6: Navigate to Project Root
```bash
cd /path/to/your/project
# Should see: app/, components/, localbackend/, etc.
```
- [ ] Confirmed in project root

### Step 7: Update Server Configuration

Open `constants/localBackendConfig.ts`

Find line ~12:
```typescript
url: 'http://192.168.10.226:4000',  // ← UPDATE THIS
```

**Replace with YOUR network URL from Step 3**

Example:
```typescript
url: 'http://192.168.1.100:4000',  // Your IP here
```

- [ ] File opened
- [ ] IP address updated
- [ ] Port is 4000
- [ ] File saved

### Step 8: Install App Dependencies (if needed)
```bash
bun install
```
- [ ] Dependencies installed
- [ ] No errors

### Step 9: Start Expo Development Server
```bash
bun expo start
```

Expected output:
```
› Metro waiting on exp://192.168.x.x:19000
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)
```

- [ ] Server starts successfully
- [ ] QR code appears
- [ ] No errors in terminal

---

## 📲 Mobile App Setup

### Step 10: Open Expo Go on Phone
- [ ] Expo Go app opened
- [ ] On same WiFi as computer

### Step 11: Scan QR Code
**iOS:** Use Camera app → point at QR → tap banner
**Android:** Open Expo Go → tap "Scan QR Code"

- [ ] QR code scanned
- [ ] App starts loading

### Step 12: Wait for Connection
You'll see: "Connecting to Server" screen

Expected behavior:
- Spinner animation
- Shows server URL
- "Attempt 1, 2, 3..."
- Eventually: ✅ Connected!

- [ ] Connection screen appears
- [ ] Eventually connects (may take 10-30 seconds)
- [ ] No "connection failed" errors

**If stuck, see Troubleshooting section below**

### Step 13: See Startup Animation
After connection:
- Flame animation plays
- "Let's burn 🔥" text appears
- Animation completes

- [ ] Animation plays smoothly
- [ ] Transitions to auth screen

---

## 🔐 Authentication Test

### Step 14: Sign Up Flow
On the signup screen:

1. Enter **Display Name**: "Test User"
2. Enter **Handle**: "testuser"
3. Enter **Password**: "test123"
4. Tap "Sign Up"

- [ ] All fields filled
- [ ] "Sign Up" button tapped
- [ ] Loading indicator appears
- [ ] Success! Navigates to Feed

**If error occurs, check backend terminal logs**

### Step 15: Verify You're Logged In
You should now see the **Feed** tab screen.

Navigation bar at bottom should show:
- Feed (active)
- Library
- Log
- Stats
- Profile

- [ ] Feed screen visible
- [ ] Bottom tabs visible
- [ ] Navigation works

---

## 🧪 Feature Testing

### Step 16: Test Library Tab
1. Tap **Library** tab
2. See three sub-tabs: My Strains, My Cards, Explore
3. Tap **Explore**
4. See pre-loaded strains (Blue Dream, OG Kush, etc.)

- [ ] Library tab opens
- [ ] Sub-tabs visible
- [ ] Explore shows strains
- [ ] Can scroll through list

### Step 17: Test Adding a Strain
1. Tap **My Strains** sub-tab
2. Tap floating **"+ Add"** button (bottom right)
3. Fill form:
   - Name: "Test Strain"
   - Type: Hybrid
   - Terpenes: Select 1-2
4. Tap "Add Strain"

- [ ] Add form opens
- [ ] All fields work
- [ ] Submit succeeds
- [ ] Strain appears in list
- [ ] Banner shows "Added Test Strain"

### Step 18: Test Card Generation
1. Stay on **Library** tab
2. Tap **My Cards** sub-tab
3. See cards auto-generated

Expected:
- Your "Test Strain" card appears
- Cards from Explore strains appear
- Shows "You own X cards"

- [ ] Cards visible
- [ ] At least 1 card present
- [ ] Grid/List toggle works

### Step 19: Test Card Details
1. Tap any card
2. Full card view opens
3. See card details (name, type, terpenes, rarity, etc.)

- [ ] Card detail modal opens
- [ ] All info displayed
- [ ] Can close modal

### Step 20: Test Session Logging
1. Tap **Log** tab
2. Fill session form:
   - Tap "Select Strain" → Choose any strain
   - Method: Joint
   - Amount: 0.5
   - Mood Before: 3
   - Mood After: 5
   - Effects: Select 2-3
   - Notes: "Test session"
3. Tap "Log Session"

- [ ] Strain selector works
- [ ] All fields work
- [ ] Submit succeeds
- [ ] Alert shows "Success"
- [ ] Form clears

### Step 21: Test Feed Display
1. Tap **Feed** tab
2. See your logged session
3. Shows:
   - Your display name
   - Strain icon and name
   - Method, amount, mood
   - Effects tags
   - Notes
   - Spark button (🔥)

- [ ] Feed shows session
- [ ] All details displayed correctly
- [ ] Layout looks good

### Step 22: Test Sparks (Likes)
1. On feed, tap the **🔥 Spark** button
2. Should fill in orange
3. Count shows "1 Sparks"
4. Tap again to unspark

- [ ] Spark button works
- [ ] Icon fills when sparked
- [ ] Count updates
- [ ] Unspark works

### Step 23: Test Stats Tab
1. Tap **Stats** tab
2. See statistics:
   - Total sessions: 1
   - Top strain
   - Top method

- [ ] Stats screen visible
- [ ] Shows correct data
- [ ] No errors

### Step 24: Test Profile Tab
1. Tap **Profile** tab
2. See your display name and handle
3. Settings visible

- [ ] Profile screen visible
- [ ] Info displayed correctly

---

## 🎯 Advanced Features Test

### Step 25: Test Strain Scanning (Optional)
**Only if you have a cannabis container with label**

1. Go to Library → My Strains
2. Tap **Scan** button
3. Choose "Upload Photo"
4. Grant photo permission
5. Select photo of container label
6. Wait for AI analysis (10-30 seconds)

Expected:
- Shows "Processing..." indicator
- Extracts strain info
- Adds strain to library
- Shows success alert

- [ ] Upload works
- [ ] AI processes image
- [ ] Strain extracted correctly
- [ ] Added to library

### Step 26: Test Search & Filters
1. Library → Explore
2. Tap search bar
3. Type "blue"
4. See filtered results

- [ ] Search works
- [ ] Results filter correctly

5. Tap filter chips (Indica/Sativa/Hybrid)
6. See filtered results

- [ ] Filters work
- [ ] Can combine filters
- [ ] Clear filters works

### Step 27: Test Logout
1. Profile tab
2. Tap "Logout"
3. Returns to login screen

- [ ] Logout button works
- [ ] Navigates to auth screen

### Step 28: Test Login
1. On login screen
2. Enter handle: "testuser"
3. Enter password: "test123"
4. Tap "Login"

- [ ] Login succeeds
- [ ] Returns to Feed
- [ ] Data persisted

---

## ✅ Success Criteria

### Backend Health
- [x] Server running without crashes
- [x] Health endpoint responding
- [x] API endpoints working
- [x] JSON files being created/updated
- [x] Logs showing requests

### Frontend Health
- [x] App loads on phone
- [x] Connects to backend
- [x] Authentication works
- [x] Navigation works
- [x] No crash errors

### Core Features Working
- [x] Signup/Login flow
- [x] Add strains manually
- [x] Log sessions
- [x] View feed
- [x] Spark posts
- [x] View stats
- [x] Card collection works

### Advanced Features Working
- [x] Strain scanning (if tested)
- [x] Search/filters
- [x] Logout/login persistence

---

## 🐛 Troubleshooting

### ❌ Problem: Backend Won't Start

**Error:** "Port 4000 already in use"

**Solution:**
```bash
# Find process using port
lsof -i :4000
# Kill it
kill -9 <PID>
# Or change port in index.js
```

---

### ❌ Problem: App Stuck on "Connecting to Server"

**Possible causes:**
1. Backend not running
2. Wrong IP in config
3. Phone on different WiFi
4. Firewall blocking

**Solutions:**
1. Check backend terminal - is it running?
2. Verify IP in `localBackendConfig.ts` matches backend output
3. Confirm phone WiFi settings
4. Test with curl: `curl http://YOUR_IP:4000/api/health`
5. Try different server from dropdown in connection screen

---

### ❌ Problem: "Mixed Content Blocked" Error

**Solution:** 
You're using web preview. **Must use Expo Go app on phone.**
Web browsers block HTTP requests from HTTPS pages.

---

### ❌ Problem: "User already exists"

**Solution:**
Handle is taken. Try different handle or reset database:
```bash
cd localbackend/data
rm users.json
# Restart backend
```

---

### ❌ Problem: Cards Not Generating

**Solution:**
1. Add at least one strain first
2. Switch to "My Cards" tab
3. Check console logs for errors
4. Cards generate automatically when strains exist

---

### ❌ Problem: AI Scan Not Working

**Possible causes:**
1. No photo permissions
2. Poor image quality
3. AI service timeout

**Solutions:**
1. Grant camera/photo permissions in phone settings
2. Use clear, well-lit photos
3. Try 2-photo mode for better results
4. Check backend logs for AI errors

---

### ❌ Problem: Feed Not Updating After Logging Session

**Solution:**
1. Pull to refresh on feed
2. Switch tabs and back
3. Check backend terminal - did POST succeed?
4. Check network logs in Expo terminal

---

### ❌ Problem: App Crashes on Startup

**Solutions:**
1. Clear app data (reinstall Expo Go or clear cache)
2. Check terminal for error logs
3. Verify all dependencies installed: `bun install`
4. Try clearing Metro bundler cache: `bun expo start -c`

---

## 📊 Data Verification

### Backend Data Files
Check these files were created:

```bash
cd localbackend/data
ls -la
```

Should see:
- `users.json` - Your user account
- `strains.json` - Your strains
- `sessions.json` - Your logged sessions

- [ ] All files exist
- [ ] Files contain valid JSON
- [ ] Data matches what you entered

View contents:
```bash
cat users.json | jq .
cat strains.json | jq .
cat sessions.json | jq .
```

### App Storage
Data also stored locally on phone:
- AsyncStorage (React Native)
- Keys: `stonerstats_auth_token`, `stonerstats_user`, etc.

To reset:
- iOS: Delete and reinstall Expo Go
- Android: Settings → Apps → Expo Go → Clear data

---

## 🎉 Final Verification

### All Systems Go
- [x] Backend running: `http://YOUR_IP:4000`
- [x] Frontend running: Expo dev server
- [x] App running on phone: Expo Go
- [x] Authentication working: Logged in
- [x] Core features working: Strains, sessions, feed, cards
- [x] Data persisting: Survives app restart
- [x] No critical errors: Smooth operation

### Test Coverage
| Feature | Status | Notes |
|---------|--------|-------|
| Signup | ✅ | |
| Login | ✅ | |
| Add Strain | ✅ | |
| Log Session | ✅ | |
| View Feed | ✅ | |
| Spark Post | ✅ | |
| Card Collection | ✅ | |
| Search/Filter | ✅ | |
| Stats | ✅ | |
| Profile | ✅ | |
| AI Scan | ⏸️ | Optional |
| Logout | ✅ | |

---

## 🚀 Next Steps After Setup

### Immediate (Today)
1. [ ] Explore all features thoroughly
2. [ ] Add real strains you use
3. [ ] Log some real sessions
4. [ ] Collect cards and explore rarities
5. [ ] Test on different phone if available

### Short Term (This Week)
1. [ ] Customize strain icons
2. [ ] Experiment with card shaders
3. [ ] Try AI scanning if you have containers
4. [ ] Share feedback/bugs you find
5. [ ] Think about features you want

### Medium Term (Next 2 Weeks)
1. [ ] Add friends to test social features
2. [ ] Build up session history
3. [ ] Analyze your usage patterns in Stats
4. [ ] Test edge cases and boundary conditions
5. [ ] Document any issues you encounter

### Long Term (Next Month)
1. [ ] Decide on production backend platform
2. [ ] Plan deployment strategy
3. [ ] Consider additional features:
   - Booster packs for cards
   - Card trading
   - Comments on posts
   - User profiles
   - Following/followers
   - Achievements
4. [ ] Start migration to production database

---

## 📝 Setup Log Template

Use this to track your setup:

```
StonerStats MVP Setup - [Your Name] - [Date]

Backend Setup:
- Node.js version: _______
- Server started at: _______
- Network IP: _______
- Health check passed: ☐

Frontend Setup:
- Bun version: _______
- Config updated: ☐
- Expo started: ☐
- QR scanned: ☐

Connection:
- First attempt time: _______
- Connected successfully: ☐
- Connection time: _______ seconds

Authentication:
- Signup tested: ☐
- Handle used: _______
- Login tested: ☐

Feature Testing:
- Strains: ☐ (Added __ strains)
- Sessions: ☐ (Logged __ sessions)
- Cards: ☐ (Collected __ cards)
- Feed: ☐ (Sparks working)
- Stats: ☐ (Data showing)

Issues Encountered:
1. _______
2. _______

Notes:
_______
_______
```

---

## 🎓 You Did It!

**Congratulations!** 🎉

You've successfully set up and tested the StonerStats MVP!

You now have:
- ✅ Working local backend server
- ✅ Mobile app running on your phone
- ✅ Authentication system
- ✅ Strain library with custom icons
- ✅ Session logging
- ✅ Social feed with sparks
- ✅ Card collection system
- ✅ AI-powered scanning
- ✅ Stats and analytics

### Resources
- [MVP_GUIDE.md](./MVP_GUIDE.md) - Complete app documentation
- [LOCALBACKEND_ARCHITECTURE.md](./LOCALBACKEND_ARCHITECTURE.md) - Backend deep dive
- [START_HERE.md](./START_HERE.md) - Quick start guide
- [HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md) - User manual

### Support
If you encounter issues:
1. Check troubleshooting section above
2. Review backend logs
3. Check Expo terminal logs
4. Test with curl commands
5. Review documentation files

### Share Your Feedback
- What features do you love?
- What needs improvement?
- What features are missing?
- Any bugs or issues?

**Happy building! 🌿📊🚀**
