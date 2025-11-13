import { User, SmokeSession, Strain } from "@/types";

interface UserData {
  user_id: string;
  email: string;
  password_hash: string;
  display_name: string;
  handle: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  following_user_ids: string[];
  preferences: {
    default_unit: "g" | "mg";
    dark_mode: boolean;
    notifications_enabled: boolean;
    privacy_level: "public" | "friends" | "private";
  };
}

interface SessionData {
  session_id: string;
  user_id: string;
  strain_id: string;
  method: string;
  amount: number;
  amount_unit: "g" | "mg";
  mood_before?: number;
  mood_after?: number;
  effects_tags: string[];
  notes?: string;
  photo_urls?: string[];
  created_at: string;
}

interface StrainData extends Omit<Strain, "created_at"> {
  created_at: string;
}

class InMemoryDB {
  private users: Map<string, UserData> = new Map();
  private sessions: Map<string, SessionData> = new Map();
  private strains: Map<string, StrainData> = new Map();
  private emailToUserId: Map<string, string> = new Map();
  private handleToUserId: Map<string, string> = new Map();

  getUserById(userId: string): UserData | undefined {
    return this.users.get(userId);
  }

  getUserByEmail(email: string): UserData | undefined {
    const userId = this.emailToUserId.get(email.toLowerCase());
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  getUserByHandle(handle: string): UserData | undefined {
    const userId = this.handleToUserId.get(handle.toLowerCase());
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  createUser(user: UserData): void {
    this.users.set(user.user_id, user);
    this.emailToUserId.set(user.email.toLowerCase(), user.user_id);
    this.handleToUserId.set(user.handle.toLowerCase(), user.user_id);
  }

  getAllUsers(): UserData[] {
    return Array.from(this.users.values());
  }

  createSession(session: SessionData): void {
    this.sessions.set(session.session_id, session);
  }

  getSessionsByUserId(userId: string): SessionData[] {
    return Array.from(this.sessions.values())
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getAllSessions(): SessionData[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getFeedSessions(limit: number = 50): SessionData[] {
    return this.getAllSessions().slice(0, limit);
  }

  createStrain(strain: StrainData): void {
    this.strains.set(strain.strain_id, strain);
  }

  getStrainById(strainId: string): StrainData | undefined {
    return this.strains.get(strainId);
  }

  getAllStrains(): StrainData[] {
    return Array.from(this.strains.values());
  }
}

export const db = new InMemoryDB();

export type { UserData, SessionData, StrainData };
