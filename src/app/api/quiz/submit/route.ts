import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id, answers } = await req.json();

  try {
    const res = await prisma.documents.update({
      where: {
        id,
      },
      data: {
        qnaAnswers:answers,
        submissionTime: new Date(),
        isQnaSolveDone: true,
      },
    });
    if (!res) {
      return new Response("Document not found", { status: 404 });
    }
    return Response.json(
      { message: "Quiz submitted successfully", res },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return new Response("Error submitting quiz", { status: 500 });
  }
}
