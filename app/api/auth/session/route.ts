import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin";


/*
create session with cookies for authenticated user
session contains session token , role and profile_completed
*/
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    // Verify ID token
    const decoded = await adminAuth.verifyIdToken(token);

    // Create Firebase session cookie
    const expiresIn = 60 * 60 * 1000; // 1 hour
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });

    const res = NextResponse.json({ success: true });

    // Session cookie
    res.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    // Role from custom claims
    const role = decoded.role || "none";

    res.cookies.set("user_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    // Fetch onboarding state from DB
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const profileCompleted = userDoc.data()?.profileCompleted ? "true" : "false";

    res.cookies.set("profile_completed", profileCompleted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;

  } catch (error) {
    console.error("Session creation failed:", error);

    return NextResponse.json(
      { error: "AUTH_FAILED" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });

  res.cookies.delete("session");
  res.cookies.delete("user_role");
  res.cookies.delete("profile_completed");

  return res;
}