/*
  Warnings:

  - You are about to drop the column `SwapLoadByPercentage` on the `Telemetry` table. All the data in the column will be lost.
  - Added the required column `SwapLoad` to the `Telemetry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Telemetry" DROP COLUMN "SwapLoadByPercentage",
ADD COLUMN     "SwapLoad" BIGINT NOT NULL;
