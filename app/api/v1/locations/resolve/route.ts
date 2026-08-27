import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { reverseGeocode } from "@/lib/server/geocode";

const resolveSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    requireUserId(req);
    const body = await req.json();
    const { latitude, longitude } = resolveSchema.parse(body);

    const resolved = await reverseGeocode(latitude, longitude);

    return NextResponse.json({ success: true, data: resolved }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
