

export type AuthMode = "LOGIN" | "REGISTER";

export type EmployerDashboardStats = {
  activeJobsCount: number;
  applicationsCount: number;
  completedJobsCount: number;
};

export type Location = {
  lat: number;
  lng: number;
  address: string;
  geohash: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  skillsRequired: Array<string>;
  location: Location;
  wage: number;
  duration: string;
  employerId: any;
  status: "open" | "closed" | "assigned" | "completed" | "cancelled" | "deleted";
  createdAt?: string | any;
  updatedAt?: string | any;
  distance?: number;
};

export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: "pending" | "accepted" | "rejected";
  jobTitle?: string;
  createdAt?: string;
};

export type Assignment = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: "active" | "completed" | "disputed";
  wage?: number;
  jobTitle?: string;
  assignedAt?: string;
  completedAt?: string;
  disputeReason?: string;
  disputedAt?: string;
};

export type WorkerDashboardData = {
  nearbyJobs: Job[];
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
  activeJobs: Job[];
  closedJobs: Job[];
  allJobs: Job[];
  applicationsByJob: {
    jobId: string;
    jobTitle: string;
    applications: Application[];
  }[];
  allApplications: Application[];
  pendingApplications: Application[];
  assignments: Assignment[];
  activeAssignments: Assignment[];
  completedAssignments: Assignment[];
  disputedAssignments: Assignment[];
};

export type WorkingStatus = "available" | "busy" | "offline";