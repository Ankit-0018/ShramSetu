import { auth } from "@/lib/firebase/firebase-client";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export async function sendPhoneOTP(
  phone: string,
  recaptcha: any,
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phone, recaptcha);
}
