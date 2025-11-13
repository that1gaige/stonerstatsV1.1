import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { signupProcedure, loginProcedure } from "./routes/auth/route";
import sessionsRoute from "./routes/sessions/route";
import strainsRoute from "./routes/strains/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    signup: signupProcedure,
    login: loginProcedure,
  }),
  sessions: sessionsRoute,
  strains: strainsRoute,
});

export type AppRouter = typeof appRouter;
