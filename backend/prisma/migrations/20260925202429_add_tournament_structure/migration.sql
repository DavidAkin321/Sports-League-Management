/*
  Warnings:

  - Added the required column `leagueId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchStage" AS ENUM ('GROUP', 'QUATER_FINAL', 'SEMI_FINAL', 'FINAL');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "leagueId" TEXT NOT NULL,
ADD COLUMN     "round" INTEGER NOT NULL,
ADD COLUMN     "stage" "MatchStage" NOT NULL;

-- CreateTable
CREATE TABLE "LeagueSettings" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "tournamentDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "matchDuration" INTEGER NOT NULL,
    "breakDuration" INTEGER NOT NULL,
    "surfaces" INTEGER NOT NULL,

    CONSTRAINT "LeagueSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSettings_leagueId_key" ON "LeagueSettings"("leagueId");

-- AddForeignKey
ALTER TABLE "LeagueSettings" ADD CONSTRAINT "LeagueSettings_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
