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
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">नई नौकरी पोस्ट करें</h1>
            <p className="text-sm text-blue-100">Post a new job</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                काम का नाम / Job Title *
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
              <label className="block text-sm font-semibold mb-2">
                आवश्यक कौशल / Skill Required *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SKILLS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, primarySkill: s.id }))
                    }
                    className={`p-3 rounded-lg border-2 text-sm font-medium ${
                      formData.primarySkill === s.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                काम का प्रकार / Job Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {JOB_TYPES.map((jt) => (
                  <button
                    key={jt.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, jobType: jt.id }))
                    }
                    className={`p-3 rounded-lg border-2 text-sm font-medium ${
                      formData.jobType === jt.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {jt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wage */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                न्यूनतम मजदूरी / Minimum Wage (₹) *
              </label>
              <Input
                type="number"
                name="minimumWage"
                value={formData.minimumWage}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                स्थान / Location
              </label>

              <LocationField />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                विवरण / Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Submit */}
            <Button className="w-full bg-blue-600 h-12">
              नौकरी पोस्ट करें / Post Job
            </Button>

            <Link href="/employer/home">
              <Button variant="outline" className="w-full bg-transparent">
                रद्द करें / Cancel
              </Button>
            </Link>
          </form>
        </div>
      </div>

      <EmployerNav />
    </div>
  );
}
