import prisma from "../prisma";
import appAssert from "../appAssert";
import { NOT_FOUND } from "../http";
import { parsePagination, buildPagination } from "../pagination";

const requireEmployerProfile = async (userId: string) => {
  const employer = await prisma.employerProfile.findUnique({
    where: { userId },
  });
  appAssert(employer, NOT_FOUND, "Employer profile not found");
  return employer;
};

export const getEmployerJobs = async (userId: string, query: any) => {
  const employer = await requireEmployerProfile(userId);
  const { page, limit, skip } = parsePagination(query);

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { employerId: employer.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.job.count({ where: { employerId: employer.id } }),
  ]);

  return {
    jobs: jobs.map((job) => ({
      id: job.id,
      title: job.title,
      minimumWage: job.minimumWage,
      primarySkill: job.primarySkill,
      jobType: job.jobType,
      isActive: job.isActive,
      createdAt: job.createdAt,
      location: {
        formattedAddress: job.formattedAddress,
        cityId: job.cityId,
      },
    })),
    pagination: buildPagination(total, page, limit),
  };
};

export const getEmployerApplications = async (userId: string, query: any) => {
  const employer = await requireEmployerProfile(userId);
  const { page, limit, skip } = parsePagination(query);

  const where = { job: { employerId: employer.id } };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        job: { include: { city: true } },
        worker: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
      },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications: applications.map((a) => ({
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
      job: {
        id: a.job.id,
        title: a.job.title,
        location: { formattedAddress: a.job.formattedAddress },
      },
      worker: {
        id: a.worker.id,
        user: {
          fullName: a.worker.user.fullName,
          phoneNumber: a.worker.user.phoneNumber,
        },
      },
    })),
    pagination: buildPagination(total, page, limit),
  };
};

export const getEmployerAssignments = async (userId: string, query: any) => {
  const employer = await requireEmployerProfile(userId);
  const { page, limit, skip } = parsePagination(query);

  const where = { job: { employerId: employer.id } };

  const [assignments, total] = await Promise.all([
    prisma.assignment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        job: true,
        worker: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
      },
    }),
    prisma.assignment.count({ where }),
  ]);

  return {
    assignments: assignments.map((a) => ({
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
      job: {
        id: a.job.id,
        title: a.job.title,
        location: { formattedAddress: a.job.formattedAddress },
      },
      worker: {
        id: a.worker.id,
        user: {
          fullName: a.worker.user.fullName,
          phoneNumber: a.worker.user.phoneNumber,
        },
      },
    })),
    pagination: buildPagination(total, page, limit),
  };
};
