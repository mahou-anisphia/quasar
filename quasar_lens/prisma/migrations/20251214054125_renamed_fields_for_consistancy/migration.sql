/*
  Warnings:

  - You are about to drop the column `CPULoadAvg` on the `Telemetry` table. All the data in the column will be lost.
  - You are about to drop the column `RAMLoadByPercentage` on the `Telemetry` table. All the data in the column will be lost.
  - You are about to drop the column `SwapLoad` on the `Telemetry` table. All the data in the column will be lost.
  - You are about to drop the column `usedDiskSpaceInPercentage` on the `Telemetry` table. All the data in the column will be lost.
  - Added the required column `cpuUsagePercentage` to the `Telemetry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diskUsagePercentage` to the `Telemetry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ramUsagePercentage` to the `Telemetry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swapUsedBytes` to the `Telemetry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Telemetry" DROP COLUMN "CPULoadAvg",
DROP COLUMN "RAMLoadByPercentage",
DROP COLUMN "SwapLoad",
DROP COLUMN "usedDiskSpaceInPercentage",
ADD COLUMN     "cpuUsagePercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "diskUsagePercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ramUsagePercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "swapUsedBytes" BIGINT NOT NULL;
