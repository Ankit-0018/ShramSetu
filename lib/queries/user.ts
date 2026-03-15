import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-client";
import { DATABASE } from "../constants/db";
import { UserData } from "../stores/useUserStore";

export const getUserProfile = async (uid: string): Promise<UserData | null> => {
  const snap = await getDoc(doc(db, DATABASE.USERS_COLLECTION, uid));

  if (!snap.exists()) return null;

  const data = snap.data();
  const worker = data.worker ?? {};

  return {
    uid: snap.id,
    fullName: data.name,
    role: data.role,
    phone: data.phone ?? null,
    email: data.email ?? null,

    memberSince: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,

    averageRating: worker.averageRating ?? null,
    ratingCount: data.ratingCount ?? 0,
    completedJobsCount: data.completedJobsCount ?? 0,

    totalEarnings: worker.totalEarnings ?? 0,
    dailyWage: worker.dailyWage ?? null,
    skills: worker.skills ?? null,
    workStatus: worker.status ?? null,

    location: data.location ?? null,
  };
};
