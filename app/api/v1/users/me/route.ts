import { NextRequest, NextResponse } from "next/server";
import { OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse } from "@/lib/server/authenticate";
import { getCurrentUser } from "@/lib/server/services/user.service";

export async function GET(req: NextRequest) {
  try {
    const { userId } = requireUserId(req);
    const user = await getCurrentUser(userId);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          role: user.role,
          isProfileCompleted: user.isProfileCompleted,
          workerProfile: user.workerProfile,
          employerProfile: user.employerProfile,
        },
      },
      { status: OK },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
