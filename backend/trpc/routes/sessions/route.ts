import { protectedProcedure } from "../../create-context";
import { z } from "zod";
import { db } from "../../../db";
import { TRPCError } from "@trpc/server";

export const createSessionProcedure = protectedProcedure
  .input(
    z.object({
      strain_id: z.string(),
      method: z.enum(["joint", "bong", "pipe", "vape", "edible", "dab", "other"]),
      amount: z.number().positive(),
      amount_unit: z.enum(["g", "mg"]),
      mood_before: z.number().min(1).max(5).optional(),
      mood_after: z.number().min(1).max(5).optional(),
      effects_tags: z.array(z.string()),
      notes: z.string().optional(),
      photo_urls: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const strain = db.getStrainById(input.strain_id);
    if (!strain) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Strain not found",
      });
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const session = {
      session_id: sessionId,
      user_id: ctx.userId,
      strain_id: input.strain_id,
      method: input.method,
      amount: input.amount,
      amount_unit: input.amount_unit,
      mood_before: input.mood_before,
      mood_after: input.mood_after,
      effects_tags: input.effects_tags,
      notes: input.notes,
      photo_urls: input.photo_urls,
      created_at: new Date().toISOString(),
      likes: [],
    };

    db.createSession(session);

    console.log("Session created:", sessionId, "by user:", ctx.user.display_name);

    return {
      session_id: session.session_id,
      user_id: session.user_id,
      strain_id: session.strain_id,
      method: session.method,
      amount: session.amount,
      amount_unit: session.amount_unit,
      mood_before: session.mood_before,
      mood_after: session.mood_after,
      effects_tags: session.effects_tags,
      notes: session.notes,
      photo_urls: session.photo_urls,
      created_at: new Date(session.created_at),
    };
  });

export const getFeedProcedure = protectedProcedure.query(async ({ ctx }) => {
  const sessions = db.getFeedSessions(ctx.userId, 50);
  
  return sessions.map((session) => {
    const user = db.getUserById(session.user_id);
    const strain = db.getStrainById(session.strain_id);

    return {
      session: {
        session_id: session.session_id,
        user_id: session.user_id,
        strain_id: session.strain_id,
        method: session.method,
        amount: session.amount,
        amount_unit: session.amount_unit,
        mood_before: session.mood_before,
        mood_after: session.mood_after,
        effects_tags: session.effects_tags,
        notes: session.notes,
        photo_urls: session.photo_urls,
        created_at: new Date(session.created_at),
        likes_count: session.likes.length,
        has_liked: session.likes.includes(ctx.userId),
      },
      user: user
        ? {
            user_id: user.user_id,
            display_name: user.display_name,
            handle: user.handle,
            avatar_url: user.avatar_url,
          }
        : null,
      strain: strain
        ? {
            strain_id: strain.strain_id,
            name: strain.name,
            type: strain.type,
            icon_render_params: strain.icon_render_params,
            icon_seed: strain.icon_seed || '',
            created_at: new Date(strain.created_at),
          }
        : null,
    };
  });
});

export const getUserSessionsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const sessions = db.getSessionsByUserId(ctx.userId);
  
  return sessions.map((session) => ({
    session_id: session.session_id,
    user_id: session.user_id,
    strain_id: session.strain_id,
    method: session.method,
    amount: session.amount,
    amount_unit: session.amount_unit,
    mood_before: session.mood_before,
    mood_after: session.mood_after,
    effects_tags: session.effects_tags,
    notes: session.notes,
    photo_urls: session.photo_urls,
    created_at: new Date(session.created_at),
  }));
});

export const likeSessionProcedure = protectedProcedure
  .input(z.object({ sessionId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const success = db.likeSession(input.sessionId, ctx.userId);
    
    if (!success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Session not found or already liked",
      });
    }

    console.log(`User ${ctx.user.display_name} liked session ${input.sessionId}`);

    return { success: true };
  });

export const unlikeSessionProcedure = protectedProcedure
  .input(z.object({ sessionId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const success = db.unlikeSession(input.sessionId, ctx.userId);
    
    if (!success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Session not found or not liked",
      });
    }

    console.log(`User ${ctx.user.display_name} unliked session ${input.sessionId}`);

    return { success: true };
  });

export default {
  create: createSessionProcedure,
  getFeed: getFeedProcedure,
  getUserSessions: getUserSessionsProcedure,
  like: likeSessionProcedure,
  unlike: unlikeSessionProcedure,
};
