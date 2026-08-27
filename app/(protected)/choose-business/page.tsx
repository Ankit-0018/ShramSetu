"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Employer Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <p className="font-medium mb-2">Employer Type</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="employerType"
              checked={employerType === "INDIVIDUAL"}
              onChange={() => setEmployerType("INDIVIDUAL")}
            />
            Individual
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="employerType"
              checked={employerType === "BUSINESS"}
              onChange={() => setEmployerType("BUSINESS")}
            />
            Business
          </label>
        </div>

        {employerType === "BUSINESS" && (
          <>
            <div>
              <label className="block font-medium mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g. ShramSetu Services"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">GST Number (optional)</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="27ABCDE1234F1Z5"
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ChooseBusinessPage;
