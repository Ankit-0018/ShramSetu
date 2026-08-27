import { useUserStore } from "@/lib/stores/useUserStore";
import { apiFetch } from "@/lib/api/client";

export async function syncLocation(coords: { lat: number; lng: number }) {
  const { user, setLocation } = useUserStore.getState();
  if (!user?.id) {
    throw new Error("User not available");
  }

  const resolved = await apiFetch<{
    success: boolean;
    data: {
      latitude: number;
      longitude: number;
      cityName: string | null;
      formattedAddress: string;
    };
  }>("/api/v1/locations/resolve", {
    method: "POST",
    body: { latitude: coords.lat, longitude: coords.lng },
  });

  await apiFetch("/api/v1/workers/status", {
    method: "PATCH",
    body: { latitude: coords.lat, longitude: coords.lng },
  });

  setLocation({
    lat: coords.lat,
    lng: coords.lng,
    address: resolved.data.formattedAddress,
    city: resolved.data.cityName,
  });
}
