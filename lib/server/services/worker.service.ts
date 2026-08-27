import prisma from "../prisma";
import appAssert from "../appAssert";
import { NOT_FOUND } from "../http";
import { reverseGeocode } from "../geocode";
import { parsePagination, buildPagination } from "../pagination";

const requireWorkerProfile = async (userId: string) => {
  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  appAssert(worker, NOT_FOUND, "Worker profile not found");
  return worker;
};

export const updateWorkerLocation = async (
  userId: string,
  latitude: number,
  longitude: number,
) => {
  const worker = await requireWorkerProfile(userId);
  const resolved = await reverseGeocode(latitude, longitude);

  await prisma.workerProfile.update({
    where: { id: worker.id },
    data: {
      latitude,
      longitude,
      formattedAddress: resolved.formattedAddress,
      cityId: resolved.cityId,
    },
  });

  return { message: "Location updated successfully." };
};

export const getWorkerApplications = async (
  userId: string,
  query: any,
) => {
  const worker = await requireWorkerProfile(userId);
  const { page, limit, skip } = parsePagination(query);

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { workerId: worker.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.application.count({ where: { workerId: worker.id } }),
  ]);

  return {
    applications: applications.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      workerId: a.workerId,
      status: a.status,
      createdAt: a.createdAt,
    })),
    pagination: buildPagination(total, page, limit),
  };
};

export const getWorkerAssignments = async (
  userId: string,
  query: any,
) => {
  const worker = await requireWorkerProfile(userId);
  const { page, limit, skip } = parsePagination(query);

  const [assignments, total] = await Promise.all([
    prisma.assignment.findMany({
      where: { workerId: worker.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.assignment.count({ where: { workerId: worker.id } }),
  ]);

  return {
    assignments: assignments.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      workerId: a.workerId,
      status: a.status,
      createdAt: a.createdAt,
    })),
    pagination: buildPagination(total, page, limit),
  };
};
