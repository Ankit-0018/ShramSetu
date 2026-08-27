import type {
  Application,
  Assignment,
  EmployerJob,
  NearbyJob,
} from "./job";

export type AuthMode = "LOGIN" | "REGISTER";

export type EmployerDashboardStats = {
  activeJobsCount: number;
  applicationsCount: number;
  completedJobsCount: number;
};

export type WorkerDashboardData = {
  nearbyJobs: NearbyJob[];
  nearbyJobsCount: number;
  closestJobDistance: string;
  applications: Application[];
  assignments: Assignment[];
  activeAssignments: Assignment[];
  completedAssignments: Assignment[];
  todayEarnings: number;
};

export type EmployerDashboardData = {
  stats: EmployerDashboardStats;
  activeJobs: EmployerJob[];
  closedJobs: EmployerJob[];
  allJobs: EmployerJob[];
  allApplications: Application[];
  pendingApplications: Application[];
  assignments: Assignment[];
  activeAssignments: Assignment[];
  completedAssignments: Assignment[];
};

export type WorkingStatus = "available" | "busy" | "offline";
