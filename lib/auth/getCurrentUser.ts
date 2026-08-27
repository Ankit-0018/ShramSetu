import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Server-side helper — reads the access_token cookie and fetches the
 * current user from the backend. Returns null if not logged in or the
 * token is invalid/expired.
 */
export async function getCurrentUser() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return null;

    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const { user } = await res.json();
    return user;
  } catch (error) {
    console.error("getCurrentUser failed:", error);
    return null;
  }
}
