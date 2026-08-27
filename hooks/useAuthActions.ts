import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { extractMobile } from "@/lib/utils";
import { validateName } from "@/lib/utils/validation";
import { AuthMode } from "@/lib/types";
import { useUserStore, type UserData } from "@/lib/stores/useUserStore";
import { apiFetch, ApiError } from "@/lib/api/client";

type OTPResult = {
  success: boolean;
  error?: string;
};

export type FormError = {
  nameErr?: string;
  mobileErr?: string;
  otpErr?: string;
};

export function useAuthActions(mode: AuthMode) {
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const { setLoading, loading } = useUserStore();
  const setUser = useUserStore((s) => s.setUser);
  const [formError, setFormError] = useState<FormError>({});
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    otp: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sendOTP = async (): Promise<OTPResult> => {
    const { name, mobile } = formData;

    try {
      setLoading(true);

      if (mode === "REGISTER") {
        const err = validateName(name);
        if (err) {
          setFormError((prev) => ({ ...prev, nameErr: err }));
          return { success: false };
        }
      }

      const clean = extractMobile(mobile, setFormError);
      if (!clean) {
        return { success: false };
      }

      const result = await apiFetch<{ verificationId: string }>(
        `/auth/otp/send?type=${mode}`,
        {
          method: "POST",
          skipAuth: true,
          body:
            mode === "REGISTER"
              ? { phone: clean, fullName: name.trim() }
              : { phone: clean },
        },
      );

      setVerificationId(result.verificationId);

      return { success: true };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Could not reach the server. Please try again.";
      setFormError((prev) => ({ ...prev, mobileErr: message }));
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (): Promise<OTPResult> => {
    if (!verificationId) {
      return { success: false, error: "No OTP session" };
    }

    try {
      setLoading(true);

      const result = await apiFetch<{
        user: UserData;
        accessToken: string;
        refreshToken: string;
      }>("/auth/otp/verify", {
        method: "POST",
        skipAuth: true,
        body: {
          verificationId,
          verificationCode: formData.otp,
        },
      });

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      setUser({
        id: result.user.id,
        phoneNumber: result.user.phoneNumber,
        fullName: result.user.fullName,
        role: result.user.role,
        isProfileCompleted: result.user.isProfileCompleted,
        workerProfile: result.user.workerProfile ?? null,
        employerProfile: result.user.employerProfile ?? null,
      });

      return { success: true };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "OTP verification failed";
      setFormError((prev) => ({ ...prev, otpErr: message }));
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!verificationId) {
      await sendOTP();
      return;
    }

    const res = await verifyOtp();

    if (!res.success) {
      return;
    }

    startTransition(() => {
      router.replace("/");
      router.refresh();
    });
  };

  return {
    handleSubmit,
    sendOTP,
    verifyOtp,
    handleInputChange,
    confirmationResult: verificationId,
    loading,
    isPending,
    formData,
    formError,
  };
}
