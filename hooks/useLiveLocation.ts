"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { syncLocation } from "@/lib/utils/location/synclocation";
import { useEffect, useRef, useState } from "react";

export function useLiveLocation() {
  const {
    location,
    setLocation,
    setLocationError,
    setLocationPermission,
    setLocationLoading,
    locationLoading,
    isTracking,
    setTracking,
    clearLocation,
  } = useUserStore();
  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
  if (watchIdRef.current !== null) return;

  if (!navigator.geolocation) {
    setLocationError("Geolocation not supported");
    return;
  }

  setLocationLoading(true); // 🔥 here

  watchIdRef.current = navigator.geolocation.watchPosition(
    async (pos) => {
      setLocationPermission("granted");
      const newLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      try {
        setLocation(newLocation);
        setLocationLoading(true)
        await syncLocation(newLocation);
        setTracking(true);
      } catch (err) {
        setLocationPermission("denied");
        setLocationError(err instanceof Error ? err.message : "Location error");
      } finally {
        setLocationLoading(false); // 🔥 stop after first fix
      }
    }
  )}
  const stopTracking = () => {
    if (watchIdRef.current === null) return;

    clearLocation();
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setTracking(false)
  };


  return {
    startTracking,
    stopTracking,
    isTracking,
    locationLoading
  };
}
