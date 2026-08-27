import "server-only";
import { cookies } from "next/headers";
import { verifyToken, type AccessTokenPayload } from "@/lib/server/jwt";
import { getCurrentUser as getCurrentUserService } from "@/lib/server/services/user.service";

/**
 * Server-side helper — reads the access_token cookie, verifies it, and
 * fetches the current user directly (in-process, no HTTP hop). Returns
 * null if not logged in or the token is invalid/expired.
 */
export async function getCurrentUser() {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return null;

    const { payload } = verifyToken<AccessTokenPayload>(token);
    if (!payload) return null;

    return await getCurrentUserService(payload.userId);
  } catch (error) {
    console.error("getCurrentUser failed:", error);
    return null;
  }
}
