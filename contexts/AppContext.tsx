import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SmokeSession, Strain, User, StrainCard } from "@/types";
import { router } from "expo-router";

const STORAGE_KEYS = {
  AUTH_TOKEN: "stonerstats_auth_token",
  USER: "stonerstats_user",
  STRAINS: "stonerstats_strains",
  SESSIONS: "stonerstats_sessions",
  CARDS: "stonerstats_cards",
};

const DEFAULT_USER: User = {
  user_id: "user_default",
  display_name: "Guest",
  handle: "guest",
  created_at: new Date(),
  following_user_ids: [],
  preferences: {
    default_unit: "g",
    dark_mode: true,
    notifications_enabled: true,
    privacy_level: "public",
  },
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [strains, setStrains] = useState<Strain[]>([]);
  const [sessions, setSessions] = useState<SmokeSession[]>([]);
  const [cards, setCards] = useState<StrainCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuthToken = useCallback(async (token: string | null, userData?: User) => {
    setAuthTokenState(token);
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setIsAuthenticated(true);
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setIsAuthenticated(false);
      setUser(DEFAULT_USER);
    }
  }, []);

  const logout = useCallback(async () => {
    await setAuthToken(null);
    router.replace("/auth/login");
  }, [setAuthToken]);

  const initializeApp = useCallback(async () => {
    await loadData();
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const loadData = async () => {
    try {
      const [token, userData, strainsData, sessionsData, cardsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.STRAINS),
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.CARDS),
      ]);

      if (token) {
        setAuthTokenState(token);
        setIsAuthenticated(true);
      }

      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.created_at = new Date(parsed.created_at);
        setUser(parsed);
      }

      if (strainsData) {
        const parsed = JSON.parse(strainsData);
        const strainsWithDates: Strain[] = parsed.map((s: Strain) => ({
          ...s,
          created_at: new Date(s.created_at),
        }));
        setStrains(strainsWithDates);
      }

      if (sessionsData) {
        const parsed = JSON.parse(sessionsData);
        const sessionsWithDates = parsed.map((s: SmokeSession) => ({
          ...s,
          created_at: new Date(s.created_at),
        }));
        setSessions(sessionsWithDates);
      }

      if (cardsData) {
        const parsed = JSON.parse(cardsData);
        const cardsWithDates = parsed.map((c: StrainCard) => ({
          ...c,
          obtained_at: new Date(c.obtained_at),
          shader: c.shader || "standard_leaf_tint",
          sparks_count: c.sparks_count || 0,
        }));
        setCards(cardsWithDates);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStrain = useCallback(async (strain: Strain) => {
    const updated = [...strains, strain];
    setStrains(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify(updated));
    console.log(`Added strain: ${strain.name}`);
  }, [strains]);

  const addSession = useCallback(async (session: SmokeSession) => {
    const updated = [session, ...sessions];
    setSessions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  }, [sessions]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  }, [user]);

  const addCard = useCallback(async (card: StrainCard) => {
    const updated = [...cards, card];
    setCards(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
    console.log(`Added card: ${card.card_name}`);
  }, [cards]);

  const addCards = useCallback(async (newCards: StrainCard[]) => {
    const updated = [...cards, ...newCards];
    setCards(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
    console.log(`Added ${newCards.length} cards`);
  }, [cards]);

  return useMemo(() => ({
    authToken,
    user,
    strains,
    sessions,
    cards,
    isLoading,
    isAuthenticated,
    setAuthToken,
    logout,
    addStrain,
    addSession,
    updateUser,
    addCard,
    addCards,
  }), [authToken, user, strains, sessions, cards, isLoading, isAuthenticated, setAuthToken, logout, addStrain, addSession, updateUser, addCard, addCards]);
});


