/*
  Warnings:

  - You are about to drop the column `name` on the `PlayerStatistic` table. All the data in the column will be lost.
  - Added the required column `playerId` to the `PlayerStatistic` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GK', 'RB', 'RWB', 'CB', 'LCB', 'RCB', 'LB', 'LWB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'CF', 'ST');

-- AlterTable
ALTER TABLE "PlayerStatistic" DROP COLUMN "name",
ADD COLUMN     "playerId" TEXT NOT NULL,
ALTER COLUMN "goals" SET DEFAULT 0,
ALTER COLUMN "assists" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerPosition" "Position" NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "captain" BOOLEAN NOT NULL DEFAULT false,
    "viceCaptain" BOOLEAN NOT NULL DEFAULT false,
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStatistic" ADD CONSTRAINT "PlayerStatistic_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
