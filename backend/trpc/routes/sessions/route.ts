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

export const getFeedProcedure = protectedProcedure.query(async () => {
  const sessions = db.getFeedSessions(50);
  
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

export default {
  create: createSessionProcedure,
  getFeed: getFeedProcedure,
  getUserSessions: getUserSessionsProcedure,
};
