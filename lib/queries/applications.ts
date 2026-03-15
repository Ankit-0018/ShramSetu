import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-client";
import { DATABASE } from "../constants/db";

function formatApplications(snapshot: any) {
  return snapshot.docs.map((doc: any) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
      updatedAt:
        data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
    };
  });
}

function sortApplications(applications: any[]) {
  return applications.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Get all applications for a specific job (employer view)
 */
export const getApplicationsForJob = async (jobId: string) => {
  const q = query(
    collection(db, DATABASE.JOBS_APPLICATIONS_COLLECTION),
    where("jobId", "==", jobId),
  );

  const snap = await getDocs(q);
  return sortApplications(formatApplications(snap));
};

/**
 * Get all applications submitted by a worker
 */
export const getMyApplications = async (workerId: string) => {
  const q = query(
    collection(db, DATABASE.JOBS_APPLICATIONS_COLLECTION),
    where("workerId", "==", workerId),
  );

  const snap = await getDocs(q);
  return sortApplications(formatApplications(snap));
};

/**
 * Get worker applications filtered by status
 */
export const getMyApplicationsByStatus = async (
  workerId: string,
  status: "pending" | "accepted" | "rejected",
) => {
  const q = query(
    collection(db, DATABASE.JOBS_APPLICATIONS_COLLECTION),
    where("workerId", "==", workerId),
    where("status", "==", status),
  );

  const snap = await getDocs(q);
  return sortApplications(formatApplications(snap));
};
