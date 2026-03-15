import { FormError } from "@/hooks/useAuthActions";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//extract mobile number
export const extractMobile = (
  input: string,
  setFormError: React.Dispatch<React.SetStateAction<FormError>>
): string | null => {
  setFormError({});

  let m = input.trim().replace(/\D/g, "");

  if (!m) {
    setFormError(prev => ({ ...prev, mobileErr: "Required" }));
    return null;
  }

  if (m.startsWith("91")) m = m.slice(2);
  if (m.startsWith("0")) m = m.slice(1);

  if (m.length !== 10) {
    setFormError(prev => ({ ...prev, mobileErr: "Must be 10 digits" }));
    return null;
  }

  if (!/^[6-9]\d{9}$/.test(m)) {
    setFormError(prev => ({ ...prev, mobileErr: "Invalid number" }));
    return null;
  }

  return m;
};