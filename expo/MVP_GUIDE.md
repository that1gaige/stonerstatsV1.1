# 🌿 StonerStats MVP Guide

## What Is This App?

**StonerStats** is a cannabis tracking and social app that lets you:
- 📱 **Log your sessions** - Track strains, methods, amounts, effects
- 📚 **Build your library** - Collect strains and digital trading cards
- 🎴 **Collect cards** - Unique cards with rarities (Common to Mythic)
- 📊 **View stats** - Analyze your usage patterns
- 🔥 **Share socially** - Post sessions, give Sparks (likes), interact with others
- 📸 **Scan containers** - AI-powered strain identification from photos

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the Local Backend Server

```bash
cd localbackend
npm install
node index.js
```

You'll see:
```
🌿 StonerStats Backend Server
Status: RUNNING
Port: 4000
Network: http://192.168.x.x:4000
```

**Copy that IP address!** (e.g., `http://192.168.10.226:4000`)

### Step 2: Update the Server URL

Edit `constants/localBackendConfig.ts`:

```typescript
export const SERVER_OPTIONS: ServerOption[] = [
  {
    id: 'new-local',
    name: 'Local Server (New)',
    url: 'http://YOUR_IP_HERE:4000',  // ← Paste your IP here
    description: 'Latest server instance',
  },
  // ...
];
```

### Step 3: Run the App on Your Phone

```bash
bun expo start
```

**IMPORTANT:** 
- ⚠️ Use **Expo Go app on your phone** (scan QR code)
- ⚠️ **Web preview WILL NOT WORK** due to security restrictions
- ⚠️ Phone and computer **must be on same WiFi**

### Step 4: Sign Up & Start Using

1. App connects to server automatically
2. Create your account (display name, handle, password)
3. ✅ You're in! Start exploring

---

## 📱 App Features

### 🏠 Feed Tab
- View all recent sessions from yourself and others
- **Spark** posts (like them) - 🔥 for normal, 💥 for hype posts (10+ sparks)
- See strain details, methods, effects, moods
- Real-time updates

### 📚 Library Tab
Three sub-tabs:
1. **My Strains** - Your personally added strains
2. **My Cards** - Digital trading card collection
3. **Explore** - Pre-loaded strain database

**Features:**
- Search and filter strains
- Add custom strains manually
- **Scan strain containers** with AI (camera or upload photos)
- View cards in **List** or **Grid** mode
- Cards have rarities: Common, Uncommon, Rare, Epic, Legendary, Mythic

### ➕ Log Tab
Log your smoking sessions:
- Select strain (yours or from explore)
- Choose method (joint, bong, pipe, vape, edible, dab)
- Enter amount and unit
- Rate mood before/after (1-5)
- Tag effects (up to 5)
- Add notes

### 📊 Stats Tab
View your usage analytics:
- Total sessions
- Favorite strains
- Most used methods
- Effects breakdown
- Time patterns

### 👤 Profile Tab
Your personal profile:
- Display name and handle
- Settings and preferences
- Account management

---

## 🎴 Card Collection System

### How It Works
- Cards are **auto-generated** from strains in your library
- Each strain can have **multiple card variants**
- Cards are organized in **Sets** (currently Set A1 - First Print)

### Card Attributes
- **Card Name** - Strain name + variant
- **Strain Type** - Indica/Sativa/Hybrid
- **Terpenes** - Top terpene profile
- **Card ID** - Format: A1-001, A1-002, etc.
- **Rarity** - Common → Mythic (6 levels)
- **Shader** - Visual effect style
- **Art Variant** - Base, Foil, Terp, Heritage, Cosmic, etc.

### Rarity System
| Rarity | Color | Visual Style |
|--------|-------|--------------|
| Common | Gray | Simple, flat |
| Uncommon | Green | Soft glow |
| Rare | Purple | Textured border |
| Epic | Blue | Holographic |
| Legendary | Gold | Gold foil |
| Mythic | Cosmic | Animated shimmer |

### View Modes
- **List View** - Compact rows with icons
- **Grid View** - Pokémon card binder style (2 columns)

### Card Details
Tap any card to see:
- Full card front artwork
- Flip to see back (stats, flavor text)
- Spark count
- "Share to Feed" button (coming soon)

