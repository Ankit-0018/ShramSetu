import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-client";
import { DATABASE } from "../constants/db";

export const getEmployerProfile = async (employerId: string) => {
  const snap = await getDoc(doc(db, DATABASE.USERS_COLLECTION, employerId));

  if (!snap.exists()) throw new Error("Employer not found");

  return {
    id: snap.id,
    ...snap.data(),
  };
};
