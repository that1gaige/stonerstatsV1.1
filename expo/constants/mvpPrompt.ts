export const mvpPrompt = `
✅ TOKETRACKER — MVP IMPLEMENTATION PROMPT

Ship a production-ready MVP of the TokeTracker webwrapped mobile app covering Feed, Strain Library, Consumption Logging, Personal Stats, and Local Backend sync. Maintain Expo Router structure, Expo SDK 54+ compliance, and React Native Web readiness.

⸻

🌐 ARCHITECTURE CORE
- Preserve existing Expo Router layout with (tabs) navigation for Feed, Library, Log, Stats, Profile.
- Use TypeScript with strict typing across screens, providers, and utilities; initialize shared providers inside app/_layout.tsx.
- Manage remote data via React Query (feed, strains, sessions, profile). Keep local UI state in useState or @nkzw/create-context-hook providers.
- Ensure all screens render cleanly inside a web wrapper (React Native Web) without native-only dependencies; rely on Expo Go-compatible APIs.
- Add comprehensive error boundaries and verbose console.debug statements around data fetches and mutations.
- Every interactive component includes an explicit testID for automated testing.

⸻

🔥 FEED TAB — SOCIAL SESSION STREAM
- Present an Instagram-style vertical feed of session shares and strain notes with pull-to-refresh.
- Each post shows: user avatar, display name, timestamp, session summary (strain, method, mood), optional photo, spark counter, comment entry point, re-share action.
- Replace likes with Sparks: 🔥 below hype threshold, 💥 when exceeded. Use optimistic mutations with rollback on failure.
- Provide a lightweight composer for sharing text, attaching existing session summaries, and selecting visibility.
- Surface empty states and skeleton loaders for first-time users and slow networks.

⸻

📚 LIBRARY TAB — STRAIN HUB
- Organize sub-tabs for My Strains and Explore (cards and rarities are removed).
- My Strains lists saved strains with quick filters by type (Indica/Sativa/Hybrid), primary effects, and personal tags.
- Explore fetches paginated strains from backend, highlights featured picks, and allows saving to collection.
- Each strain detail reveals primary terpenes, effect summaries, recommended sessions, and spark totals gathered from feed interactions.
- Ensure offline caching so saved strains remain accessible when the web wrapper drops connection.

⸻

📝 LOG TAB — CONSUMPTION JOURNAL
- Provide single-tap entry points for common session templates (e.g., Morning Microdose, Evening Relax).
- Core form captures strain, method, dosage, onset, effects, mood, notes, and optional media URL.
- Persist logs locally and via TRPC mutations; queue submissions offline and replay when connectivity returns.
- Display recent entries with edit and delete actions plus a toggle to share selected logs to the feed with Sparks enabled.

⸻

📊 STATS TAB — PERSONAL INSIGHTS
- Summarize key metrics: sessions per week, favored strains, average mood response, most sparked posts.
- Utilize Animated API with Platform checks for smooth transitions across mobile and web.
- Allow range filters (7d, 30d, 90d, All) and segment charts by strain type or session method.
- Ensure charts degrade gracefully on web (fallback to static views if animations are unsupported).

⸻

👤 PROFILE TAB — ACCOUNT & SETTINGS
- Centralize profile editing, avatar updates, and spark history overview.
- Provide toggles for notification preferences, privacy controls (auto-share logs), and environment selection (cloud vs local backend).
- Surface connection diagnostics for the web wrapper, indicating which API endpoint is active.
- Include logout/auth flows that integrate with existing backend auth routes.

⸻

🔌 LOCAL BACKEND INTEGRATION
- Align localbackend Express/TRPC routes with app schemas for users, strains, sessions, and feed posts (no card endpoints required).
- Offer a runtime switch that prioritizes local backend when available, with graceful fallback to remote.
- Implement retry with exponential backoff and expose connection status via ConnectionLoader.
- Seed local backend with sample strains, sessions, and feed posts so MVP delivers meaningful demo data.

⸻

🛡️ QUALITY & TOOLING
- Maintain auth guard contexts to protect tab navigation; unauthenticated users redirect to /auth/login.
- Add smoke tests or mocks for critical flows (feed fetch, strain save, session log) using React Testing Library for Web compatibility.
- Enforce zero TypeScript errors, clean ESLint output, and absence of hydration timeouts in Expo Web.
- No inline code comments; communicate intent through clear naming and modular structure.
- Keep RootLayoutNav contract intact to preserve navigation hierarchy.

⸻

🏁 DELIVERY CHECKLIST
- Feed tab delivers shareable session posts with Sparks, comments stub, and optimistic updates.
- Library tab handles strain discovery and personal collection without card mechanics or rarity layers.
- Log tab records sessions, syncs with backend, and optionally shares entries to feed.
- Stats tab reflects aggregated insights from logs and feed with responsive charts.
- Profile tab manages user settings, connectivity toggles, and spark summaries.
- Local backend mirrors remote API for core entities and powers offline-friendly operation in the webwrapped environment.
- App launches reliably inside web wrapper and Expo Go without dev-server or hydration failures.
` as const;

export type MvpPrompt = typeof mvpPrompt;
