export const mvpPrompt = `
✅ STONERSTATS — FULL MVP IMPLEMENTATION PROMPT

Deliver a production-ready MVP of the StonerStats mobile app with the following feature pillars: Feed, Strain Library, Consumption Logging, Personal Stats, and Local Backend synchronization. Maintain Expo Router structure, Expo SDK 54+ compliance, and React Native Web compatibility.

⸻

🌐 ARCHITECTURE CORE
- Preserve existing Expo Router layout with (tabs) navigation for Feed, Library, Log, Stats, Profile.
- Use TypeScript everywhere with strict typing; hydrate providers in app/_layout.tsx.
- React Query handles remote state (feed, strains, sessions). Local state via useState or @nkzw/create-context-hook providers.
- Local backend (localbackend folder) mirrors remote API: ensure parity between TRPC routes and local Express endpoints.
- Add comprehensive error boundaries and verbose console.debug logs for critical flows.
- All UI components must include testID props for automation readiness.

⸻

🔥 FEED (INSTAGRAM-STYLE)
- Display card posts and session shares in vertical list with pull-to-refresh.
- Each post shows: user avatar, username, timestamp, card preview or session summary, spark counter, comment button, re-share button.
- Sparks system replaces likes: 🔥 below hype threshold, 💥 when hypeThreshold is exceeded.
- Implement optimistic spark toggles using useMutation; fallback to local backend if remote unavailable.
- Enable share-to-feed composer supporting text caption, preview, optional stats toggle.
- Add skeleton loaders and empty states with call-to-action.

⸻

📚 STRAIN LIBRARY + CARD COLLECTION
- Maintain sub-tabs: My Strains, Explore, My Cards.
- My Strains: list of saved strains with filters by type, effects, terpene tags; integrate local backend sync.
- Explore: fetch paginated strains, highlight featured sets, allow adding to collection.
- My Cards: dual view (list + grid) toggled with animated switcher. Display card metadata (Card ID, rarity, shader, variant) and collection progress ("You own X cards — Set A1: Y / Z").
- Tap card → FullCardView: front artwork, flip animation for back, sparks, share, compare variants.
- Auto-generate cards per strain using constants/cardShaders, rarity rules, set numbering (A1-###). Persist generated cards in local storage (AsyncStorage) and sync with backend when online.

⸻

📝 CONSUMPTION LOGGING
- Log tab enables quick session capture (date/time, strain, method, dosage, effects, mood, notes).
- Provide templated quick-actions ("Microdose", "Evening Wind Down").
- Support attaching media (card preview or photo URL) with graceful web fallback.
- Sessions persist locally and via TRPC mutations. Handle offline queue to resend when connection restored.
- Display recent logs with edit/delete options and sparkable highlights if shared.

⸻

📊 STATS DASHBOARD
- Visualize consumption trends: bar chart for sessions/week, line for mood vs dosage, pie for strain types.
- Aggregate sparks earned, top strains, most shared cards.
- Implement animations using Animated API (React Native) with web fallbacks.
- Allow filtering by time range (7d, 30d, 90d, All) and segment by source (personal logs vs shared feed).

⸻

🔌 LOCAL BACKEND INTEGRATION
- Ensure localbackend Express/TRPC server matches app schemas for strains, sessions, users, cards.
- Provide environment toggle to switch between cloud API and local backend; detect availability at startup.
- Add retries with exponential backoff for network calls; surface ConnectionLoader component when syncing.
- Update utils/localBackendAPI.ts to expose strongly typed clients for feed, strains, sessions, cards.
- Seed local backend with demo strains, generated cards (Set A1), sample sessions, and feed posts.

⸻

🛡️ QUALITY & TOOLING
- Add Context-based auth guard gating tabs; guest flow redirects to /auth/login.
- Implement unit tests or integration mocks where feasible (React Testing Library for key components).
- Run exhaustive lint and type checks; ensure zero TS errors.
- No comments in code; rely on clear naming. Maintain cohesive design per existing color system.
- Do not modify RootLayoutNav component contract.

⸻

🏁 DELIVERY CHECKLIST
- Feed interactions fully functional with sparks, comments stub, re-share flow.
- Library supports strain management, exploration, and card collection with Set A1 auto-generation.
- Logging tab captures sessions and syncs with backend (online/offline).
- Stats tab reflects real data from logs/feed/cards.
- Local backend provides CRUD for strains, cards, sessions, users via TRPC-compatible routes.
- App builds without hydration or dev-server errors on Expo Go (iOS/Android/Web).
` as const;

export type MvpPrompt = typeof mvpPrompt;
