"use server"

import { adminDb } from "@/lib/firebase/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import { WorkingStatus } from "../types"

/**
 * Update worker availability
 */
export const updateWorkerAvailability = async (
  workerId: string,
  status: WorkingStatus
) => {
  await adminDb.collection("users").doc(workerId).update({
    "worker.availability": status,
    updatedAt: FieldValue.serverTimestamp(),
  })
}

/**
 * Get worker earnings within a date range
 */
export async function getEarningsInRange(
  workerId: string,
  startDate: Date,
  endDate: Date
) {
  if (startDate > endDate) {
    throw new Error("Invalid date range")
  }

  const snap = await adminDb
    .collection("jobs_assignments")
    .where("workerId", "==", workerId)
    .where("status", "==", "completed")
    .where("completedAt", ">=", startDate)
    .where("completedAt", "<=", endDate)
    .get()

  let total = 0

  snap.forEach((doc) => {
    const data = doc.data()
    total += data.wage ?? 0
  })

  return total
}