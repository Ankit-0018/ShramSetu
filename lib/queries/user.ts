import { apiFetch } from "@/lib/api/client";
import { UserData } from "../stores/useUserStore";

export const getUserProfile = async (): Promise<UserData | null> => {
  try {
    const { user } = await apiFetch<{ success: boolean; user: UserData }>(
      "/api/v1/users/me",
    );

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      role: user.role,
      isProfileCompleted: user.isProfileCompleted,
      workerProfile: user.workerProfile,
      employerProfile: user.employerProfile,
    };
  } catch {
    return null;
  }
};
