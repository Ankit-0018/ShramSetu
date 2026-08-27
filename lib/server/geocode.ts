import prisma from "./prisma";

export type ResolvedLocation = {
  latitude: number;
  longitude: number;
  cityId: string | null;
  cityCode: string | null;
  cityName: string | null;
  formattedAddress: string;
};

const cityCode = (name: string) =>
  name.slice(0, 3).toUpperCase().padEnd(3, "X");

/**
 * Reverse geocode lat/lng via Nominatim and upsert the resolved city.
 */
export const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<ResolvedLocation> => {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: lat.toString(),
    lon: lng.toString(),
    addressdetails: "1",
    zoom: "18",
    "accept-language": "en",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "ShramSetu/1.0 (contact@shramsetu.com)",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Reverse geocode failed");
  }

  const data = (await res.json()) as any;
  const a = data.address || {};

  const cityName: string | undefined =
    a.city || a.town || a.village || a.county;

  const formattedAddress: string =
    data.display_name ||
    [a.road, a.suburb || a.neighbourhood, cityName]
      .filter(Boolean)
      .join(", ");

  let city = null;
  if (cityName) {
    const code = cityCode(cityName);
    city = await prisma.city.upsert({
      where: { code },
      update: { name: cityName },
      create: { code, name: cityName },
    });
  }

  return {
    latitude: lat,
    longitude: lng,
    cityId: city?.id ?? null,
    cityCode: city?.code ?? null,
    cityName: city?.name ?? null,
    formattedAddress,
  };
};