---

## 🔍 AI Scan Feature

### How to Use
1. Go to **Library** → **My Strains**
2. Tap the **Scan** button
3. Choose:
   - **Take Photo** - Use camera to snap container
   - **Upload Photo** - Select 1-2 photos from gallery

### What It Extracts
- ✅ Strain name
- ✅ Type (Indica/Sativa/Hybrid)
- ✅ THC/CBD percentages
- ✅ Terpenes
- ✅ Breeder/Brand
- ✅ Batch, harvest, package dates
- ✅ Lab info

### Tips for Best Results
- Good lighting
- Clear view of label text
- Multiple angles (use 2-photo option)
- Avoid glare/blur

---

## 🏗️ Architecture

### Tech Stack
```
Frontend: React Native + Expo + TypeScript
Router: Expo Router (file-based)
State: React Query + Context
Styling: StyleSheet
Icons: Lucide React Native
Backend: Node.js + Express (local)
Data: JSON files (local dev)
AI: Rork AI Toolkit (image analysis)
```

### Data Flow
```
App → REST API → Local Server → JSON Files
     ← JSON Response ← JSON Files
```

### File Structure
```
app/
  (tabs)/          # Main tab screens
    feed.tsx       # Social feed
    library.tsx    # Strains & cards
    log.tsx        # Log sessions
    stats.tsx      # Analytics
    profile.tsx    # User profile
  auth/            # Auth screens
    login.tsx
    signup.tsx
  scan.tsx         # Camera scan
  
components/        # Reusable components
  StrainIcon.tsx   # Custom strain icons
  StrainCard.tsx   # Card UI
  FullCardView.tsx # Card detail modal
  
constants/
  exploreStrains.ts      # Pre-loaded strains
  strainDescriptors.ts   # Terpene data
  cardShaders.ts         # Visual effects
  localBackendConfig.ts  # Server config
  
contexts/
  AppContext.tsx   # Global state
  
localbackend/      # Local server
  index.js         # Express server
  routes/          # API endpoints
  data/            # JSON storage
  controllers/     # Business logic
```

---

## 🔐 Authentication

### How It Works
1. User signs up with display name, handle, password
2. Server creates account, generates JWT token
3. Token stored in AsyncStorage
4. All API requests include token in Authorization header
5. Server validates token on protected routes

### Local Dev Security
- Simple bcrypt password hashing
- JWT tokens (expiration not enforced in dev)
- Data stored in JSON files

### Production Considerations
⚠️ **This local backend is for development ONLY**

For production:
- Use real database (PostgreSQL, MongoDB)
- Add token expiration and refresh
- Use HTTPS
- Add rate limiting
- Deploy to Railway, Render, or Fly.io
- Or use Firebase/Supabase

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth/signup   - Create account
POST /api/auth/login    - Login
GET  /api/auth/me       - Get current user (protected)
```

### Strains
```
GET    /api/strains           - Get all strains (protected)
POST   /api/strains           - Create strain (protected)
GET    /api/strains/:id       - Get strain by ID (protected)
DELETE /api/strains/:id       - Delete strain (protected)
```

### Sessions
```
GET    /api/sessions          - Get all sessions (protected)
POST   /api/sessions          - Create session (protected)
GET    /api/sessions/feed     - Get feed (protected)
POST   /api/sessions/:id/like - Like session (protected)
DELETE /api/sessions/:id/like - Unlike session (protected)
```

### Health Check
```
GET /api/health - Server status (public)
```

---

## 🎨 Design System

### Colors
```
Background: #0a0a0a (deep black)
Surface: #1a1a1a (card background)
Border: #333 (subtle borders)
Primary: #4ade80 (green - CTA)
Text: #fff (primary text)
Text Secondary: #888, #666, #444 (hierarchy)
Error: #ff4444
```

### Typography
- **Bold (700-800)** - Headings, CTAs, emphasis
- **SemiBold (600)** - Subheadings, labels
- **Regular (400)** - Body text

### Components
- **Cards** - Rounded (16px), dark surface
- **Buttons** - Bold, high contrast
- **Chips** - Rounded pills for tags/filters
- **Icons** - Lucide icons, 20-24px

### Strain Types
- **Indica** - Purple (#6b46c1)
- **Sativa** - Orange/Amber (#f59e0b)
- **Hybrid** - Green (#10b981)

---

## 🧪 Testing Your MVP

### Connection Test
```bash
# Test server is running
curl http://YOUR_IP:4000/api/health

