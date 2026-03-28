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
  likes: string[];
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
  private follows: Map<string, Set<string>> = new Map();

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

  getFeedSessions(userId: string, limit: number = 50): SessionData[] {
    const following = this.getFollowing(userId);
    
    if (following.length === 0) {
      return this.getAllSessions().slice(0, limit);
    }
    
    return Array.from(this.sessions.values())
      .filter((s) => following.includes(s.user_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
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

  followUser(followerId: string, followeeId: string): boolean {
    if (followerId === followeeId) return false;
    if (!this.users.has(followeeId)) return false;
    
    if (!this.follows.has(followerId)) {
      this.follows.set(followerId, new Set());
    }
    
    const followingSet = this.follows.get(followerId)!;
    followingSet.add(followeeId);
    
    const follower = this.users.get(followerId);
    if (follower && !follower.following_user_ids.includes(followeeId)) {
      follower.following_user_ids.push(followeeId);
    }
    
    return true;
  }

  unfollowUser(followerId: string, followeeId: string): boolean {
    const followingSet = this.follows.get(followerId);
    if (!followingSet) return false;
    
    const result = followingSet.delete(followeeId);
    
    const follower = this.users.get(followerId);
    if (follower) {
      follower.following_user_ids = follower.following_user_ids.filter(id => id !== followeeId);
    }
    
    return result;
  }

  getFollowing(userId: string): string[] {
    const followingSet = this.follows.get(userId);
    if (!followingSet) return [];
    return Array.from(followingSet);
  }

  getFollowers(userId: string): string[] {
    const followers: string[] = [];
    for (const [followerId, followingSet] of this.follows.entries()) {
      if (followingSet.has(userId)) {
        followers.push(followerId);
      }
    }
    return followers;
  }

  isFollowing(followerId: string, followeeId: string): boolean {
    const followingSet = this.follows.get(followerId);
    if (!followingSet) return false;
    return followingSet.has(followeeId);
  }

  likeSession(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    if (!session.likes.includes(userId)) {
      session.likes.push(userId);
      return true;
    }
    return false;
  }

  unlikeSession(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    const index = session.likes.indexOf(userId);
    if (index > -1) {
      session.likes.splice(index, 1);
      return true;
    }
    return false;
  }

  hasLiked(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    return session.likes.includes(userId);
  }

  searchUsers(query: string, limit: number = 20): UserData[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.users.values())
      .filter(user => 
        user.display_name.toLowerCase().includes(lowerQuery) ||
        user.handle.toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }
}

export const db = new InMemoryDB();

export type { UserData, SessionData, StrainData };
