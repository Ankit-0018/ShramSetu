import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shramsetu.work";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const backendRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "GET",
      headers: { Authorization: `Bearer ${refreshToken}` },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const { accessToken, refreshToken: newRefreshToken } = await backendRes.json();

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
