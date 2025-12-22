-- CreateTable
CREATE TABLE "Crashes" (
    "crashId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "crashTime" TIMESTAMP(3) NOT NULL,
    "duration" BIGINT NOT NULL,

    CONSTRAINT "Crashes_pkey" PRIMARY KEY ("crashId")
);

-- AddForeignKey
ALTER TABLE "Crashes" ADD CONSTRAINT "Crashes_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("serverId") ON DELETE CASCADE ON UPDATE CASCADE;
