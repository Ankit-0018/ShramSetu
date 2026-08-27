import { NextRequest, NextResponse } from "next/server";
import { BAD_REQUEST, OK } from "@/lib/server/http";
import { requireUserId, toErrorResponse, HttpError } from "@/lib/server/authenticate";
import cloudinary from "@/lib/server/cloudinary";

export async function POST(req: NextRequest) {
  try {
    requireUserId(req);

    const formData = await req.formData();
    const files = formData.getAll("images").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      throw new HttpError(BAD_REQUEST, "No images provided");
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise<{ imageUrl: string; publicId: string }>(
          (resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "shramsetu" },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve({
                  imageUrl: result.secure_url,
                  publicId: result.public_id,
                });
              },
            );
            stream.end(buffer);
          },
        );
      }),
    );

    return NextResponse.json({ images: uploads }, { status: OK });
  } catch (error) {
    return toErrorResponse(error);
  }
}
