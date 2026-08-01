/*
  Warnings:

  - Added the required column `name` to the `PlayerStatistic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerStatistic" ADD COLUMN     "name" TEXT NOT NULL;
