# 🌿 StonerStats - Cannabis Session Tracker

A beautiful React Native app for tracking your cannabis sessions, built with Expo.

---

## ⚠️ IMPORTANT: New Simplified Backend

**The authentication system has been completely redesigned.**

If you're experiencing signup/login errors, start here:

### 📖 **[READ START_HERE.md FIRST](./START_HERE.md)** ←

---

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd localbackend
node index.js
```

Copy the network IP it displays (e.g., `http://192.168.10.226:4000`)

### 2. Update Config
Edit `constants/localBackendConfig.ts` line 12:
```typescript
url: 'http://YOUR_IP_HERE:4000',
```

### 3. Run on Phone
```bash
bun expo start
```

Scan QR with **Expo Go app** (web preview won't work)

### 4. Sign Up & Enjoy!

---

## 📚 Documentation

**Start here:**
- **[START_HERE.md](./START_HERE.md)** - Overview and quick links

**Setup guides:**
- **[HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md)** - Complete setup guide
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Verify everything works

**Technical details:**
- **[PROBLEM_SOLVED.md](./PROBLEM_SOLVED.md)** - What was fixed and why
- **[SIMPLIFIED_BACKEND_GUIDE.md](./SIMPLIFIED_BACKEND_GUIDE.md)** - Architecture docs

**Feature docs:**
- **[STRAIN_SYSTEM.md](./STRAIN_SYSTEM.md)** - How strain icons work
- **[STRAINS_LIBRARY.md](./STRAINS_LIBRARY.md)** - Strain database

---

## ✨ Features

### 📰 Feed
- View recent sessions
- Browse strain library
- Community feed (when online)

### 📚 Library
- 100+ cannabis strains
- Unique generated icons for each strain
- Filter by type (Indica/Sativa/Hybrid)
- THC/CBD info

### 📝 Log
- Track smoking sessions
- Rate experiences (1-5 stars)
- Add detailed notes
- Select from strain library

### 📊 Stats
- Session history
- Favorite strains
- Usage patterns
- Personal analytics

### 👤 Profile
- User settings
- Preferences
- Account management

---

## 🎨 Unique Features

### Dynamic Strain Icons
Each strain gets a unique, deterministic cannabis leaf icon:
- Generated from strain name (seed-based)
- Colors influenced by type
- Consistent across devices
- Beautiful gradients and glows

### Flexible Backend
Built-in UI to switch between:
- Local development server
- Production backend
- Multiple server options

No rebuild needed!

---

## 🏗 Architecture

### Simple REST API
```
┌──────────────┐
│  Expo App    │
│  (Phone)     │
└──────┬───────┘
       │ HTTP
       ↓
┌──────────────┐
│ Local Backend│
│  Express.js  │
│  Port 4000   │
└──────────────┘
```

**Why this is better:**
- ✅ Simple and reliable
- ✅ Easy to debug
- ✅ No transformation errors
- ✅ Fast development
- ✅ Production ready

See **[PROBLEM_SOLVED.md](./PROBLEM_SOLVED.md)** for the full story.

---

## 🛠 Tech Stack

**Frontend:**
- React Native
- Expo SDK 54
- TypeScript
- Expo Router (file-based routing)
- Lucide icons

**Backend:**
- Node.js + Express
- JSON file storage (dev)
- bcrypt for passwords
- Simple REST API

**State Management:**
- React Context (@nkzw/create-context-hook)
- AsyncStorage for persistence

---

## 📱 Requirements

### Development:
- Node.js (v20+)
- Bun package manager
- **Expo Go app on phone** (required!)
- Phone and computer on same WiFi

### Important Notes:
- ⚠️ **Web preview will NOT work** with local backend
- ⚠️ Must use real device with Expo Go
- ⚠️ Phone must be on same WiFi as dev machine

---

## 🔧 Development

### Install Dependencies
```bash
bun install
```

### Start Backend
```bash
cd localbackend
node index.js
```

### Start App
```bash
bun expo start
```

### Update Server IP
```bash
node update-server-ip.js YOUR_IP
```

### Reset Data
```bash
rm localbackend/data/*.json
```

---

## 📂 Project Structure

```
.
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   └── auth/              # Auth screens
├── components/            # Reusable components
├── constants/             # Config & constants
├── contexts/              # React Context providers
├── utils/                 # Helper functions
├── types/                 # TypeScript types
├── localbackend/          # Local dev server
│   ├── data/             # JSON storage
│   ├── controllers/      # Business logic
│   └── routes/           # API routes
└── docs/                  # Documentation
```

---

## 🐛 Troubleshooting

### "Connection timeout"
- Is server running? Check terminal
- Is phone on same WiFi?
- Did you update IP in config?

### "Signup error"
- Check server logs
- Verify IP is correct
- See [HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md) → Troubleshooting

### "Mixed content blocked"
- Don't use web preview
- Use Expo Go on real phone

**Full troubleshooting guide:**
[HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md)

---

## 🚀 Deployment

### Local Backend (Current)
- ✅ Perfect for development
- ✅ Privacy-first (your data, your machine)
- ✅ No cloud dependency
- ⚠️ Not for production

### Production Options

**Option A: Deploy Express Server**
- Railway, Render, Fly.io
- Add PostgreSQL/MongoDB
- Add proper JWT auth

**Option B: Backend-as-a-Service**
- Firebase, Supabase, etc.
- Managed infrastructure
- Quick to set up

See [SIMPLIFIED_BACKEND_GUIDE.md](./SIMPLIFIED_BACKEND_GUIDE.md) for details.

---

## 🔐 Security Notes

**Current (Local Dev):**
- ✅ Passwords hashed with bcrypt
- ⚠️ Simple tokens (not JWT)
- ⚠️ No HTTPS (local only)
- ⚠️ No rate limiting

**This is fine for local development!**

For production, add:
- JWT authentication
- HTTPS
- Rate limiting
- Token expiration
- Refresh tokens

---

## 📝 License

Private project - All rights reserved

---

## 🙏 Acknowledgments

Built with:
- Expo
- React Native
- Lucide Icons
- bcryptjs

---

## 📞 Support

Having issues?

1. **[START_HERE.md](./START_HERE.md)** - Overview
2. **[HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md)** - Setup guide  
3. **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Verify setup
4. **[PROBLEM_SOLVED.md](./PROBLEM_SOLVED.md)** - What was fixed

**Most common issues are solved in the docs!**

---

## 🎯 Roadmap

- [ ] Add image upload for strains
- [ ] Social features (friends, sharing)
- [ ] Advanced analytics
- [ ] Export data
- [ ] Dark/Light theme toggle
- [ ] Push notifications
- [ ] Deploy to app stores

---

**Built with 🌿 for cannabis enthusiasts**

**Last Updated:** January 2025

**Status:** ✅ Fully functional with simplified backend
