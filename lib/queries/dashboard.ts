import { getPaginatedJobs, getEmployerJobs } from "./jobs";
import { getMyApplications, getEmployerApplications } from "./applications";
import { getMyAssignedJobs, getEmployerAssignments } from "./assignments";
import type { WorkerDashboardData, EmployerDashboardData } from "../types";

// ─── Worker Dashboard ────────────────────────────────────────────

export async function getWorkerDashboard(): Promise<WorkerDashboardData> {
  const [jobsRes, applicationsRes, assignmentsRes] = await Promise.all([
    getPaginatedJobs(1, 10),
    getMyApplications(1, 10),
    getMyAssignedJobs(1, 10),
  ]);

  const nearbyJobs = jobsRes.jobs;
  const applications = applicationsRes.applications;
  const assignments = assignmentsRes.assignments;

  const closestJob = nearbyJobs.length
    ? nearbyJobs.reduce((min, j) => {
        const minDist = typeof min.distanceKm === "number" ? min.distanceKm : Infinity;
        const jDist = typeof j.distanceKm === "number" ? j.distanceKm : Infinity;
        return jDist < minDist ? j : min;
      })
    : null;

  const closestJobDistance =
    closestJob && typeof closestJob.distanceKm === "number"
      ? `${closestJob.distanceKm.toFixed(1)} km`
      : "N/A";

  const activeAssignments = assignments.filter((a) => a.status === "IN_PROGRESS");
  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED");

  return {
    nearbyJobs,
    nearbyJobsCount: nearbyJobs.length,
    closestJobDistance,
    applications,
    assignments,
    activeAssignments,
    completedAssignments,
    // TODO: backend doesn't return a wage/earnings amount on assignments today,
    // so there's no data source for computed earnings here. Left at 0.
    todayEarnings: 0,
  };
}

// ─── Employer Dashboard ──────────────────────────────────────────

export async function getEmployerDashboard(): Promise<EmployerDashboardData> {
  const [jobsRes, applicationsRes, assignmentsRes] = await Promise.all([
    getEmployerJobs(1, 50),
    getEmployerApplications(1, 50),
    getEmployerAssignments(1, 50),
  ]);

  const allJobs = jobsRes.jobs;
  const activeJobs = allJobs.filter((j) => j.isActive);
  const closedJobs = allJobs.filter((j) => !j.isActive);

  const allApplications = applicationsRes.applications;
  const pendingApplications = allApplications.filter((a) => a.status === "PENDING");

  const assignments = assignmentsRes.assignments;
  const activeAssignments = assignments.filter((a) => a.status === "IN_PROGRESS");
  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED");

  return {
    stats: {
      activeJobsCount: activeJobs.length,
      applicationsCount: pendingApplications.length,
      completedJobsCount: completedAssignments.length,
    },
    activeJobs,
    closedJobs,
    allJobs,
    allApplications,
    pendingApplications,
    assignments,
    activeAssignments,
    completedAssignments,
  };
}
