"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import { useUserStore } from "@/lib/stores/useUserStore";
import "@/styles/worker.css";
import {
  MapPin,
  Phone,
  Briefcase,
  Camera,
  LogOut,
  Building2,
} from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import Spinner from "@/components/_shared/spinner";

export default function EmployerProfilePage() {
  const router = useRouter();
  const { user, loading, location, clearUser } = useUserStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const employerProfile = user?.employerProfile;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/auth/logout", { method: "GET" });
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
        <WorkerHeader title="Profile" />

        <div>
          <div>
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="text-2xl">👨‍💼</span>
                <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 border-2 border-primary-foreground">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <h2 className="profile-name">{user.fullName}</h2>
              <p className="profile-skill">
                {employerProfile?.businessName || "Individual"}
              </p>
            </div>
          </div>

          <div>
            {/* Profile Info */}
            <div className="profile-info">
              {/* Business */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground">
                  Business
                </h3>

                <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Business name</p>
                    <p className="font-medium truncate">
                      {employerProfile?.businessName || "Not set"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary shrink-0">
                    Change
                  </span>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Business type</p>
                    <p className="font-medium truncate">
                      {employerProfile?.employerType || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <h3 className="px-4 pt-4 pb-2 text-sm font-semibold text-muted-foreground">
                  Contact
                </h3>

                <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium truncate">{user.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium truncate">
                      {location?.address || location?.city || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions (logout) - stacked at bottom */}
        <div className="px-4 py-4 space-y-3 pb-32">
          <Button
            variant="outline"
            size="xl"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <EmployerNav />
    </div>
  );
}
