import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
Create local cookies from backend-issued tokens + user after OTP verify.
- access_token: short-lived (15min), readable by client JS (client calls
  the backend directly with it).
- refresh_token: httpOnly, only used server-side by /api/auth/refresh.
- user_role / profile_completed: readable, used by proxy.ts for routing.
*/
export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken, user } = await req.json();

    if (!accessToken || !refreshToken || !user) {
      return NextResponse.json({ error: "Missing session data" }, { status: 400 });
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set("access_token", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    res.cookies.set("user_role", user.role ? String(user.role).toLowerCase() : "none", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    res.cookies.set("profile_completed", user.isProfileCompleted ? "true" : "false", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error("Session creation failed:", error);
    return NextResponse.json({ error: "AUTH_FAILED" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });

  res.cookies.delete("access_token");
  res.cookies.delete("refresh_token");
  res.cookies.delete("user_role");
  res.cookies.delete("profile_completed");

  return res;
}
