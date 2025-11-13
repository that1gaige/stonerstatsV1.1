import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SmokeSession, Strain, User } from "@/types";



const STORAGE_KEYS = {
  USER: "stonerstats_user",
  STRAINS: "stonerstats_strains",
  SESSIONS: "stonerstats_sessions",
};

const DEFAULT_USER: User = {
  user_id: "user_default",
  display_name: "You",
  handle: "myhandle",
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
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [strains, setStrains] = useState<Strain[]>([]);
  const [sessions, setSessions] = useState<SmokeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeApp = useCallback(async () => {
    await loadData();
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const loadData = async () => {
    try {
      const [userData, strainsData, sessionsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.STRAINS),
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
      ]);

      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.created_at = new Date(parsed.created_at);
        setUser(parsed);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      }

      if (strainsData) {
        const parsed = JSON.parse(strainsData);
        const strainsWithDates: Strain[] = parsed.map((s: Strain) => ({
          ...s,
          created_at: new Date(s.created_at),
        }));
        setStrains(strainsWithDates);
      } else {
        setStrains([]);
        await AsyncStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify([]));
      }


      if (sessionsData) {
        const parsed = JSON.parse(sessionsData);
        const sessionsWithDates = parsed.map((s: SmokeSession) => ({
          ...s,
          created_at: new Date(s.created_at),
        }));
        setSessions(sessionsWithDates);
      } else {
        setSessions([]);
        await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
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

  return useMemo(() => ({
    user,
    strains,
    sessions,
    isLoading,
    addStrain,
    addSession,
    updateUser,
  }), [user, strains, sessions, isLoading, addStrain, addSession, updateUser]);
});