# Should return:
# {"status":"ok","service":"stonerstats-localbackend","version":"1.0.0"}
```

### Functional Tests

#### 1. Authentication Flow
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Token persists after app restart
- [ ] Logout works

#### 2. Library Features
- [ ] View My Strains (empty initially)
- [ ] View Explore strains (should have ~10 strains)
- [ ] Add custom strain manually
- [ ] Scan strain container (if you have one)
- [ ] Search/filter strains
- [ ] Switch between tabs (My Strains, My Cards, Explore)

#### 3. Card Collection
- [ ] Cards auto-generate after adding strains
- [ ] View cards in List mode
- [ ] View cards in Grid mode
- [ ] Filter cards by rarity
- [ ] Tap card to view details
- [ ] Flip card to see back

#### 4. Session Logging
- [ ] Select a strain
- [ ] Choose method
- [ ] Enter amount
- [ ] Rate mood before/after
- [ ] Tag effects
- [ ] Add notes
- [ ] Submit successfully
- [ ] Session appears in feed

#### 5. Feed Interaction
- [ ] View your logged session
- [ ] Spark (like) a session
- [ ] Unspark (unlike) a session
- [ ] See spark count update
- [ ] Hype threshold (10+ sparks shows 💥)

#### 6. Stats
- [ ] View total sessions
- [ ] See strain breakdown
- [ ] Check method usage
- [ ] Effects summary

---

## 🐛 Troubleshooting

### Connection Issues

**Problem:** App stuck on "Connecting to Server"

**Solutions:**
1. Check server is running: `node localbackend/index.js`
2. Verify IP address matches in `localBackendConfig.ts`
3. Ensure phone and computer on same WiFi
4. Test with curl: `curl http://YOUR_IP:4000/api/health`
5. Check firewall isn't blocking port 4000

**Problem:** "Mixed Content Blocked"

**Solution:** This is web browser security. **Must use Expo Go app on phone**.

### Backend Issues

**Problem:** Server crashes on startup

**Solutions:**
1. Run `npm install` in `localbackend/` folder
2. Check port 4000 isn't already in use
3. Check JSON files in `localbackend/data/` are valid

**Problem:** "User already exists" error

**Solution:** 
- User handles must be unique
- Try different handle
- Or delete `localbackend/data/users.json` to reset

### App Issues

**Problem:** Cards not generating

**Solution:**
- Add at least one strain first
- Cards generate automatically
- Check console logs for errors

**Problem:** AI scan not working

**Solutions:**
1. Grant camera/photo permissions
2. Ensure good lighting
3. Use clear, focused photos
4. Try 2-photo mode for better accuracy

---

## 📦 Dependencies

### Core
- `expo` - React Native framework
- `expo-router` - File-based routing
- `react-native` - Mobile framework
- `typescript` - Type safety

### UI & Icons
- `lucide-react-native` - Icons
- `expo-linear-gradient` - Gradients
- `expo-blur` - Blur effects
- `react-native-svg` - SVG support

### State Management
- `@tanstack/react-query` - Server state
- `@nkzw/create-context-hook` - Context wrapper
- `@react-native-async-storage/async-storage` - Persistence

### Backend
- `express` - Web server
- `cors` - Cross-origin requests
- `bcryptjs` - Password hashing
- `uuid` - Unique IDs

### AI Features
- `@rork-ai/toolkit-sdk` - Image analysis (pre-installed)
- `expo-image-picker` - Photo selection
- `expo-camera` - Camera access

---

## 🚀 Next Steps

### Immediate Improvements
1. Add actual stats calculations
2. Implement "Share to Feed" for cards
3. Add user profile editing
4. Enable following/unfollowing users
5. Add comments on sessions
6. Implement search in feed

### Medium-Term Features
1. **Booster Packs** - Open packs to get random cards
2. **Card Trading** - Trade cards with other users
3. **Achievements** - Unlock badges/rewards
4. **Streaks** - Daily usage tracking
5. **Social Discovery** - Find users, explore profiles
6. **Advanced Analytics** - Charts, trends, insights

