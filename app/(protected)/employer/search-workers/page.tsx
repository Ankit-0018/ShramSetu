"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Star } from "lucide-react";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import "@/styles/worker.css";

// NOTE: No worker-search query/action exists anywhere in lib/queries or
// lib/actions yet (verified via codebase search). This is a static visual
// shell with sample data — wire it up to a real data source once one exists.

const FILTERS = ["Nearby", "Verified", "Free today"];

const SAMPLE_WORKERS = [
  {
    id: "1",
    name: "Ramesh Kumar",
    verified: true,
    skills: ["Mason", "Painter"],
    rating: 4.8,
    jobs: 42,
    distance: "1.2 km",
    wage: 650,
  },
  {
    id: "2",
    name: "Suresh Yadav",
    verified: true,
    skills: ["Electrician"],
    rating: 4.6,
    jobs: 28,
    distance: "2.4 km",
    wage: 800,
  },
  {
    id: "3",
    name: "Anita Devi",
    verified: false,
    skills: ["Plumber", "Carpenter"],
    rating: 4.3,
    jobs: 15,
    distance: "3.1 km",
    wage: 700,
  },
];

export default function SearchWorkersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const workers = SAMPLE_WORKERS;

  const initials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="text-lg font-bold text-foreground">Find workers</h1>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="px-4 py-3 space-y-3 bg-card border-b border-border sticky top-14 z-30">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Name or skill"
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(filter === f ? null : f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-32">
        {/* Count */}
        <p className="pt-4 pb-2 text-sm text-gray-500">
          {workers.length} workers found
        </p>

        {/* Worker Cards */}
        <div className="grid gap-4">
        {workers.map((w) => (
          <div
            key={w.id}
            className="rounded-2xl border border-border p-4 flex flex-col bg-white"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-foreground">
                  {initials(w.name)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-foreground truncate">{w.name}</h3>
                  {w.verified && (
                    <span className="inline-flex items-center gap-0.5 text-primary text-xs font-semibold shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{w.skills.join(" · ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <Star className="w-3.5 h-3.5 text-warning-muted-foreground fill-current" />
              <span>{w.rating}</span>
              <span>· {w.jobs} jobs · {w.distance}</span>
            </div>

            <p className="text-lg font-bold text-primary mb-3">
              ₹{w.wage}
            </p>

            <div className="flex gap-2 mt-auto">
              <Link href={`/employer/worker/${w.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Profile
                </Button>
              </Link>

              <Button size="sm" className="flex-1">
                Hire
              </Button>
            </div>
          </div>
        ))}
        </div>
        </div>
      </div>

      <EmployerNav />
    </div>
  );
}
