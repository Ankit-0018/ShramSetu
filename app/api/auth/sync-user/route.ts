import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
Update the readable routing cookies (user_role, profile_completed) after a
profile create/update call, without touching the tokens.
*/
export async function POST(req: NextRequest) {
  const { role, isProfileCompleted } = await req.json();

  const res = NextResponse.json({ success: true });

  if (role !== undefined) {
    res.cookies.set("user_role", role ? String(role).toLowerCase() : "none", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  if (isProfileCompleted !== undefined) {
    res.cookies.set("profile_completed", isProfileCompleted ? "true" : "false", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  return res;
}
