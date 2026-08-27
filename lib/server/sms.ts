import "server-only";
import { BULKBLASTER_API_KEY, BULKBLASTER_SEND_OTP_URL } from "./env";

export type SendSmsOtpParams = {
  phone: string;
  otp: string;
  type: "REGISTER" | "LOGIN" | "PASSWORD_RESET";
};

const senderTypeForVerification = (
  type: "REGISTER" | "LOGIN" | "PASSWORD_RESET",
) => {
  if (type === "REGISTER") return "FYDBZR";
  if (type === "PASSWORD_RESET") return "GUERAR";
  return "DASSAM";
};

/**
 * Sends the OTP SMS via Bulk Blaster. Throws on failure — caller decides
 * whether that should fail the request or just get logged.
 */
export async function sendSmsOtp({ phone, otp, type }: SendSmsOtpParams) {
  const res = await fetch(BULKBLASTER_SEND_OTP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: BULKBLASTER_API_KEY,
      phone,
      otp,
      brandName: "ShramSetu",
      senderType: senderTypeForVerification(type),
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || "Failed to send OTP SMS");
  }

  return data;
}
