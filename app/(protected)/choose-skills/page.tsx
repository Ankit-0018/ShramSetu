"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Hammer,
  Paintbrush,
  Wrench,
  Zap,
  Droplet,
  Flame,
  Trash2,
  Check,
} from "lucide-react";

const skillsList = [
  { name: "Mason", icon: Hammer },
  { name: "Painter", icon: Paintbrush },
  { name: "Carpenter", icon: Wrench },
  { name: "Electrician", icon: Zap },
  { name: "Plumber", icon: Droplet },
  { name: "Welder", icon: Flame },
  { name: "Cleaner", icon: Trash2 },
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
    <div className="min-h-screen bg-background px-5 py-8 pb-28 sm:mx-auto sm:max-w-md">
      <p className="text-xs font-bold tracking-wide text-primary mb-1">Step 2 of 2</p>
      <h1 className="text-2xl font-extrabold text-foreground mb-1.5">
        Set up your worker profile
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        This helps us match you with the right jobs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Skills */}
        <div>
          <p className="font-semibold text-foreground mb-3">Your skills</p>

          <div className="grid grid-cols-2 gap-3">
            {skillsList.map(({ name: skill, icon: Icon }) => {
              const selected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center gap-2.5 rounded-2xl border-2 px-4 py-3.5 text-left font-semibold transition ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon className="size-4.5 shrink-0" />
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Wage */}
        <div>
          <label className="block font-semibold text-foreground mb-2">
            Minimum daily wage
          </label>

          <div className="flex h-14 items-center gap-1 rounded-2xl bg-secondary px-4">
            <span className="text-2xl font-extrabold text-primary">₹</span>
            <input
              type="number"
              value={dailyWage}
              onChange={(e) => setDailyWage(e.target.value)}
              className="h-full flex-1 bg-transparent text-2xl font-extrabold text-primary outline-none"
              placeholder="700"
            />
            <span className="text-sm text-muted-foreground">/ day</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Jobs paying less than this won&apos;t be shown to you.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            {selectedSkills.length} skill{selectedSkills.length === 1 ? "" : "s"} selected
          </p>
          {selectedSkills.length > 0 && (
            <Check className="size-4 text-primary" strokeWidth={3} />
          )}
        </div>

        {/* Submit */}
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

export default InfoPage;
