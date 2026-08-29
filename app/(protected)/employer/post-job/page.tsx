"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import LocationField from "@/components/sections/location-field";
import { createJob } from "@/lib/actions/job";
import { useUserStore } from "@/lib/stores/useUserStore";
import { JobType } from "@/lib/types/job";
import "@/styles/worker.css";

const SKILLS = [
  { id: "labour", label: "Labour / लेबर" },
  { id: "mason", label: "Mason / मिस्त्री" },
  { id: "carpenter", label: "Carpenter / बढ़ई" },
  { id: "plumber", label: "Plumber / प्लंबर" },
  { id: "electrician", label: "Electrician / इलेक्ट्रीशियन" },
  { id: "painter", label: "Painter / पेंटर" },
];

const JOB_TYPES: { id: JobType; label: string }[] = [
  { id: "ONE_TIME", label: "One Time / एक बार" },
  { id: "PART_TIME", label: "Part Time / अंशकालिक" },
  { id: "FULL_TIME", label: "Full Time / पूर्णकालिक" },
];

export default function PostJobPage() {
  const router = useRouter();
  const { user, location } = useUserStore();
  const [formData, setFormData] = useState({
    title: "",
    primarySkill: "",
    minimumWage: "",
    jobType: "" as JobType | "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.primarySkill ||
      !formData.minimumWage ||
      !formData.jobType
    ) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    if (!location) {
      alert("कृपया स्थान चुनें / Please select location");
      return;
    }

    if (!user) {
      alert("User not authenticated");
      return;
    }

    try {
      await createJob({
        title: formData.title,
        primarySkill: formData.primarySkill,
        minimumWage: Number(formData.minimumWage),
        jobType: formData.jobType as JobType,
        description: formData.description || undefined,
        latitude: location.lat,
        longitude: location.lng,
      });

      alert("नौकरी पोस्ट की गई / Job posted successfully!");
      router.push("/employer/home");
    } catch (err) {
      console.error(err);
      alert("नौकरी पोस्ट करने में त्रुटि");
    }
  };

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <Link href="/employer/home" className="shrink-0">
              <ChevronLeft className="w-6 h-6 cursor-pointer text-foreground" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">
                Post a new job
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                नई नौकरी पोस्ट करें
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-4 py-6 pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Title */}
          <div>
            <label className="block font-semibold text-foreground mb-2">
              Job title / काम का नाम *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="जैसे: विद्युत मरम्मत"
              required
            />
          </div>

          {/* Skill */}
          <div>
            <p className="font-semibold text-foreground mb-3">
              Skill needed / आवश्यक कौशल *
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SKILLS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, primarySkill: s.id }))
                  }
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold text-center transition ${
                    formData.primarySkill === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <p className="font-semibold text-foreground mb-3">
              Duration / काम का प्रकार *
            </p>
            <div className="grid grid-cols-3 gap-2">
              {JOB_TYPES.map((jt) => (
                <button
                  key={jt.id}
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, jobType: jt.id }))
                  }
                  className={`rounded-full px-3 py-2.5 text-sm font-semibold text-center transition ${
                    formData.jobType === jt.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  {jt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wage */}
          <div>
            <label className="block font-semibold text-foreground mb-2">
              Daily wage / न्यूनतम मजदूरी *
            </label>
            <div className="flex h-14 items-center gap-1 rounded-2xl bg-secondary px-4">
              <span className="text-2xl font-extrabold text-primary">₹</span>
              <input
                type="number"
                name="minimumWage"
                value={formData.minimumWage}
                onChange={handleChange}
                required
                className="h-full flex-1 bg-transparent text-2xl font-extrabold text-primary outline-none"
                placeholder="750"
              />
              <span className="text-sm text-muted-foreground">/ day</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-foreground mb-2">
              Location / स्थान
            </label>

            <LocationField />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-foreground mb-2">
              Description / विवरण
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>

          {/* Submit */}
          <Button size="xl" className="w-full">
            Post job / नौकरी पोस्ट करें
          </Button>

          <Link href="/employer/home">
            <Button variant="outline" size="xl" className="w-full">
              Cancel / रद्द करें
            </Button>
          </Link>
        </form>
        </div>
      </div>

      <EmployerNav />
    </div>
  );
}
