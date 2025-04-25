
import { downloadImages, scanReceipts } from "@/services/extractPDF";

import { summaryPrompt } from "@/app/AI/prompt";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";



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
        isSummaryDone: true,
        summary: true,
      },
    });

    if (!docs.length) {
      return new Response("Document not found", { status: 404 });
    }

    if (docs[0].isSummaryDone) {
      return Response.json({ summary: docs[0].summary }, { status: 200 });
    } else {
      const publicId = docs[0].publicId;
      const imagepaths = [];

      for (let i = 1; i <= docs[0].pageCount; i++) {
        imagepaths.push(
          `https://res.cloudinary.com/dom61f3n8/image/upload/pg_${i}/v1745048591/${publicId}.jpg`
        );
      }

      const images = await downloadImages(imagepaths);
      const receiptData = await scanReceipts(images, summaryPrompt);
      await prisma.documents.update({
        where: {
          id,
        },
        data: {
          isSummaryDone: true,
          summary: receiptData,
        },
      });
      return Response.json({ summary: receiptData }, { status: 200 });
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    return new Response("Error scanning receipt", { status: 500 });
  }
}
