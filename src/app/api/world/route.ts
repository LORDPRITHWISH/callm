import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const documents = await prisma.documents.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        publicId: true,
        worldName: true,
      },
    });
    if (!documents) {
      return NextResponse.json(
        { success: false, message: "No documents found" },
        { status: 404 }
      );
    }
    const formattedDocuments = documents.map((docs) => {
      const firstPageImage = `https://res.cloudinary.com/dom61f3n8/image/upload/pg_1/v1745048591/${docs.publicId}.jpg`;
      return {
        image: firstPageImage,
        text: docs.worldName,
        link: `/onboarding/${docs.id}`,
      };
    });
    return NextResponse.json(
      { success: true, formattedDocuments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching documents" },
      { status: 500 }
    );
  }
}
