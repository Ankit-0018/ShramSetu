import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { verifyOtp } from "@/lib/server/services/auth.service";
import { CREATED, OK } from "@/lib/server/http";
import { toErrorResponse } from "@/lib/server/authenticate";

const verifyOtpSchema = z.object({
  verificationId: z.string().min(1, "Verification Id is required"),
  verificationCode: z.string().length(6, "OTP must be 6 digits"),
  userAgent: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedResult = verifyOtpSchema.parse({
      ...body,
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    const result = await verifyOtp({
      verificationId: parsedResult.verificationId,
      userAgent: parsedResult.userAgent,
      verificationCode: parsedResult.verificationCode,
    });

    const { user, accessToken, refreshToken, message, type } = result;

    return NextResponse.json(
      { user, accessToken, refreshToken, message },
      { status: type === "LOGIN" ? OK : CREATED },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
