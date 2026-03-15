import { AuthMode } from "@/lib/types";
import { CustomOTPInput } from "../_shared/otp-input";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useEffect } from "react";
import Spinner from "../_shared/spinner";

type Props = {
  mode: AuthMode;
};

export default function AuthForm({
  mode,
}: Props) {
  const {formData, formError, handleSubmit, handleInputChange, confirmationResult, loading, isPending } = useAuthActions(mode);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div id="recaptcha-container" className="mt-4"></div>
      {mode === "REGISTER" && !confirmationResult && (
        <div className="relative space-y-2">
          <label className="block text-sm font-medium text-black">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g. John Smith"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl"
            required
          />
          {formError?.nameErr && <p className="text-xs text-red-500">{formError.nameErr}</p>}
        </div>
      )}

      {!confirmationResult && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-black">
            Mobile Number
          </label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            placeholder="+91 xxxxxxxxxx"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl"
            required
          />
          {formError?.mobileErr && <p className="text-xs text-red-500">{formError.mobileErr}</p>}
        </div>
      )}

      {confirmationResult && (
        <CustomOTPInput value={formData.otp} onChange={handleInputChange} maxLength={6} />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-50"
      >
        {loading || isPending
          ? <Spinner fullscreen={false} />
          : confirmationResult
            ? "Verify OTP"
            : "Send OTP"}
      </button>
    </form>
  );
}
