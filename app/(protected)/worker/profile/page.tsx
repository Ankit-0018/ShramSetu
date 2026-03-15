"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { useUserStore } from "@/lib/stores/useUserStore";
import "@/styles/worker.css";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Wallet,
  Edit2,
  Camera,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-client";
import Spinner from "@/components/_shared/spinner";
import { getMyAssignedJobs } from "@/lib/queries/assignments";

type WorkerProfile = {
  name: string;
  phone: string;
  email: string;
  location: string;
  skill: string;
  dailyWage: number;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  totalEarnings: number;
  memberSince: string;
};

export default function WorkerProfilePage() {
  const router = useRouter();
  const { user, loading, clearUser, location } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [stats, setStats] = useState({ completed: 0, earnings: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getMyAssignedJobs(user.uid).then((assigns) => {
        const completed = assigns.filter((a: any) => a.status === "completed");
        const earnings = completed.reduce(
          (sum, a) => sum + (Number(a.wage) || 0),
          0,
        );
        setStats({ completed: completed.length, earnings });
        setStatsLoading(false);
      });
    } else {
      setStatsLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      clearUser(); // Clear persisted store data
      router.push("/auth?mode=login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading || statsLoading) {
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
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary/80"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              {isEditing ? "Save" : "Edit"}
            </Button>
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
          <h2 className="profile-name">{user?.fullName}</h2>
          <p className="profile-skill">{user?.skills}</p>
          <div className="flex items-center gap-2 mt-2">
            {/* {user.isVerified && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                ✅ Verified
              </span>
            )} */}
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
              ⭐ {user?.averageRating}
            </span>
          </div>
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
                {isEditing ? (
                  <Input defaultValue={user?.phone} className="h-8" />
                ) : (
                  <p className="font-medium">+91 {user?.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                {isEditing ? (
                  <Input defaultValue={user?.email} className="h-8" />
                ) : (
                  <p className="font-medium">{user?.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                {isEditing ? (
                  <Input defaultValue={location?.address} className="h-8" />
                ) : (
                  <p className="font-medium">{location?.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold">Work Information</h3>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Primary Skill</p>
                {isEditing ? (
                  <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>Carpenter</option>
                  </select>
                ) : (
                  <p className="font-medium">{user?.skills}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Daily Wage (₹)</p>
                {isEditing ? (
                  <Input
                    type="number"
                    defaultValue={user?.dailyWage}
                    className="h-8"
                  />
                ) : (
                  <p className="font-medium">₹{user?.dailyWage}/day</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">
                {stats.completed}
              </p>
              <p className="text-xs text-muted-foreground">Jobs Completed</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">
                ₹{stats.earnings}
              </p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </div>
          </div>

          {/* Member Since */}
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Member since{" "}
              <span className="font-medium">
                {user?.memberSince?.toLocaleString()}
              </span>
            </p>
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
{/* {featture to be implemented} */}
          {/* <Button
            variant="outline"
            className="w-full bg-transparent border-gray-300 text-gray-700 h-10 rounded-lg"
          >
            Change Password
          </Button> */}
{/* {feature to be implemented} */}
          {/* <Button
            variant="outline"
            className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100 h-10 rounded-lg"
          >
            Delete Account
          </Button> */}
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
