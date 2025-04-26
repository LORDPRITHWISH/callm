import { prisma } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      userId,
    },
    select: {
      result: true,
    },
  });

  

  const result = streamText({
    model: google("gemini-1.5-pro"),
    messages,

    system: ``,
  });

  return result.toDataStreamResponse();
}
