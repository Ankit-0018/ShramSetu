import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { SendOtp } from "@/lib/server/services/auth.service";
import verificationCodeType from "@/lib/server/verificationCode";
import { OK } from "@/lib/server/http";
import { toErrorResponse } from "@/lib/server/authenticate";

const typeSchema = z.enum([
  verificationCodeType.Register,
  verificationCodeType.Login,
]);

const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, "Invalid mobile number format")
    .nonoptional(),
});

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsedType = typeSchema.parse(
      String(url.searchParams.get("type")).toUpperCase(),
    );

    const schema =
      parsedType === verificationCodeType.Register
        ? sendOtpSchema.extend({
            fullName: z
              .string({ error: "FullName is Invalid" })
              .min(3, "Name is too short"),
          })
        : sendOtpSchema;

    const body = await req.json();
    const parsedResult = schema.parse(body);

    const fullName =
      "fullName" in parsedResult && typeof parsedResult.fullName === "string"
        ? parsedResult.fullName
        : undefined;

    const result = await SendOtp({
      phone: parsedResult.phone,
      ...(fullName && { fullName }),
      type: parsedType,
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        verificationId: result.verificationId,
      },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
