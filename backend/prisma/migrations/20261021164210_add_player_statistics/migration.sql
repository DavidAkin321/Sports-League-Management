/*
  Warnings:

  - A unique constraint covering the columns `[playerId]` on the table `PlayerStatistic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlayerStatistic_playerId_key" ON "PlayerStatistic"("playerId");
