import { downloadImages, scanReceipts } from "@/services/extractPDF";
import { QNAPrompt } from "@/app/AI/prompt";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
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
        isQNADone: true,
        qna: true,
        qnaMarks: true,
        submissionTime: true,
        isQnaSolveDone: true,
        qnaAnswers: true,
      },
    });
    if (!docs.length) {
      return new Response("Document not found", { status: 404 });
    }

    if (docs[0].isQNADone) {
      return Response.json(
        {
          QNA: docs[0].qna,
          isQnaSolveDone: docs[0].isQnaSolveDone,
          qnaAnswers: docs[0].qnaAnswers,
          qnaMarks: docs[0].qnaMarks,
          submissionTime: docs[0].submissionTime,
        },
        { status: 200 }
      );
    } else {
      const publicId = docs[0].publicId;
      const imagepaths = [];
      for (let i = 1; i <= docs[0].pageCount; i++) {
        imagepaths.push(
          `https://res.cloudinary.com/dom61f3n8/image/upload/pg_${i}/v1745048591/${publicId}.jpg`
        );
      }
      const images = await downloadImages(imagepaths);
      const receiptData = await scanReceipts(images, QNAPrompt);
      await prisma.documents.update({
        where: {
          id,
        },
        data: {
          isQNADone: true,
          qna: receiptData,
        },
      });

      return Response.json(
        { QNA: receiptData, isQnaSolveDone: false },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.log(error);
    return new Response("Error scanning receipt", { status: 500 });
  }
}
