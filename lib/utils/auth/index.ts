"use server";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-client";
import { adminDb, adminAuth } from "../../firebase/firebase-admin";
import { cookies } from "next/headers";
import { serializeFirestore } from "@/lib/utils/firebase/serializeFirestore";

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}

export async function getUserRole(uid: string) {
  const doc = await adminDb.collection("users").doc(uid).get();

  if (!doc.exists) return null;

  return doc.data()?.role ?? null;
}

export async function verifySession(token: string) {
  try {
    if (!token) return null;

    const decodedToken = await adminAuth.verifyIdToken(token);

    // decodedToken contains:
    // uid, email, phone_number, exp, etc.
    return decodedToken;
  } catch (error) {
    // Token expired or invalid - suppress verbose logging
    // Error will be handled by middleware
    return null;
  }
}

export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const decoded = await verifySession(session);
  if (!decoded) return null;

  const uid = decoded.uid;

  const doc = await adminDb.collection("users").doc(uid).get();
  if (!doc.exists) return null;

  const userData = serializeFirestore(doc.data());

  return {
    uid,
    role: decoded.role,
    ...userData,
  };
}
