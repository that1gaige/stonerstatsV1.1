# 🌿 StonerStats - Quick Reference Card

## 🚀 Start Everything (2 Commands)

```bash
# Terminal 1: Start Backend
cd localbackend && node index.js

# Terminal 2: Start App  
bun expo start
```

Then: **Scan QR with Expo Go on phone** (same WiFi!)

---

## ⚡ Common Commands

### Backend
```bash
# Start server
node index.js

# Check health
curl http://192.168.x.x:4000/api/health

# Reset data
rm data/*.json
```

### Frontend
```bash
# Start with clear cache
bun expo start -c

# Install dependencies
bun install

# Check for errors
bun run lint
```

---

## 🔧 Configuration Files

### Update Server IP
`constants/localBackendConfig.ts` → Line 12
```typescript
url: 'http://YOUR_IP:4000',
```

### Change Port
`localbackend/index.js` → Line 13
```javascript
const PORT = 4000; // Change this
```

---

## 📁 Key Directories

```
├── app/
│   ├── (tabs)/          # Main screens
│   │   ├── feed.tsx     # Social feed
│   │   ├── library.tsx  # Strains & cards
│   │   ├── log.tsx      # Log sessions
│   │   ├── stats.tsx    # Analytics
│   │   └── profile.tsx  # User profile
│   └── auth/            # Login/Signup
│
├── components/          # Reusable UI
├── constants/           # Config & data
├── contexts/            # Global state
└── localbackend/        # Server code
    ├── routes/          # API endpoints
    ├── controllers/     # Business logic
    └── data/            # JSON storage
```

---

## 🌐 API Endpoints

### Base URL
```
http://192.168.x.x:4000/api
```

### Auth
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Strains
- `GET /strains` - All strains
- `POST /strains` - Add strain

### Sessions
- `GET /sessions/feed` - Get feed
- `POST /sessions` - Log session
- `POST /sessions/:id/like` - Spark post

---

## 🎨 Design Tokens

### Colors
```typescript
background: '#0a0a0a'  // Deep black
surface:    '#1a1a1a'  // Card bg
primary:    '#4ade80'  // Green CTA
border:     '#333'     // Subtle lines
```

### Strain Types
```typescript
indica:  '#6b46c1'  // Purple
sativa:  '#f59e0b'  // Orange
hybrid:  '#10b981'  // Green
```

### Card Rarities
```typescript
common:    '#9ca3af'  // Gray
uncommon:  '#4ade80'  // Green
rare:      '#a855f7'  // Purple
epic:      '#3b82f6'  // Blue
legendary: '#fbbf24'  // Gold
mythic:    '#8b5cf6'  // Cosmic
```

---

## 🐛 Troubleshooting

### Can't Connect
1. Is backend running?
2. Same WiFi?
3. IP correct in config?
4. Test: `curl http://IP:4000/api/health`

### Server Crashes
```bash
# Port in use
lsof -i :4000
kill -9 <PID>
```

### App Errors
```bash
# Clear cache
bun expo start -c

# Reinstall
rm -rf node_modules
bun install
```

### Reset Data
```bash
cd localbackend/data
rm *.json
# Restart server
```

---

## 📊 Data Models

### User
```typescript
{
  user_id: string
  display_name: string
  handle: string
  password_hash: string
  created_at: Date
  following_user_ids: string[]
  preferences: {...}
}
```

### Strain
```typescript
{
  strain_id: string
  name: string
  type: 'indica' | 'sativa' | 'hybrid'
  terp_profile: string[]
  description?: string
  icon_render_params: {...}
  source: 'user' | 'developer'
}
```

### Session
```typescript
{
  session_id: string
  user_id: string
  strain_id: string
  method: string
  amount: number
  amount_unit: 'g' | 'mg' | 'ml'
  mood_before?: 1-5
  mood_after?: 1-5
  effects_tags: string[]
  notes?: string
  liked_by_user_ids: string[]
  likes_count: number
  created_at: Date
}
```

### Card
```typescript
{
  card_id: string
  strain_id: string
  card_name: string
  card_number: string  // "A1-001"
  set_name: string     // "Set A1"
  rarity: CardRarity
  art_variant: string
  shader: string
  obtained_at: Date
}
```

---

## 🎯 Feature Status

