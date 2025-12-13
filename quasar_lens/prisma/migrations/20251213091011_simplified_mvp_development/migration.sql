/*
  Warnings:

  - You are about to drop the column `DiskIO` on the `Telemetry` table. All the data in the column will be lost.
  - You are about to drop the column `NetworkLatency` on the `Telemetry` table. All the data in the column will be lost.
  - You are about to drop the column `NetworkThroughput` on the `Telemetry` table. All the data in the column will be lost.
  - Added the required column `uptime` to the `Telemetry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Telemetry" DROP COLUMN "DiskIO",
DROP COLUMN "NetworkLatency",
DROP COLUMN "NetworkThroughput",
ADD COLUMN     "uptime" BIGINT NOT NULL;
