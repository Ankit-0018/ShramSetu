import { NextRequest, NextResponse } from "next/server";
import { refreshUserAccessToken } from "@/lib/server/services/auth.service";
import { UNAUTHORIZED, OK } from "@/lib/server/http";
import { toErrorResponse, HttpError } from "@/lib/server/authenticate";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpError(UNAUTHORIZED, "Refresh token missing");
    }

    const refreshToken = authHeader.slice("Bearer ".length);
    const { accessToken, newRefreshToken } =
      await refreshUserAccessToken(refreshToken);

    return NextResponse.json(
      { accessToken, refreshToken: newRefreshToken },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
