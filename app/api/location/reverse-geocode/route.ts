import { NextResponse } from "next/server";
import { geohashForLocation } from "geofire-common";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-client";
import { prepareLocation } from "@/lib/queries/preparelocation";

export async function POST(req: Request) {
  try {
    const { uid, lat, lng } = await req.json();
    if (uid == null || lat == null || lng == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Convert to numbers (important)
    const latNum = Number(lat);
    const lngNum = Number(lng);

    const { address, geohash, city } = await prepareLocation(latNum, lngNum);
    // Save to Firestore
    await updateDoc(doc(db, "users", uid), {
      location: {
        lat: latNum,
        lng: lngNum,
        address,
        city,
        geohash,
        locationUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      address,
      city,
      geohash,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
