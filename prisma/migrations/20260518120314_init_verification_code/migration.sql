-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('NUMBER_VERIFICATION');

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);
