/*
  Warnings:

  - Added the required column `refreshTokenHash` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "refreshTokenHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT NOT NULL;
