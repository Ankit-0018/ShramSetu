import prisma from "../prisma";
import appAssert from "../appAssert";
import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../http";

export type CreateWorkerProfileParams = {
  userId: string;
  profileImage?: string;
  age?: number;
  skills: string[];
  canRelocate?: boolean;
  dailyWage: number;
};

export type CreateEmployerProfileParams = {
  userId: string;
  profileImage?: string;
  age?: number;
  type?: "INDIVIDUAL" | "BUSINESS";
  businessName?: string;
  gst?: string;
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true, employerProfile: true },
  });

  appAssert(user, NOT_FOUND, "User not found");

  return user;
};

export const getPublicProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true, employerProfile: true },
  });

  appAssert(user, NOT_FOUND, "User not found");

  return {
    id: user.id,
    fullName: user.fullName,
    role: user.role,
    workerProfile: user.workerProfile
      ? {
          id: user.workerProfile.id,
          skills: user.workerProfile.skills,
          profilePhotoUrl: user.workerProfile.profilePhotoUrl,
          minimumWage: user.workerProfile.minimumWage,
        }
      : null,
    employerProfile: user.employerProfile
      ? {
          id: user.employerProfile.id,
          businessName: user.employerProfile.businessName,
          employerType: user.employerProfile.employerType,
          profilePhotoUrl: user.employerProfile.profilePhotoUrl,
        }
      : null,
  };
};

export const createWorkerProfile = async (
  params: CreateWorkerProfileParams,
) => {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  appAssert(user, NOT_FOUND, "User not found");
  appAssert(
    !user.isProfileCompleted,
    CONFLICT,
    "Profile already completed",
  );

  const [, workerProfile] = await prisma.$transaction([
    prisma.user.update({
      where: { id: params.userId },
      data: { role: "WORKER", isProfileCompleted: true },
    }),
    prisma.workerProfile.create({
      data: {
        userId: params.userId,
        age: params.age,
        profilePhotoUrl: params.profileImage,
        skills: params.skills,
        canRelocate: params.canRelocate ?? false,
        minimumWage: params.dailyWage,
      },
    }),
  ]);

  return {
    message: "Worker profile created successfully.",
    user: {
      id: workerProfile.id,
      userId: workerProfile.userId,
      age: workerProfile.age,
      minimumWage: workerProfile.minimumWage,
      canRelocate: workerProfile.canRelocate,
      profilePhotoUrl: workerProfile.profilePhotoUrl,
      skills: workerProfile.skills,
    },
  };
};

export const createEmployerProfile = async (
  params: CreateEmployerProfileParams,
) => {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  appAssert(user, NOT_FOUND, "User not found");
  appAssert(
    !user.isProfileCompleted,
    CONFLICT,
    "Profile already completed",
  );

  if (params.type === "BUSINESS") {
    appAssert(
      params.businessName,
      BAD_REQUEST,
      "businessName is required for BUSINESS employers",
    );
  }

  const [, employerProfile] = await prisma.$transaction([
    prisma.user.update({
      where: { id: params.userId },
      data: { role: "EMPLOYER", isProfileCompleted: true },
    }),
    prisma.employerProfile.create({
      data: {
        userId: params.userId,
        age: params.age,
        profilePhotoUrl: params.profileImage,
        employerType: params.type ?? "INDIVIDUAL",
        businessName: params.businessName,
        gstNumber: params.gst,
      },
    }),
  ]);

  return {
    message: "Employer profile created successfully.",
    user: {
      id: employerProfile.id,
      userId: employerProfile.userId,
      age: employerProfile.age,
      employerType: employerProfile.employerType,
      businessName: employerProfile.businessName,
      gstNumber: employerProfile.gstNumber,
      profilePhotoUrl: employerProfile.profilePhotoUrl,
    },
  };
};

export type UpdateProfileParams = {
  userId: string;
  fullName?: string;
  profilePhotoUrl?: string;
  minimumWage?: number;
  canRelocate?: boolean;
  skills?: string[];
  businessName?: string;
};

export const updateProfile = async (params: UpdateProfileParams) => {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: { workerProfile: true, employerProfile: true },
  });
  appAssert(user, NOT_FOUND, "User not found");

  if (params.fullName) {
    await prisma.user.update({
      where: { id: params.userId },
      data: { fullName: params.fullName },
    });
  }

  let worker = user.workerProfile;
  let employer = user.employerProfile;

  if (user.role === "WORKER" && user.workerProfile) {
    worker = await prisma.workerProfile.update({
      where: { userId: params.userId },
      data: {
        ...(params.profilePhotoUrl !== undefined && {
          profilePhotoUrl: params.profilePhotoUrl,
        }),
        ...(params.minimumWage !== undefined && {
          minimumWage: params.minimumWage,
        }),
        ...(params.canRelocate !== undefined && {
          canRelocate: params.canRelocate,
        }),
        ...(params.skills !== undefined && { skills: params.skills }),
      },
    });
  }

  if (user.role === "EMPLOYER" && user.employerProfile) {
    employer = await prisma.employerProfile.update({
      where: { userId: params.userId },
      data: {
        ...(params.profilePhotoUrl !== undefined && {
          profilePhotoUrl: params.profilePhotoUrl,
        }),
        ...(params.businessName !== undefined && {
          businessName: params.businessName,
        }),
      },
    });
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: params.userId },
  });

  return { user: updatedUser, worker, employer };
};
