/*
  Warnings:

  - You are about to drop the column `dateStar` on the `projects` table. All the data in the column will be lost.
  - Added the required column `dateStart` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "dateStar",
ADD COLUMN     "dateStart" TIMESTAMP(3) NOT NULL;