| Feature | Status | Location |
|---------|--------|----------|
| Auth | ✅ | app/auth/ |
| Feed | ✅ | app/(tabs)/feed.tsx |
| Library | ✅ | app/(tabs)/library.tsx |
| Cards | ✅ | components/StrainCard.tsx |
| Log Session | ✅ | app/(tabs)/log.tsx |
| Stats | ✅ | app/(tabs)/stats.tsx |
| Profile | ✅ | app/(tabs)/profile.tsx |
| AI Scan | ✅ | app/scan.tsx |
| Sparks | ✅ | Feed + Backend |
| Search | ✅ | Library filters |

---

## 🧪 Testing Checklist

- [ ] Backend starts
- [ ] App connects
- [ ] Signup works
- [ ] Login works
- [ ] Add strain
- [ ] Log session
- [ ] View feed
- [ ] Spark post
- [ ] View cards
- [ ] Search/filter
- [ ] Logout/login persists

---

## 📱 Tech Stack

```
Frontend:  React Native + Expo + TypeScript
Router:    Expo Router (file-based)
State:     React Query + Context
Backend:   Node.js + Express
Storage:   JSON files (dev) → PostgreSQL (prod)
Auth:      JWT tokens + bcrypt
AI:        Rork AI Toolkit
```

---

## 🔐 Security Notes

### Current (Dev)
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ⚠️ No HTTPS
- ⚠️ Simple JWT secret
- ⚠️ No rate limiting

### Needed (Prod)
- 🔒 HTTPS/SSL
- 🔒 Strong secrets (env vars)
- 🔒 Token refresh
- 🔒 Rate limiting
- 🔒 Input sanitization

---

## 📈 Performance

### Current
- 📁 JSON files (slow at scale)
- 🐌 No caching
- 🐌 No pagination

### Production
- 🚀 PostgreSQL + indexes
- 🚀 Redis caching
- 🚀 Pagination
- 🚀 CDN for assets

---

## 🎓 Learning Resources

### Documentation
- [MVP_GUIDE.md](./MVP_GUIDE.md) - Full guide
- [LOCALBACKEND_ARCHITECTURE.md](./LOCALBACKEND_ARCHITECTURE.md) - Backend deep dive
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Setup steps
- [START_HERE.md](./START_HERE.md) - Quick start

### External
- [Expo Docs](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Express.js](https://expressjs.com/)

---

## 🆘 Need Help?

### Quick Fixes
1. Restart backend
2. Clear app cache: `bun expo start -c`
3. Check IP in config
4. Test with curl
5. Read backend logs

### Still Stuck?
1. Check [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) troubleshooting
2. Review [MVP_GUIDE.md](./MVP_GUIDE.md) docs
3. Check backend terminal for errors
4. Check Expo terminal for errors

---

## 🎯 Production Deployment

### Steps
1. Choose platform (Railway, Render, Fly.io)
2. Set up PostgreSQL database
3. Add Prisma ORM
4. Set environment variables
5. Deploy backend
6. Update app config with prod URL
7. Test thoroughly
8. Deploy to app stores

---

## 💡 Pro Tips

1. **Always start backend first**
2. **Use real device, not web**
3. **Same WiFi required**
4. **Check logs when stuck**
5. **Keep JSON files backed up**
6. **Test with curl often**
7. **Clear cache when weird**
8. **Read error messages**

---

## 🔗 Quick Links

| Resource | File |
|----------|------|
| Complete Guide | [MVP_GUIDE.md](./MVP_GUIDE.md) |
| Backend Details | [LOCALBACKEND_ARCHITECTURE.md](./LOCALBACKEND_ARCHITECTURE.md) |
| Setup Steps | [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) |
| Quick Start | [START_HERE.md](./START_HERE.md) |
| User Manual | [HOW_TO_USE_THE_APP.md](./HOW_TO_USE_THE_APP.md) |

---

## ⚡ TL;DR

```bash
# 1. Start backend
cd localbackend && node index.js

# 2. Copy IP shown (e.g., http://192.168.1.100:4000)

# 3. Update constants/localBackendConfig.ts with that IP

# 4. Start app
bun expo start

# 5. Scan QR with Expo Go on phone (same WiFi!)

# 6. Sign up and use app
```

**That's it! 🎉**

---

## 📞 Status Check Commands

```bash
# Is backend running?
curl http://YOUR_IP:4000/api/health

# Check port
lsof -i :4000

# View data
cat localbackend/data/users.json | jq .

# Check WiFi IP
ifconfig | grep inet  # Mac/Linux
ipconfig              # Windows
```

---

**Print this page and keep it handy! 📄**

**Happy building! 🌿🚀**
