import { currentUser } from "@clerk/nextjs";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if (!user || !user?.emailAddresses[0]?.emailAddress) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user?.id,
      },
    });
    if (!dbUser)
      await db.user.create({
        data: {
          id: user?.id,
          email: user?.emailAddresses[0].emailAddress,
        },
      });
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
