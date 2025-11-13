import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SmokeSession, Strain, User } from "@/types";
import { createStrain } from "@/utils/iconGenerator";
import { DEMO_STRAINS_DATA } from "@/constants/demoStrains";


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
        const demoStrains = createDemoStrains();
        setStrains(demoStrains);
        await AsyncStorage.setItem(STORAGE_KEYS.STRAINS, JSON.stringify(demoStrains));
      }


      if (sessionsData) {
        const parsed = JSON.parse(sessionsData);
        const sessionsWithDates = parsed.map((s: SmokeSession) => ({
          ...s,
          created_at: new Date(s.created_at),
        }));
        setSessions(sessionsWithDates);
      } else {
        const currentStrains = strainsData ? JSON.parse(strainsData) : createDemoStrains();
        const demoSessions = createDemoSessions(currentStrains);
        setSessions(demoSessions);
        await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(demoSessions));
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

function createDemoStrains(): Strain[] {
  return DEMO_STRAINS_DATA.map(d =>
    createStrain(d.name, d.type, {
      terp_profile: [...d.terp_profile],
      description: d.description,
    })
  );
}

function createDemoSessions(strains: Strain[]): SmokeSession[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  const strainIds = strains.slice(0, 4).map((s) => s.strain_id);

  return [
    {
      session_id: "session_1",
      user_id: "user_default",
      strain_id: strainIds[0],
      method: "joint",
      amount: 0.5,
      amount_unit: "g",
      mood_before: 3,
      mood_after: 5,
      effects_tags: ["relaxed", "creative", "happy"],
      notes: "Perfect evening session",
      created_at: new Date(now - 1 * day),
    },
    {
      session_id: "session_2",
      user_id: "user_default",
      strain_id: strainIds[1],
      method: "bong",
      amount: 0.3,
      amount_unit: "g",
      mood_before: 2,
      mood_after: 4,
      effects_tags: ["sleepy", "relaxed", "pain_relief"],
      created_at: new Date(now - 3 * day),
    },
    {
      session_id: "session_3",
      user_id: "user_default",
      strain_id: strainIds[2],
      method: "vape",
      amount: 0.4,
      amount_unit: "g",
      mood_before: 3,
      mood_after: 5,
      effects_tags: ["energetic", "focused", "creative"],
      notes: "Great for productivity!",
      created_at: new Date(now - 5 * day),
    },
    {
      session_id: "session_4",
      user_id: "user_default",
      strain_id: strainIds[3],
      method: "pipe",
      amount: 0.35,
      amount_unit: "g",
      mood_before: 3,
      mood_after: 5,
      effects_tags: ["euphoric", "relaxed", "hungry"],
      created_at: new Date(now - 7 * day),
    },
    {
      session_id: "session_5",
      user_id: "user_default",
      strain_id: strainIds[0],
      method: "joint",
      amount: 0.6,
      amount_unit: "g",
      mood_before: 4,
      mood_after: 5,
      effects_tags: ["social", "happy", "creative"],
      created_at: new Date(now - 8 * day),
    },
    {
      session_id: "session_6",
      user_id: "user_default",
      strain_id: strainIds[1],
      method: "bong",
      amount: 0.4,
      amount_unit: "g",
      mood_before: 2,
      mood_after: 4,
      effects_tags: ["relaxed", "sleepy"],
      created_at: new Date(now - 10 * day),
    },
    {
      session_id: "session_7",
      user_id: "user_default",
      strain_id: strainIds[2],
      method: "vape",
      amount: 0.5,
      amount_unit: "g",
      mood_before: 3,
      mood_after: 4,
      effects_tags: ["focused", "energetic"],
      created_at: new Date(now - 12 * day),
    },
    {
      session_id: "session_8",
      user_id: "user_default",
      strain_id: strainIds[3],
      method: "joint",
      amount: 0.5,
      amount_unit: "g",
      mood_before: 3,
      mood_after: 5,
      effects_tags: ["euphoric", "happy", "hungry"],
      created_at: new Date(now - 14 * day),
    },
  ];
}
