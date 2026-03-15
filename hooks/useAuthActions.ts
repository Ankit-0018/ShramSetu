import { useState } from "react";
import { ConfirmationResult, User } from "firebase/auth";
import { generateRecaptcha } from "@/lib/firebase/firebase-client";
import { extractMobile } from "@/lib/utils";
import { setSession } from "@/lib/utils/auth/session";
import { sendPhoneOTP } from "../services/authService";
import { getUser, createUser } from "../services/userService";
import { validateName } from "../lib/utils/validation";
import { AuthMode } from "@/lib/types";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type OTPResult = {
  success: boolean;
  user?: User;
  error?: any;
};

export type FormError = {
  nameErr?: string;
  mobileErr?: string;
};

export function useAuthActions(mode: AuthMode) {
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const {setLoading,loading} = useUserStore()
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

    // Validate name for register
    if (mode === "REGISTER") {
      const err = validateName(name);
      if (err) {
        setFormError((prev) => ({ ...prev, nameErr: err }));
        return { success: false };
      }
    }

    // Validate mobile
    const clean = extractMobile(mobile, setFormError);
    if (!clean) {
      return { success: false };
    }

    // Create recaptcha
    const recaptcha = await generateRecaptcha();
    if (!recaptcha) {
      throw new Error("Recaptcha not ready");
    }

    // Send OTP
    const result = await sendPhoneOTP("+91" + clean, recaptcha);

    setConfirmationResult(result);

    return { success: true };
  } catch (error) {
    console.error("OTP send error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send OTP",
    };
  } finally {
    setLoading(false);
  }
};

  const verifyOtp = async (): Promise<OTPResult> => {
  if (!confirmationResult) {
    return { success: false, error: "No OTP session" };
  }

  try {
    setLoading(true);

    const result = await confirmationResult.confirm(formData.otp);

    if (!result.user) {
      setLoading(false);
      return { success: false };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    setLoading(false);
    return { success: false, error };
  }
};

  const completeAuth = async (user: User) => {
    const userSnap = await getUser(user.uid);

    const token = await user.getIdToken();

    if (mode === "REGISTER") {
      if (userSnap.exists()) {
        return { redirect: "/auth?mode=login" };
      }

      await createUser(user.uid, {
        name: formData.name,
        phone: user.phoneNumber,
        role: null,
        profileCompleted: false,
        createdAt: new Date(),
      });

      await setSession(token);

      return { redirect: "/choose-role" };
    }

    if (mode === "LOGIN") {
      if (!userSnap.exists()) {
        return { redirect: "/auth?mode=register" };
      }

      const role = userSnap.data()?.role ?? null;

      await setSession(token);

      if (role && role !== "null") {
        return { redirect: `/${role}/home` };
      }

      return { redirect: "/choose-role" };
    }
  };
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();

  if (!confirmationResult) {
    await sendOTP();
    return;
  }

  const res = await verifyOtp();

  if (!res.success || !res.user) {
    alert("OTP verification failed");
    return;
  }

  const result = await completeAuth(res.user);

  if (result?.redirect) {
    startTransition(() => {
      router.replace(result.redirect);
    });
  }
};

return {
  handleSubmit,
  sendOTP,
  verifyOtp,
  handleInputChange,
  confirmationResult,
  loading,
  isPending,
  formData,
  formError,
};
}
