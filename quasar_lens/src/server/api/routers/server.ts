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
});
