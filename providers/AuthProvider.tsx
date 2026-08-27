"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore, type UserData } from "@/lib/stores/useUserStore";
import { apiFetch, ApiError } from "@/lib/api/client";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading, clearUser } = useUserStore();

  useEffect(() => {
    let cancelled = false;

    const hasSession = document.cookie
      .split("; ")
      .some((row) => row.startsWith("access_token=") || row.startsWith("refresh_token="));

    if (!hasSession) {
      clearUser();
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { user } = await apiFetch<{ success: boolean; user: UserData }>(
          "/api/v1/users/me",
        );

        if (cancelled) return;

        setUser({
          id: user.id,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          role: user.role,
          isProfileCompleted: user.isProfileCompleted,
          workerProfile: user.workerProfile,
          employerProfile: user.employerProfile,
        });
      } catch (err) {
        if (!(err instanceof ApiError)) {
          console.error("Auth initialization failed:", err);
        }
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser, setLoading, clearUser]);

  return <>{children}</>;
}
