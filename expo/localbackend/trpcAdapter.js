const { initTRPC } = require('@trpc/server');
const { createExpressMiddleware } = require('@trpc/server/adapters/express');
const z = require('zod');

const authController = require('./controllers/authController');
const strainsController = require('./controllers/strainsController');
const sessionsController = require('./controllers/sessionsController');

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const token = ctx.req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const user = authController.verifyToken(token);
  if (!user) {
    throw new Error('Invalid token');
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

const protectedProcedure = publicProcedure.use(authMiddleware);

const appRouter = router({
  example: router({
    hi: publicProcedure.query(() => {
      return { message: 'Hello from local backend!' };
    }),
  }),
  
  auth: router({
    signup: publicProcedure
      .input(z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        return authController.signupHelper(input.username, input.email, input.password);
      }),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        return authController.loginHelper(input.email, input.password);
      }),
    
    me: protectedProcedure.query(async ({ ctx }) => {
      return authController.getMe(ctx.user.id);
    }),
  }),
  
  strains: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return strainsController.getAllStrainsHelper(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        return strainsController.getStrainByIdHelper(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.enum(['indica', 'sativa', 'hybrid']),
        thc: z.number().optional(),
        cbd: z.number().optional(),
        effects: z.array(z.string()).optional(),
        flavors: z.array(z.string()).optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return strainsController.createStrainHelper({ ...input, userId: ctx.user.id });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        type: z.enum(['indica', 'sativa', 'hybrid']).optional(),
        thc: z.number().optional(),
        cbd: z.number().optional(),
        effects: z.array(z.string()).optional(),
        flavors: z.array(z.string()).optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        return strainsController.updateStrainHelper(id, updates, ctx.user.id);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return strainsController.deleteStrainHelper(input.id, ctx.user.id);
      }),
  }),
  
  sessions: router({
    getUserSessions: protectedProcedure.query(async ({ ctx }) => {
      const sessions = sessionsController.getAllSessionsHelper(ctx.user.id);
      return sessions.map(session => ({
        session_id: session.id,
        user_id: session.userId,
        strain_id: session.strainId,
        method: session.method || 'joint',
        amount: session.amount || 1,
        amount_unit: session.amountUnit || 'g',
        mood_before: session.moodBefore,
        mood_after: session.moodAfter,
        effects_tags: session.effects || [],
        notes: session.notes,
        photo_urls: session.photoUrls || [],
        created_at: new Date(session.createdAt || Date.now()),
      }));
    }),
    
    getFeed: protectedProcedure.query(async ({ ctx }) => {
      const sessionsData = sessionsController.getAllSessionsHelper(ctx.user.id);
      const users = authController.verifyToken ? [ctx.user] : [];
      
      return sessionsData.map(session => {
        const user = users.find(u => u.id === session.userId) || ctx.user;
        const strain = strainsController.getStrainByIdHelper(session.strainId, ctx.user.id);
        
        return {
          session: {
            session_id: session.id,
            user_id: session.userId,
            strain_id: session.strainId,
            method: session.method || 'joint',
            amount: session.amount || 1,
            amount_unit: session.amountUnit || 'g',
            mood_before: session.moodBefore,
            mood_after: session.moodAfter,
            effects_tags: session.effects || [],
            notes: session.notes,
            photo_urls: session.photoUrls || [],
            created_at: new Date(session.createdAt || Date.now()),
          },
          user: {
            user_id: user.id,
            display_name: user.username,
            handle: user.username,
            avatar_url: user.avatarUrl,
          },
          strain: strain ? {
            strain_id: strain.id,
            name: strain.name,
            type: strain.type,
            icon_render_params: strain.iconRenderParams || {},
          } : null,
        };
      });
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        return sessionsController.getSessionByIdHelper(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        strain_id: z.string(),
        method: z.enum(['joint', 'bong', 'pipe', 'vape', 'edible', 'dab', 'other']),
        amount: z.number().positive(),
        amount_unit: z.enum(['g', 'mg']),
        mood_before: z.number().min(1).max(5).optional(),
        mood_after: z.number().min(1).max(5).optional(),
        effects_tags: z.array(z.string()),
        notes: z.string().optional(),
        photo_urls: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return sessionsController.createSessionHelper({
          strainId: input.strain_id,
          method: input.method,
          amount: input.amount,
          amountUnit: input.amount_unit,
          moodBefore: input.mood_before,
          moodAfter: input.mood_after,
          effects: input.effects_tags,
          notes: input.notes,
          photoUrls: input.photo_urls,
          userId: ctx.user.id
        });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        method: z.enum(['joint', 'bong', 'pipe', 'vape', 'edible', 'dab', 'other']).optional(),
        amount: z.number().positive().optional(),
        amount_unit: z.enum(['g', 'mg']).optional(),
        mood_before: z.number().min(1).max(5).optional(),
        mood_after: z.number().min(1).max(5).optional(),
        effects_tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
        photo_urls: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...rest } = input;
        const updates = {
          method: rest.method,
          amount: rest.amount,
          amountUnit: rest.amount_unit,
          moodBefore: rest.mood_before,
          moodAfter: rest.mood_after,
          effects: rest.effects_tags,
          notes: rest.notes,
          photoUrls: rest.photo_urls,
        };
        return sessionsController.updateSessionHelper(id, updates, ctx.user.id);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return sessionsController.deleteSessionHelper(input.id, ctx.user.id);
      }),
  }),
});

function createTRPCMiddleware() {
  return createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res }),
  });
}

module.exports = { createTRPCMiddleware, appRouter };
