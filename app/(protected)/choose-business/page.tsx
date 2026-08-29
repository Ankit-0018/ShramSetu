"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2 } from "lucide-react";

const ChooseBusinessPage = () => {
  const [employerType, setEmployerType] = useState<"INDIVIDUAL" | "BUSINESS">(
    "INDIVIDUAL",
  );
  const [businessName, setBusinessName] = useState("");
  const [gst, setGst] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (employerType === "BUSINESS" && !businessName.trim()) {
      setError("Business name is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const result = await apiFetch<{
        success: boolean;
        data: { user: any };
      }>("/api/v1/users/profile", {
        method: "POST",
        body: {
          role: "EMPLOYER",
          type: employerType,
          ...(employerType === "BUSINESS" && {
            businessName: businessName.trim(),
            gst: gst.trim() || undefined,
          }),
        },
      });

      setUser({
        ...user,
        role: "EMPLOYER",
        isProfileCompleted: true,
        employerProfile: {
          id: result.data.user.id,
          employerType: result.data.user.employerType,
          businessName: result.data.user.businessName,
          gstNumber: result.data.user.gstNumber,
          profilePhotoUrl: result.data.user.profilePhotoUrl,
        },
      });

      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "EMPLOYER", isProfileCompleted: true }),
      });

      router.push("/employer/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-5 py-8 pb-28 sm:mx-auto sm:max-w-md">
      <p className="text-xs font-bold tracking-wide text-primary mb-1">Step 2 of 2</p>
      <h1 className="text-2xl font-extrabold text-foreground mb-1.5">
        Set up your employer profile
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Workers see this before they apply.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center py-2">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-border bg-secondary text-muted-foreground">
            <Building2 className="size-8" />
          </div>
          <p className="mt-2 text-sm font-semibold text-primary">Add profile photo</p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-2">You are hiring as</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setEmployerType("INDIVIDUAL")}
              className={`h-12 rounded-full border-2 font-semibold transition ${
                employerType === "INDIVIDUAL"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground"
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setEmployerType("BUSINESS")}
              className={`h-12 rounded-full border-2 font-semibold transition ${
                employerType === "BUSINESS"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground"
              }`}
            >
              Business
            </button>
          </div>
        </div>

        {employerType === "BUSINESS" && (
          <>
            <div>
              <label className="block font-semibold text-foreground mb-2">Business name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-12 w-full rounded-xl bg-secondary px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="e.g. Rajesh Kumar Builders"
              />
            </div>

            <div>
              <label className="flex items-baseline justify-between font-semibold text-foreground mb-2">
                GST number
                <span className="text-xs font-normal text-muted-foreground">Optional</span>
              </label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="h-12 w-full rounded-xl bg-secondary px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                placeholder="27ABCDE1234F1Z5"
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Finish setup"}
        </button>
      </form>
    </div>
  );
};

export default ChooseBusinessPage;
