import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const serverRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const servers = await ctx.db.server.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        telemetry: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return servers.map((server) => ({
      serverId: server.serverId,
      name: server.name,
      createdAt: server.createdAt,
      totalCPU: server.totalCPU,
      totalRam: server.totalRam,
      totalPhysicalRamBar: server.totalPhysicalRamBar,
      totalDiskSpace: server.totalDiskSpace,
      totalDiskDrive: server.totalDiskDrive,
      latestTelemetry: server.telemetry[0] ?? null,
    }));
  }),

  getById: publicProcedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ ctx, input }) => {
      const server = await ctx.db.server.findUnique({
        where: { serverId: input.serverId },
        include: {
          telemetry: {
            orderBy: { createdAt: "desc" },
            take: 100, // Get last 100 telemetry records for historical data
          },
          crashes: {
            orderBy: { crashTime: "desc" },
            take: 20, // Get last 20 crashes
          },
        },
      });

      if (!server) {
        throw new Error("Server not found");
      }

      return {
        serverId: server.serverId,
        name: server.name,
        createdAt: server.createdAt,
        updatedAt: server.updatedAt,
        totalCPU: server.totalCPU,
        totalRam: server.totalRam,
        totalPhysicalRamBar: server.totalPhysicalRamBar,
        totalDiskSpace: server.totalDiskSpace,
        totalDiskDrive: server.totalDiskDrive,
        telemetry: server.telemetry,
        crashes: server.crashes,
      };
    }),
});
