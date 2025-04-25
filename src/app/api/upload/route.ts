import { cloudinaryUpload } from "@/services/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  console.log(userId);

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const worldName = formData.get("worldName") as String;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");

  try {
    const uploadToCloudinary = await cloudinaryUpload(buffer, filename);
    console.log(uploadToCloudinary);
    if (!uploadToCloudinary) {
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 400 }
      );
    }
    const document = await prisma.documents.create({
      data: {
        worldName: worldName as string,
        pdfUrl: uploadToCloudinary.url,
        publicId: uploadToCloudinary.public_id,
        pageCount: uploadToCloudinary.pages as number,
        User: {
          connect: {
            userId,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: document,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
