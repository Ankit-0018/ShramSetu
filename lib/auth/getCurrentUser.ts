import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin";
import { serializeFirestore } from "../utils/firebase/serializeFirestore";


export async function getCurrentUser() {
  
 /*
 check session and redirect and if session is there get the user document from the db
 */  

  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const decoded = await adminAuth.verifySessionCookie(session, true);

  const uid = decoded.uid;

  const doc = await adminDb.collection("users").doc(uid).get();
  const data = serializeFirestore(doc.data());
  return {
    uid,
    ...doc.data(),
  };
}