import { downloadImages, scanReceipts } from "@/services/extractPDF";
import { flashcardPrompt } from "@/app/AI/prompt";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const formData = await req.formData();
    const id = formData.get("id");
    if (!id || typeof id !== "string") {
      return new Response("No valid id provided", { status: 400 });
    }
    const docs = await prisma.documents.findMany({
      where: { id },
      select: {
        id: true,
        pageCount: true,
        publicId: true,
        isFlashDone: true,
        flashCard: true,
      },
    });

    if (!docs.length) {
      return new Response("Document not found", { status: 404 });
    }
    if (docs[0].isFlashDone) {
      return Response.json({ flashcard: docs[0].flashCard }, { status: 200 });
    } else {
      const publicId = docs[0].publicId;
      const imagepaths = [];
      for (let i = 1; i <= docs[0].pageCount; i++) {
        imagepaths.push(`https://res.cloudinary.com/dom61f3n8/image/upload/pg_${i}/v1745048591/${publicId}.jpg`);
      }
      const images = await downloadImages(imagepaths);
      const receiptData = await scanReceipts(images, flashcardPrompt);
      await prisma.documents.update({
        where: {
          id,
        },
        data: {
          isFlashDone: true,
          flashCard: receiptData,
        },
      });
      return Response.json({ flashcard: receiptData }, { status: 200 });
    }
  } catch (error: unknown) {
    return new Response("Error scanning receipt" + error, { status: 500 });
  }
}
