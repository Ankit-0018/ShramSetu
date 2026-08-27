/*
  Warnings:

  - Added the required column `fullName` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "fullName" TEXT NOT NULL;
