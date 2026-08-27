import prisma from "../prisma";
import appAssert from "../appAssert";
import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
} from "../http";
import { parsePagination, buildPagination } from "../pagination";
import { reverseGeocode } from "../geocode";
import { haversineKm } from "../distance";

const requireWorkerProfile = async (userId: string) => {
  const worker = await prisma.workerProfile.findUnique({ where: { userId } });
  appAssert(worker, NOT_FOUND, "Worker profile not found");
  return worker;
};

const requireEmployerProfile = async (userId: string) => {
  const employer = await prisma.employerProfile.findUnique({
    where: { userId },
  });
  appAssert(employer, NOT_FOUND, "Employer profile not found");
  return employer;
};

const jobEmployerSummary = (employer: {
  id: string;
  businessName: string | null;
  profilePhotoUrl: string | null;
  user: { fullName: string };
  jobsPosted?: number;
}) => ({
  id: employer.id,
  name: employer.businessName || employer.user.fullName,
  profileImageUrl: employer.profilePhotoUrl,
  jobsPosted: employer.jobsPosted ?? 0,
  rating: null as number | null,
  reviewCount: 0,
});

export const getNearbyJobs = async (userId: string, query: any) => {
  const worker = await requireWorkerProfile(userId);
  appAssert(
    worker.cityId,
    BAD_REQUEST,
    "Worker location not set. Update status first.",
  );

  const { page, limit, skip } = parsePagination(query);

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { isActive: true, cityId: worker.cityId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        employer: { include: { user: { select: { fullName: true } } } },
      },
    }),
    prisma.job.count({ where: { isActive: true, cityId: worker.cityId } }),
  ]);

  const employerJobCounts = await prisma.job.groupBy({
    by: ["employerId"],
    where: { employerId: { in: jobs.map((j) => j.employerId) } },
    _count: { _all: true },
  });
  const jobsPostedMap = new Map(
    employerJobCounts.map((e) => [e.employerId, e._count._all]),
  );

  return {
    jobs: jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      imageUrl: job.imageUrls[0] ?? null,
      minimumWage: job.minimumWage,
      primarySkill: job.primarySkill,
      jobType: job.jobType,
      createdAt: job.createdAt,
      distanceKm:
        worker.latitude != null && worker.longitude != null
          ? Math.round(
              haversineKm(
                worker.latitude,
                worker.longitude,
                job.latitude,
                job.longitude,
              ) * 10,
            ) / 10
          : null,
      location: { formattedAddress: job.formattedAddress },
      employer: jobEmployerSummary({
        ...job.employer,
        jobsPosted: jobsPostedMap.get(job.employerId) ?? 0,
      }),
    })),
    pagination: buildPagination(total, page, limit),
  };
};

export type CreateJobParams = {
  userId: string;
  title: string;
  description?: string;
  imageUrls?: string[];
  minimumWage: number;
  primarySkill: string;
  jobType: "FULL_TIME" | "PART_TIME" | "ONE_TIME";
  latitude: number;
  longitude: number;
};

export const createJob = async (params: CreateJobParams) => {
  const employer = await requireEmployerProfile(params.userId);
  const resolved = await reverseGeocode(params.latitude, params.longitude);

  const job = await prisma.job.create({
    data: {
      employerId: employer.id,
      title: params.title,
      description: params.description,
      imageUrls: params.imageUrls ?? [],
      minimumWage: params.minimumWage,
      primarySkill: params.primarySkill,
      jobType: params.jobType,
      latitude: params.latitude,
      longitude: params.longitude,
      formattedAddress: resolved.formattedAddress,
      cityId: resolved.cityId,
    },
  });

  return {
    id: job.id,
    employerId: job.employerId,
    title: job.title,
    description: job.description,
    imageUrls: job.imageUrls,
    minimumWage: job.minimumWage,
    primarySkill: job.primarySkill,
    jobType: job.jobType,
    isActive: job.isActive,
    createdAt: job.createdAt,
    location: {
      formattedAddress: job.formattedAddress,
      latitude: job.latitude,
      longitude: job.longitude,
    },
  };
};

export const deactivateJob = async (userId: string, jobId: string) => {
  const employer = await requireEmployerProfile(userId);

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  appAssert(job, NOT_FOUND, "Job not found");
  appAssert(job.employerId === employer.id, FORBIDDEN, "Not your job");
  appAssert(job.isActive, CONFLICT, "Job already closed");

  return prisma.job.update({
    where: { id: jobId },
    data: { isActive: false },
  });
};

