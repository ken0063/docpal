import { currentUser } from "@clerk/nextjs";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

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

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { key } = input;
      const file = await db.file.findFirst({
        where: { key, userId },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),

  deleteFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;
      const file = await db.file.findFirst({
        where: {
          userId,
          id,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await db.file.delete({
        where: {
          userId,
          id,
        },
      });
      return file;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
