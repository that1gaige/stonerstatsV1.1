const { initTRPC } = require('@trpc/server');
const { createExpressMiddleware } = require('@trpc/server/adapters/express');
const z = require('zod');

let superjson;
try {
  superjson = require('superjson');
} catch (_e) {
  console.warn('[tRPC] superjson not available, using default transformer');
  superjson = undefined;
}

const authController = require('./controllers/authController');
const strainsController = require('./controllers/strainsController');
const sessionsController = require('./controllers/sessionsController');

const t = initTRPC.create({
  transformer: superjson,
});

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
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return sessionsController.getAllSessionsHelper(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        return sessionsController.getSessionByIdHelper(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        strainId: z.string(),
        rating: z.number().min(1).max(5),
        effects: z.array(z.string()).optional(),
        notes: z.string().optional(),
        timestamp: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return sessionsController.createSessionHelper({ ...input, userId: ctx.user.id });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        rating: z.number().min(1).max(5).optional(),
        effects: z.array(z.string()).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
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
