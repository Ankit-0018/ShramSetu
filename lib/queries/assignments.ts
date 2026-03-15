import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-client";
import { DATABASE } from "../constants/db";

function formatAssignments(snapshot: any) {
  return snapshot.docs.map((doc: any) => {
    const data = doc.data();

    // Serialize any possible Firestore Timestamp
    return {
      id: doc.id,
      ...data,
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
      updatedAt:
        data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
      assignedAt:
        data.assignedAt?.toDate?.()?.toISOString() || data.assignedAt || null,
      completedAt:
        data.completedAt?.toDate?.()?.toISOString() || data.completedAt || null,
      disputedAt:
        data.disputedAt?.toDate?.()?.toISOString() || data.disputedAt || null,
    };
  });
}

function sortAssignments(assignments: any[]) {
  return assignments.sort((a, b) => {
    const dateA = a.assignedAt ? new Date(a.assignedAt).getTime() : 0;
    const dateB = b.assignedAt ? new Date(b.assignedAt).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Get all employer assignments
 */
export const getEmployerAssignments = async (employerId: string) => {
  const q = query(
    collection(db, DATABASE.JOBS_ASSIGNMENTS_COLLECTION),
    where("employerId", "==", employerId),
  );

  const snap = await getDocs(q);
  return sortAssignments(formatAssignments(snap));
};

/**
 * Get employer assignments filtered by status
 */
export const getEmployerAssignmentsByStatus = async (
  employerId: string,
  status: "pending" | "completed" | "disputed",
) => {
  const q = query(
    collection(db, DATABASE.JOBS_ASSIGNMENTS_COLLECTION),
    where("employerId", "==", employerId),
    where("status", "==", status),
  );

  const snap = await getDocs(q);
  return sortAssignments(formatAssignments(snap));
};

/**
 * Get worker assigned jobs
 */
export const getMyAssignedJobs = async (workerId: string) => {
  const q = query(
    collection(db, DATABASE.JOBS_ASSIGNMENTS_COLLECTION),
    where("workerId", "==", workerId),
  );

  const snap = await getDocs(q);
  return sortAssignments(formatAssignments(snap));
};

/**
 * Get worker assigned jobs filtered by status
 */
export const getMyAssignedJobsByStatus = async (
  workerId: string,
  status: "pending" | "completed" | "disputed",
) => {
  const q = query(
    collection(db, DATABASE.JOBS_ASSIGNMENTS_COLLECTION),
    where("workerId", "==", workerId),
    where("status", "==", status),
  );

  const snap = await getDocs(q);
  return sortAssignments(formatAssignments(snap));
};
