import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { prisma } from "@/lib/db";
import { fetchPDFBuffer } from "@/services/extractPDF";
import path from "path";
import fs from "fs/promises";

export const POST = async (req: NextRequest) => {
  try {
    const { id, question } = await req.json();

    if (!id || !question) {
      return NextResponse.json(
        { error: "Both 'id' and 'question' are required." },
        { status: 400 }
      );
    }

    const document = await prisma.documents.findUnique({
      where: { id },
      select: { pdfUrl: true, publicId: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 }
      );
    }

    const { pdfUrl, publicId } = document;
    const fileName = `${publicId}.pdf`;
    const filePath = path.join(process.cwd(), "public", "temp", fileName);

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const buffer = await fetchPDFBuffer(pdfUrl);
    await fs.writeFile(filePath, buffer);

    const loader = new PDFLoader(filePath);
    const parsedDocs = await loader.load();

    const parsedText = parsedDocs
      .map((doc) => doc.pageContent)
      .join("\n")
      .split("\n");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Based on the document text: "${parsedText}", answer this question: "${question}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiResult = await geminiResponse.json();
    const answer =
      geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer found";

    return NextResponse.json({
      answer,
      fileName,
      parsedText,
    });
  } catch (error) {
    console.error("Error during PDF processing:", error);
    return NextResponse.json(
      { error: "Failed to process PDF or answer the question." },
      { status: 500 }
    );
  }
};
