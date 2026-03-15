"use client";

import { db, auth } from "@/lib/firebase/firebase-client";
import { useUserStore } from "@/lib/stores/useUserStore";
import { doc, updateDoc } from "firebase/firestore";
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
  const { user } = useUserStore();
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

    const payload = {
      skills: selectedSkills,
      dailyWage: Number(dailyWage),
      availability: "available",
    };
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      profileCompleted: true,
      worker: payload,
    });

    // Refresh session cookie so middleware knows profile is complete
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    }

    router.push("/worker/home");
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default InfoPage;
