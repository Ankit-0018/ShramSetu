import { getJobsWithinRadius, getEmployerJobs } from "./jobs";
import { getMyApplications, getApplicationsForJob } from "./applications";
import { getMyAssignedJobs, getEmployerAssignments } from "./assignments";

// ─── Worker Dashboard ────────────────────────────────────────────

export async function getWorkerDashboard(
  workerId: string,
  lat: number,
  lng: number,
  city: string,
) {
  const [nearbyJobs, applications, assignments] = await Promise.all([
    getJobsWithinRadius(lat, lng, city, 3),
    getMyApplications(workerId),
    getMyAssignedJobs(workerId),
  ]);

  const closestJob = nearbyJobs.length
    ? nearbyJobs.reduce((min: any, j: any) => {
        const minDist =
          typeof min.distance === "number" ? min.distance : Infinity;
        const jDist = typeof j.distance === "number" ? j.distance : Infinity;
        return jDist < minDist ? j : min;
      })
    : null;

  const activeAssignments = assignments.filter(
    (a: any) => a.status === "active",
  );
  const completedAssignments = assignments.filter(
    (a: any) => a.status === "completed",
  );

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayEarnings = completedAssignments
    .filter((a: any) => {
      const d = new Date(a.completedAt || a.updatedAt || a.assignedAt || 0);
      return d >= todayStart;
    })
    .reduce((sum: number, a: any) => sum + Number(a.wage || 0), 0);

  // Format closest job distance with proper validation
  let closestJobDistance = "N/A";
  if (
    closestJob &&
    typeof closestJob.distance === "number" &&
    closestJob.distance !== undefined
  ) {
    closestJobDistance = `${closestJob.distance.toFixed(1)} km`;
  }

  return {
    nearbyJobs,
    nearbyJobsCount: nearbyJobs.length,
    closestJobDistance,
    applications,
    assignments,
    activeAssignments,
    completedAssignments,
    todayEarnings,
  };
}

// ─── Employer Dashboard ──────────────────────────────────────────

export async function getEmployerDashboard(employerId: string) {
  const [jobs, assignments] = await Promise.all([
    getEmployerJobs(employerId),
    getEmployerAssignments(employerId),
  ]);

  const activeJobs = jobs.filter((j) => j.status === "open");
  const closedJobs = jobs.filter((j) => j.status !== "open");

  // Gather applications for all active jobs in parallel
  const applicationsByJob = await Promise.all(
    activeJobs.map(async (job) => ({
      jobId: job.id,
      jobTitle: job.title,
      applications: await getApplicationsForJob(job.id),
    })),
  );

  const allApplications = applicationsByJob.flatMap((b) =>
    b.applications.map((a: any) => ({ ...a, jobTitle: b.jobTitle })),
  );

  const pendingApplications = allApplications.filter(
    (a: any) => a.status === "pending",
  );

  const activeAssignments = assignments.filter(
    (a: any) => a.status === "active",
  );
  const completedAssignments = assignments.filter(
    (a: any) => a.status === "completed",
  );
  const disputedAssignments = assignments.filter(
    (a: any) => a.status === "disputed",
  );

  return {
    stats: {
      activeJobsCount: activeJobs.length,
      applicationsCount: pendingApplications.length,
      completedJobsCount: completedAssignments.length,
    },
    activeJobs,
    closedJobs,
    allJobs: jobs,
    applicationsByJob,
    allApplications,
    pendingApplications,
    assignments,
    activeAssignments,
    completedAssignments,
    disputedAssignments,
  };
}