export const getJobById = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      employer: { include: { user: { select: { fullName: true } } } },
    },
  });
  appAssert(job, NOT_FOUND, "Job not found");

  const worker = await prisma.workerProfile.findUnique({ where: { userId } });

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    imageUrls: job.imageUrls,
    minimumWage: job.minimumWage,
    primarySkill: job.primarySkill,
    jobType: job.jobType,
    isActive: job.isActive,
    createdAt: job.createdAt,
    location: {
      formattedAddress: job.formattedAddress,
      latitude: job.latitude,
      longitude: job.longitude,
    },
    employer: {
      id: job.employer.id,
      businessName: job.employer.businessName,
      employerType: job.employer.employerType,
      profilePhotoUrl: job.employer.profilePhotoUrl,
      user: { fullName: job.employer.user.fullName },
    },
    distanceKm:
      worker?.latitude != null && worker?.longitude != null
        ? Math.round(
            haversineKm(
              worker.latitude,
              worker.longitude,
              job.latitude,
              job.longitude,
            ) * 10,
          ) / 10
        : null,
  };
};

export const applyToJob = async (userId: string, jobId: string) => {
  const worker = await requireWorkerProfile(userId);

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  appAssert(job, NOT_FOUND, "Job not found");
  appAssert(job.isActive, CONFLICT, "Job is no longer active");

  const existing = await prisma.application.findUnique({
    where: { jobId_workerId: { jobId, workerId: worker.id } },
  });
  appAssert(!existing, CONFLICT, "You have already applied to this job");

  const application = await prisma.application.create({
    data: { jobId, workerId: worker.id },
  });

  return {
    id: application.id,
    jobId: application.jobId,
    workerId: application.workerId,
    status: application.status,
    createdAt: application.createdAt,
  };
};

export const getJobApplications = async (
  userId: string,
  jobId: string,
  query: any,
) => {
  const employer = await requireEmployerProfile(userId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  appAssert(job, NOT_FOUND, "Job not found");
  appAssert(job.employerId === employer.id, FORBIDDEN, "Not your job");

  const { page, limit, skip } = parsePagination(query);

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        worker: { include: { user: { select: { fullName: true } } } },
      },
    }),
    prisma.application.count({ where: { jobId } }),
  ]);

  return {
    applications: applications.map((a) => ({
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
      worker: {
        id: a.worker.id,
        profilePhotoUrl: a.worker.profilePhotoUrl,
        skills: a.worker.skills,
        user: { fullName: a.worker.user.fullName },
      },
    })),
    pagination: buildPagination(total, page, limit),
  };
};

export const updateApplicationStatus = async (
  userId: string,
  applicationId: string,
  status: "ACCEPTED" | "REJECTED",
) => {
  const employer = await requireEmployerProfile(userId);

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });
  appAssert(application, NOT_FOUND, "Application not found");
  appAssert(
    application.job.employerId === employer.id,
    FORBIDDEN,
    "Not your job",
  );
  appAssert(
    application.status === "PENDING",
    CONFLICT,
    "Application already processed",
  );

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  let assignment = null;
  if (status === "ACCEPTED") {
    assignment = await prisma.assignment.create({
      data: {
        applicationId: updated.id,
        jobId: updated.jobId,
        workerId: updated.workerId,
      },
    });
  }

  return {
    message: `Application ${status === "ACCEPTED" ? "accepted" : "rejected"} successfully`,
    application: updated,
    ...(assignment && { assignment }),
  };
};

export const updateAssignmentStatus = async (
  userId: string,
  assignmentId: string,
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { job: true, worker: true },
  });
  appAssert(assignment, NOT_FOUND, "Assignment not found");

  const isOwner =
    assignment.worker.userId === userId ||
    (await prisma.employerProfile.findUnique({ where: { userId } }))?.id ===
      assignment.job.employerId;
  appAssert(isOwner, FORBIDDEN, "Not authorized for this assignment");

  appAssert(
    assignment.status !== "COMPLETED" && assignment.status !== "CANCELLED",
    CONFLICT,
    "Assignment already processed",
  );

  const updated = await prisma.assignment.update({
    where: { id: assignmentId },
    data: { status },
  });

  if (status === "COMPLETED") {
    await prisma.job.update({
      where: { id: assignment.jobId },
      data: { isActive: false },
    });
  }

  const messages: Record<string, string> = {
    IN_PROGRESS: "Assignment marked as in progress",
    COMPLETED: "Assignment marked as completed",
    CANCELLED: "Assignment cancelled",
  };

  return { message: messages[status], data: updated };
};

export const rateAssignment = async (
  userId: string,
  assignmentId: string,
  rating: number,
  comment?: string,
) => {
  const employer = await requireEmployerProfile(userId);

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { job: true },
  });
  appAssert(assignment, NOT_FOUND, "Assignment not found");
  appAssert(
    assignment.job.employerId === employer.id,
    FORBIDDEN,
    "Not your assignment",
  );
  appAssert(
    assignment.status === "COMPLETED",
    CONFLICT,
    "Assignment must be completed before rating",
  );

  const existing = await prisma.rating.findUnique({
    where: { assignmentId },
  });
  appAssert(!existing, CONFLICT, "Assignment already rated");

  const created = await prisma.rating.create({
    data: {
      assignmentId,
      workerId: assignment.workerId,
      employerId: employer.id,
      rating,
      comment,
    },
  });

  return created;
};
