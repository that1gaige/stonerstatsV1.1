import { publicProcedure } from "../../create-context";
import { z } from "zod";
import { db } from "../../../db";
import { hashPassword, verifyPassword, generateToken } from "../../../auth";
import { TRPCError } from "@trpc/server";

export const signupProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      displayName: z.string().min(1),
      handle: z.string().min(1),
    })
  )
  .mutation(async ({ input }) => {
    const existingUser = db.getUserByEmail(input.email);
    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already exists",
      });
    }

    const existingHandle = db.getUserByHandle(input.handle);
    if (existingHandle) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username already taken",
      });
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const passwordHash = await hashPassword(input.password);

    const user = {
      user_id: userId,
      email: input.email,
      password_hash: passwordHash,
      display_name: input.displayName,
      handle: input.handle,
      avatar_url: undefined,
      bio: undefined,
      created_at: new Date().toISOString(),
      following_user_ids: [],
      preferences: {
        default_unit: "g" as const,
        dark_mode: true,
        notifications_enabled: true,
        privacy_level: "public" as const,
      },
    };

    db.createUser(user);
    const token = await generateToken(userId);

    console.log("User created:", userId, input.displayName);

    return {
      token,
      user: {
        user_id: user.user_id,
        display_name: user.display_name,
        handle: user.handle,
        avatar_url: user.avatar_url || undefined,
        bio: user.bio || undefined,
        created_at: new Date(user.created_at),
        following_user_ids: user.following_user_ids,
        preferences: user.preferences,
      },
    };
  });

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const user = db.getUserByEmail(input.email);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const valid = await verifyPassword(input.password, user.password_hash);
    if (!valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user.user_id);

    console.log("User logged in:", user.user_id, user.display_name);

    return {
      token,
      user: {
        user_id: user.user_id,
        display_name: user.display_name,
        handle: user.handle,
        avatar_url: user.avatar_url || undefined,
        bio: user.bio || undefined,
        created_at: new Date(user.created_at),
        following_user_ids: user.following_user_ids,
        preferences: user.preferences,
      },
    };
  });

export default { signup: signupProcedure, login: loginProcedure };
