import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import {
  createEmployerProfile,
  createWorkerProfile,
  updateProfile,
} from "@/lib/server/services/user.service";

const workerProfileSchema = z.object({
  role: z.literal("WORKER"),
  profileImage: z.string().optional(),
  age: z.number().int().positive().optional(),
  skills: z.array(z.string()).min(1),
  canRelocate: z.boolean().optional(),
  dailyWage: z.number().positive(),
});

const employerProfileSchema = z.object({
  role: z.literal("EMPLOYER"),
  profileImage: z.string().optional(),
  age: z.number().int().positive().optional(),
  type: z.enum(["INDIVIDUAL", "BUSINESS"]).optional(),
  businessName: z.string().optional(),
  gst: z.string().optional(),
});

const completeProfileSchema = z.discriminatedUnion("role", [
  workerProfileSchema,
  employerProfileSchema,
]);

export async function POST(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const body = await req.json();
    const parsed = completeProfileSchema.parse(body);

    const data =
      parsed.role === "WORKER"
        ? await createWorkerProfile({ userId, ...parsed })
        : await createEmployerProfile({ userId, ...parsed });

    return NextResponse.json({ success: true, data }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}

const updateProfileSchema = z.object({
  fullName: z.string().min(1).optional(),
  profilePhotoUrl: z.string().optional(),
  minimumWage: z.number().positive().optional(),
  canRelocate: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
  businessName: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const body = await req.json();
    const parsed = updateProfileSchema.parse(body);

    const { user, worker, employer } = await updateProfile({
      userId,
      ...parsed,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: user!.id,
            fullName: user!.fullName,
            phoneNumber: user!.phoneNumber,
            role: user!.role,
          },
          ...(worker && { worker }),
          ...(employer && { employer }),
        },
      },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
