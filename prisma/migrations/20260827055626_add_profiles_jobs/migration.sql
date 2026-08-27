-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WORKER', 'EMPLOYER');

-- CreateEnum
CREATE TYPE "EmployerType" AS ENUM ('INDIVIDUAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "profilePhotoUrl" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "canRelocate" BOOLEAN NOT NULL DEFAULT false,
    "minimumWage" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "formattedAddress" TEXT,
    "cityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "profilePhotoUrl" TEXT,
    "employerType" "EmployerType" NOT NULL DEFAULT 'INDIVIDUAL',
    "businessName" TEXT,
    "gstNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minimumWage" INTEGER NOT NULL,
    "primarySkill" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "formattedAddress" TEXT,
    "cityId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_code_key" ON "City"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerProfile_userId_key" ON "WorkerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerProfile_userId_key" ON "EmployerProfile"("userId");

-- CreateIndex
CREATE INDEX "Job_cityId_idx" ON "Job"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_workerId_key" ON "Application"("jobId", "workerId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_applicationId_key" ON "Assignment"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_assignmentId_key" ON "Rating"("assignmentId");

-- AddForeignKey
ALTER TABLE "WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerProfile" ADD CONSTRAINT "EmployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
