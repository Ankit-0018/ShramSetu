/*
  Warnings:

  - The values [NUMBER_VERIFICATION] on the enum `VerificationType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[phoneNumber,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationType_new" AS ENUM ('REGISTER', 'LOGIN', 'PASSWORD_RESET');
ALTER TABLE "VerificationCode" ALTER COLUMN "type" TYPE "VerificationType_new" USING ("type"::text::"VerificationType_new");
ALTER TYPE "VerificationType" RENAME TO "VerificationType_old";
ALTER TYPE "VerificationType_new" RENAME TO "VerificationType";
DROP TYPE "public"."VerificationType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_phoneNumber_type_key" ON "VerificationCode"("phoneNumber", "type");
