import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-client";

export const getWorkerProfile = async (workerId: string) => {
  const snap = await getDoc(doc(db, "users", workerId));

  if (!snap.exists()) throw new Error("Worker not found");

  return {
    id: snap.id,
    ...snap.data(),
  };
};

export const updateWorkerLocation = async (
  workerId: string,
  lat: number,
  lng: number,
) => {
  await updateDoc(doc(db, "users", workerId), {
    location: {
      lat,
      lng,
    },
    updatedAt: serverTimestamp(),
  });
};
