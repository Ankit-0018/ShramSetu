import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/server/jwt";
import prisma from "@/lib/server/prisma";
import { UNAUTHORIZED, OK } from "@/lib/server/http";
import { toErrorResponse, HttpError } from "@/lib/server/authenticate";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      throw new HttpError(UNAUTHORIZED, "Authorization token is required");
    }

    const { payload } = verifyToken(token);

    if (payload) {
      await prisma.session.delete({ where: { id: payload.sessionId } });
    }

    return NextResponse.json({ message: "Logout successfull" }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
