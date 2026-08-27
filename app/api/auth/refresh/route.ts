import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshUserAccessToken } from "@/lib/server/services/auth.service";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const { accessToken, newRefreshToken } =
      await refreshUserAccessToken(refreshToken);

    const res = NextResponse.json({ success: true, accessToken });

    res.cookies.set("access_token", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    if (newRefreshToken) {
      res.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return res;
  } catch (error) {
    console.error("Refresh failed:", error);
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
