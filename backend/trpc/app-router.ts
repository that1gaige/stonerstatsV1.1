import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import authRoute from "./routes/auth/route";
import sessionsRoute from "./routes/sessions/route";
import strainsRoute from "./routes/strains/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: authRoute,
  sessions: sessionsRoute,
  strains: strainsRoute,
});

export type AppRouter = typeof appRouter;
