export type JobFilters = {
  page?: number;
  limit?: number;
};

export type JobType = "FULL_TIME" | "PART_TIME" | "ONE_TIME";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type AssignmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type JobEmployerSummary = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  jobsPosted: number;
  rating: number | null;
  reviewCount: number;
};

export type NearbyJob = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  minimumWage: number;
  primarySkill: string;
  jobType: JobType;
  createdAt: string;
  distanceKm: number | null;
  location: { formattedAddress: string | null };
  employer: JobEmployerSummary;
};

export type JobDetail = {
  id: string;
  title: string;
  description: string | null;
  imageUrls: string[];
  minimumWage: number;
  primarySkill: string;
  jobType: JobType;
  isActive: boolean;
  createdAt: string;
  location: {
    formattedAddress: string | null;
    latitude: number;
    longitude: number;
  };
  employer: {
    id: string;
    businessName: string | null;
    employerType: "INDIVIDUAL" | "BUSINESS";
    profilePhotoUrl: string | null;
    user: { fullName: string };
  };
  distanceKm: number | null;
};

export type EmployerJob = {
  id: string;
  title: string;
  minimumWage: number;
  primarySkill: string;
  jobType: JobType;
  isActive: boolean;
  createdAt: string;
  location: { formattedAddress: string | null; cityId: string | null };
};

export type Application = {
  id: string;
  jobId?: string;
  workerId?: string;
  status: ApplicationStatus;
  createdAt: string;
  job?: { id: string; title: string; location: { formattedAddress: string | null } };
  worker?: {
    id: string;
    profilePhotoUrl?: string | null;
    skills?: string[];
    user: { fullName: string; phoneNumber?: string };
  };
};

export type Assignment = {
  id: string;
  jobId?: string;
  workerId?: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt?: string;
  job?: { id: string; title: string; location: { formattedAddress: string | null } };
  worker?: { id: string; user: { fullName: string; phoneNumber?: string } };
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
