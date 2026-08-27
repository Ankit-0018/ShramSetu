"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { useUserStore } from "@/lib/stores/useUserStore";
import "@/styles/worker.css";
import {
  MapPin,
  Phone,
  Briefcase,
  Wallet,
  Camera,
  LogOut,
} from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import Spinner from "@/components/_shared/spinner";

export default function WorkerProfilePage() {
  const router = useRouter();
  const { user, loading, clearUser, location } = useUserStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const workerProfile = user?.workerProfile;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      await fetch("/api/auth/session", { method: "DELETE" });
      clearUser();
      router.push("/auth?mode=login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="worker-container">
        <div className="worker-layout flex items-center justify-center h-screen">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">Profile</h1>
          </div>
        </div>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="text-2xl">👨‍🔧</span>
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 border-2 border-primary-foreground">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <h2 className="profile-name">{user.fullName}</h2>
          <p className="profile-skill">{workerProfile?.skills?.join(", ")}</p>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          {/* Contact Info */}
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold">Contact Information</h3>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{location?.address || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold">Work Information</h3>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Skills</p>
                <p className="font-medium">
                  {workerProfile?.skills?.join(", ") || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Minimum Wage (₹)</p>
                <p className="font-medium">
                  {workerProfile?.minimumWage
                    ? `₹${workerProfile.minimumWage}/day`
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 space-y-3 pb-32">
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
