import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("access_token")?.value ||
    request.cookies.get("refresh_token")?.value;
  const userRoleCookie = request.cookies.get("user_role")?.value;
  const profileCompleted = request.cookies.get("profile_completed")?.value === "true";

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");

  // 1. Not logged in
  if (!sessionCookie) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/auth?mode=login", request.url));
    }
    return NextResponse.next();
  }

  // 2. Logged in and hitting Auth page -> Bounce away
  if (isAuthPage) {
    if (userRoleCookie === "worker") {
      return NextResponse.redirect(new URL("/worker/home", request.url));
    } else if (userRoleCookie === "employer") {
      return NextResponse.redirect(new URL("/employer/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/choose-role", request.url));
    }
  }

  // 3. Logged in, but no role selected yet
  if (!userRoleCookie || userRoleCookie === "none" || userRoleCookie === "null") {
    if (
      !pathname.startsWith("/choose-role") &&
      !pathname.startsWith("/choose-skills") &&
      !pathname.startsWith("/choose-business")
    ) {
      return NextResponse.redirect(new URL("/choose-role", request.url));
    }
    return NextResponse.next();
  }

  // 4. Worker Role
  if (userRoleCookie === "worker") {
    // Force worker to complete profile (choose skills)
    if (!profileCompleted) {
      if (!pathname.startsWith("/choose-skills")) {
        return NextResponse.redirect(new URL("/choose-skills", request.url));
      }
      return NextResponse.next();
    }

    // Fully setup worker -> Block employer and setup routes
    if (
      pathname.startsWith("/employer") ||
      pathname.startsWith("/choose-role") ||
      pathname.startsWith("/choose-skills") ||
      pathname.startsWith("/choose-business")
    ) {
      return NextResponse.redirect(new URL("/worker/home", request.url));
    }
  }

  // 5. Employer Role
  if (userRoleCookie === "employer") {
    // Force employer to complete profile (choose business)
    if (!profileCompleted) {
      if (!pathname.startsWith("/choose-business")) {
        return NextResponse.redirect(new URL("/choose-business", request.url));
      }
      return NextResponse.next();
    }

    // Block worker and setup routes
    if (
      pathname.startsWith("/worker") ||
      pathname.startsWith("/choose-role") ||
      pathname.startsWith("/choose-skills") ||
      pathname.startsWith("/choose-business")
    ) {
      return NextResponse.redirect(new URL("/employer/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/worker/:path*",
    "/employer/:path*",
    "/choose-role",
    "/choose-skills",
    "/choose-business",
    "/auth",
  ],
};
