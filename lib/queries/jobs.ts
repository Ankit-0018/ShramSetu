import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  doc,
  getDoc,
  updateDoc,
  deleteField,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../firebase/firebase-client";
import { Job } from "../types";
import { distanceBetween, geohashQueryBounds } from "geofire-common";
import { DATABASE } from "../constants/db";
import { JobFilters } from "../types/job";



function formatJob(docSnap: any): Job {
  const data = docSnap.data();

  const location = data.location
    ? {
        ...data.location,
        lat: data.location.lat || data.location._lat || 0,
        lng: data.location.lng || data.location._long || 0,
      }
    : null;

  return {
    id: docSnap.id,
    ...data,
    location,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
    updatedAt:
      data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
    deletedAt:
      data.deletedAt?.toDate?.()?.toISOString() || data.deletedAt || null,
  } as Job;
}

export async function getPaginatedJobs(
  pageSize: number = 10,
  lastVisibleId?: string,
  filters?: JobFilters
) {
  try {

    const constraints: any[] = [
      where("status", "==", "open")
    ];

    // filters
    if (filters?.advancePay) {
      constraints.push(where("advancePay", "==", true));
    }

    if (filters?.skill) {
      constraints.push(where("skillsRequired", "array-contains", filters.skill));
    }

    if (filters?.city) {
      constraints.push(where("location.city", "==", filters.city));
    }

    if (filters?.minWage) {
      constraints.push(where("wage", ">=", filters.minWage));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(pageSize));

    let q = query(
      collection(db, DATABASE.JOBS_COLLECTION),
      ...constraints
    );

    if (lastVisibleId) {
      const lastDocSnap = await getDoc(
        doc(db, DATABASE.JOBS_COLLECTION, lastVisibleId)
      );

      if (lastDocSnap.exists()) {
        q = query(
          collection(db, DATABASE.JOBS_COLLECTION),
          ...constraints,
          startAfter(lastDocSnap)
        );
      }
    }

    const snap = await getDocs(q);

    const jobs = snap.docs.map(formatJob);

    return {
      jobs,
      lastVisibleId: snap.docs.length
        ? snap.docs[snap.docs.length - 1].id
        : null,
      hasMore: snap.docs.length === pageSize,
    };

  } catch (error) {
    console.error("Error fetching paginated jobs:", error);
    return { jobs: [], lastVisibleId: null, hasMore: false };
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    const docSnap = await getDoc(doc(db, DATABASE.JOBS_COLLECTION, id));

    if (!docSnap.exists()) return null;

    return formatJob(docSnap);
  } catch (error) {
    console.error("Error fetching job by id:", error);
    return null;
  }
}

export const getEmployerJobs = async (employerId: string) => {
  const q = query(
    collection(db, DATABASE.JOBS_COLLECTION),
    where("employerId", "==", employerId),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map(formatJob);
};

export const getEmployerJobsByStatus = async (
  employerId: string,
  status: "open" | "closed",
) => {
  const q = query(
    collection(db, DATABASE.JOBS_COLLECTION),
    where("employerId", "==", employerId),
    where("status", "==", status),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map(formatJob);
};

export async function clearLocation(userId: string) {
  const ref = doc(db, DATABASE.USERS_COLLECTION, userId);

  await updateDoc(ref, {
    location: deleteField(),
  });
}

export const getOpenJobs = async () => {
  const q = query(
    collection(db, DATABASE.JOBS_COLLECTION),
    where("status", "==", "open"),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map(formatJob);
};

export async function getJobsWithinRadius(
  workerLat: number,
  workerLng: number,
  city: string,
  radiusInKm: number = 3,
) {
  const bounds = geohashQueryBounds([workerLat, workerLng], radiusInKm * 1000);
  const promises = bounds.map((b) => {
    const q = query(
      collection(db, DATABASE.JOBS_COLLECTION),
      where("status", "==", "open"),
      where("location.city", "==", city),
      orderBy("location.geohash"),
      startAt(b[0]),
      endAt(b[1]),
    );

    return getDocs(q);
  });

  const snapshots = await Promise.all(promises);

  const matchingJobs: Job[] = [];
  const seen = new Set();

  snapshots.forEach((snap) => {
    snap.docs.forEach((docSnap) => {
      const job = docSnap.data();

      if (seen.has(docSnap.id)) return;

      const jobLat = job.location.lat;
      const jobLng = job.location.lng;

      const distanceInKm = distanceBetween(
        [workerLat, workerLng],
        [jobLat, jobLng],
      );

      if (distanceInKm <= radiusInKm) {
        seen.add(docSnap.id);
        matchingJobs.push({
          ...formatJob(docSnap),
          distance: distanceInKm,
        } as any);
      }
    });
  });

  return matchingJobs;
}
