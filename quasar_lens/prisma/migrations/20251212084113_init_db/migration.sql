-- CreateTable
CREATE TABLE "Server" (
    "serverId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalCPU" INTEGER NOT NULL,
    "totalRam" BIGINT NOT NULL,
    "totalPhysicalRamBar" INTEGER NOT NULL,
    "totalDiskSpace" BIGINT NOT NULL,
    "totalDiskDrive" INTEGER NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("serverId")
);

-- CreateTable
CREATE TABLE "Telemetry" (
    "telemetryId" SERIAL NOT NULL,
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedDiskSpaceInPercentage" DOUBLE PRECISION NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "CPULoadAvg" DOUBLE PRECISION NOT NULL,
    "RAMLoadByPercentage" DOUBLE PRECISION NOT NULL,
    "SwapLoadByPercentage" DOUBLE PRECISION,
    "DiskIO" DOUBLE PRECISION,
    "NetworkThroughput" INTEGER,
    "NetworkLatency" INTEGER,

    CONSTRAINT "Telemetry_pkey" PRIMARY KEY ("telemetryId")
);

-- AddForeignKey
ALTER TABLE "Telemetry" ADD CONSTRAINT "Telemetry_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("serverId") ON DELETE CASCADE ON UPDATE CASCADE;
