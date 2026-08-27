"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const skillsList = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Mason",
  "Welder",
  "Cleaner",
];

const InfoPage = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [dailyWage, setDailyWage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (selectedSkills.length === 0) {
      setError("Pick at least one skill");
      return;
    }
    if (!dailyWage || Number(dailyWage) <= 0) {
      setError("Enter a valid daily wage");
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
          role: "WORKER",
          skills: selectedSkills,
          dailyWage: Number(dailyWage),
        },
      });

      setUser({
        ...user,
        role: "WORKER",
        isProfileCompleted: true,
        workerProfile: {
          id: result.data.user.id,
          skills: result.data.user.skills,
          canRelocate: result.data.user.canRelocate,
          minimumWage: result.data.user.minimumWage,
          profilePhotoUrl: result.data.user.profilePhotoUrl,
        },
      });

      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "WORKER", isProfileCompleted: true }),
      });

      router.push("/worker/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Worker Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Skills */}
        <div>
          <p className="font-medium mb-2">Choose Skills</p>

          <div className="grid grid-cols-2 gap-2">
            {skillsList.map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />

                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* Daily Wage */}
        <div>
          <label className="block font-medium mb-1">Daily Wage (₹)</label>

          <input
            type="number"
            value={dailyWage}
            onChange={(e) => setDailyWage(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter daily wage"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Submit */}
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

export default InfoPage;
