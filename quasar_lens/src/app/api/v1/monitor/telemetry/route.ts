// src/app/api/v1/monitor/telemetry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { env } from "~/env.js";

const requestSchema = z.object({
  server: z.object({
    serverName: z.string().min(1, "Server name is required"),
    totalCpu: z.number().int().positive(),
    totalRam: z.number().positive(),
    totalPhysicalRamBar: z.number().int().positive(),
    totalDiskSpace: z.number().positive(),
    totalDiskDrive: z.number().int().positive(),
  }),
  telemetry: z.object({
    diskUsagePercentage: z.number().min(0).max(100),
    uptime: z.number().nonnegative(),
    cpuUsagePercentage: z.number().min(0).max(100),
    ramUsagePercentage: z.number().min(0).max(100),
    swapUsedBytes: z.number().nonnegative(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Validate Bearer token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (token !== env.API_KEY) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = (await request.json()) as unknown;
    const validatedData = requestSchema.parse(body);

    // Find or create server
    const server =
      (await db.server.findUnique({
        where: { name: validatedData.server.serverName },
        select: { serverId: true },
      })) ??
      (await db.server.create({
        data: {
          name: validatedData.server.serverName,
          totalCPU: validatedData.server.totalCpu,
          totalRam: BigInt(validatedData.server.totalRam),
          totalPhysicalRamBar: validatedData.server.totalPhysicalRamBar,
          totalDiskSpace: BigInt(validatedData.server.totalDiskSpace),
          totalDiskDrive: validatedData.server.totalDiskDrive,
        },
        select: { serverId: true },
      }));

    // Create telemetry record
    const telemetry = await db.telemetry.create({
      data: {
        serverId: server.serverId,
        diskUsagePercentage: validatedData.telemetry.diskUsagePercentage,
        attemptNo: 1, // Will be added in future iterations
        uptime: BigInt(validatedData.telemetry.uptime),
        cpuUsagePercentage: validatedData.telemetry.cpuUsagePercentage,
        ramUsagePercentage: validatedData.telemetry.ramUsagePercentage,
        swapUsedBytes: BigInt(validatedData.telemetry.swapUsedBytes),
      },
    });

    return NextResponse.json(
      {
        success: true,
        telemetryId: telemetry.telemetryId,
        createdAt: telemetry.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating telemetry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
