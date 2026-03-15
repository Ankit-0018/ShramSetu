"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-client";
import { ReactNode, useEffect } from "react";
import { type UserRole, useUserStore } from "@/lib/stores/useUserStore";
import { getUserProfile } from "@/lib/queries/user";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading, setLocation, clearLocation, clearUser } =
    useUserStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        clearUser();
        clearLocation();

        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const [token, profile] = await Promise.all([
          firebaseUser.getIdTokenResult(),
          getUserProfile(firebaseUser.uid),
        ]);

        if (!profile) {
          console.error("User profile not found");
          setUser(null);
          setLoading(false);
          return;
        }

        const role = token.claims.role;

        if (role !== "worker" && role !== "employer") {
          console.error("Invalid role claim");
          setUser(null);
          setLoading(false);
          return;
        }

        setUser({
          uid: firebaseUser.uid,
          fullName: profile.fullName,
          role: role as UserRole,
          dailyWage: profile.dailyWage,
          phone: profile.phone,
          averageRating: profile?.averageRating ?? 0.0,
          ratingCount: profile?.ratingCount ?? 0,
          completedJobsCount: profile?.completedJobsCount ?? 0,
          workStatus: profile.workStatus,
          email: profile.email,
          skills: profile?.skills,
          totalEarnings: profile?.totalEarnings,
          memberSince: profile?.memberSince,
        });
        if (profile.location) {
          const { lat, lng, address, geohash, city } = profile.location;
          setLocation({
            lat,
            lng,
            address,
            geohash,
            city,
          });
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [setUser, setLoading, setLocation]);

  return <>{children}</>;
}