### Long-Term Vision
1. **Public Launch** - Deploy production backend
2. **Push Notifications** - Session reminders, social updates
3. **Locations** - Track where you smoke
4. **Bluetooth Devices** - Integrate with smart vapes
5. **Marketplace** - Buy/sell strains (info only)
6. **AR Features** - View 3D strain models
7. **Voice Logging** - Log sessions via voice

---

## 🎯 MVP Success Criteria

Your MVP is successful if:
- ✅ Users can sign up and login
- ✅ Users can add and browse strains
- ✅ Users can log smoking sessions
- ✅ Users can collect and view cards
- ✅ Users can interact with feed (sparks)
- ✅ Users can scan strain containers
- ✅ App works reliably on mobile
- ✅ No crashes or major bugs

---

## 🔥 Key Features Explained

### Custom Strain Icons
Each strain gets a **unique procedurally generated icon**:
- Based on strain type (color palette)
- Unique seed from strain ID
- Customizable parameters (leaf count, spread, etc.)
- SVG-based for crisp rendering

### Dynamic Shaders
Cards use **shader effects** for visual appeal:
- Standard Leaf Tint
- Holo Sparkle
- Gold Foil
- Cosmic Holo
- And more...

Shader selection based on card rarity and variant.

### Sparks System
Replaced "likes" with **Sparks** (🔥):
- Normal posts show fire icon
- **Hype posts** (10+ sparks) show explosion icon (💥)
- Visual feedback on interaction
- Real-time count updates

---

## 💡 Pro Tips

### For Users
1. **Scan multiple angles** - Use 2-photo mode for best AI accuracy
2. **Tag effects honestly** - Helps with future recommendations
3. **Build your library first** - More strains = more cards
4. **Explore before adding** - Strain might already exist
5. **Use search** - Quickly find strains by name or terpene

### For Developers
1. **Check console logs** - Extensive logging throughout
2. **Use React Query DevTools** - Monitor API calls
3. **Test on real device** - Web preview has limitations
4. **Keep server running** - Backend must be up before app starts
5. **Version control JSON files** - Easy to reset during dev

---

## 🏁 Deployment Checklist

Before going to production:

### Backend
- [ ] Migrate to real database
- [ ] Add proper JWT expiration
- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Set up HTTPS/SSL
- [ ] Add input validation everywhere
- [ ] Implement proper error handling
- [ ] Add logging/monitoring
- [ ] Set up backups
- [ ] Write API tests

### Frontend
- [ ] Update API URLs to production
- [ ] Add error boundaries
- [ ] Implement offline support
- [ ] Add analytics
- [ ] Test on multiple devices
- [ ] Optimize images/assets
- [ ] Add loading states everywhere
- [ ] Handle edge cases
- [ ] Write E2E tests
- [ ] Test on slow connections

### Legal/Business
- [ ] Terms of service
- [ ] Privacy policy
- [ ] Age verification (if required by region)
- [ ] Content moderation policies
- [ ] Data deletion process
- [ ] GDPR/CCPA compliance

---

## 📚 Additional Resources

### Documentation
- [PROBLEM_SOLVED.md](./PROBLEM_SOLVED.md) - Architecture explanation
- [HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md) - Detailed user guide
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - QA checklist
- [START_HERE.md](./START_HERE.md) - Quick start guide

### Expo Docs
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/docs/getting-started)

### APIs Used
- [React Query](https://tanstack.com/query/latest)
- [Lucide Icons](https://lucide.dev/)
- [Rork AI Toolkit](https://rork.app/docs) - Image analysis

---

## 🎉 You're Ready!

You now have:
- ✅ Complete cannabis tracking app
- ✅ Social feed with interactions
- ✅ Digital card collection system
- ✅ AI-powered strain scanning
- ✅ Local backend for development
- ✅ Beautiful, modern UI
- ✅ TypeScript type safety
- ✅ Comprehensive documentation

**Start the backend, run the app, and start building!**

Questions? Check the troubleshooting section or review the detailed guides.

**Happy tracking! 🌿📊🚀**
