import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

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
  
      const QnaDetails = await prisma.documents.findUnique({
        where: { id },
        select: {
          submissionTime: true,
          qnaMarks: true,
          isQnaSolveDone: true,
        },
      });
  
      if (!QnaDetails) {
        return new Response("Document not found", { status: 404 });
      }
  
      return Response.json(QnaDetails, { status: 200 });
    } catch (error) {
      console.error("Error fetching QNA details:", error);
      return new Response("Error fetching QNA details", { status: 500 });
    }
  }
  