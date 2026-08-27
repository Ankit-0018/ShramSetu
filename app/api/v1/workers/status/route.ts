import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { updateWorkerLocation } from "@/lib/server/services/worker.service";

const statusSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const body = await req.json();
    const { latitude, longitude } = statusSchema.parse(body);

    const result = await updateWorkerLocation(userId, latitude, longitude);

    return NextResponse.json(result, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
