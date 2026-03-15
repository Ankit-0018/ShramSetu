import { db } from "@/lib/firebase/firebase-client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getUser(uid: string) {
  const ref = doc(db, "users", uid);
  return getDoc(ref);
}

export async function createUser(uid: string, data: any) {
  const ref = doc(db, "users", uid);
  return setDoc(ref, data);
}
