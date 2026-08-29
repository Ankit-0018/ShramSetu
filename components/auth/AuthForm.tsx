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
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === "REGISTER" && !confirmationResult && (
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-foreground">
            Full name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g. John Smith"
            className="h-12 w-full rounded-xl bg-secondary px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            required
          />
          {formError?.nameErr && <p className="text-xs text-destructive">{formError.nameErr}</p>}
        </div>
      )}

      {!confirmationResult && (
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-foreground">
            Mobile number
          </label>
          <div className="flex h-12 items-stretch overflow-hidden rounded-xl bg-secondary focus-within:ring-2 focus-within:ring-ring/50">
            <span className="flex items-center border-r border-border/70 px-3 text-base font-medium text-muted-foreground">
              +91
            </span>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="98XXXXXXXX"
              className="h-full w-full bg-transparent px-4 text-base outline-none"
              required
            />
          </div>
          {formError?.mobileErr && <p className="text-xs text-destructive">{formError.mobileErr}</p>}
        </div>
      )}

      {confirmationResult && (
        <CustomOTPInput value={formData.otp} onChange={handleInputChange} maxLength={6} />
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
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
