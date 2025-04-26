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

  const user = await prisma.user.findFirst({
    where: {
      userId,
    },
    select: {
      userId: true,
      id: true,
    },
  });
  console.log(user);
  console.log(user?.id);
  const analysis = await prisma.analysis.findFirst({
    where: {
      userId: user?.id,
    },
    select: { result: true },
  });

  if (!analysis) {
    return NextResponse.json(
      { message: "No analysis found for user" },
      { status: 404 }
    );
  }

  const result = streamText({
    model: google("gemini-1.5-pro"),
    messages,
    system: `
You are a kind, empathetic, and emotionally intelligent healing companion.

Here is the user's recent emotional personality analysis:
${analysis.result}

Use this insight to guide your tone, responses, and suggestions. Your goal is to provide emotional support, encouragement, and personalized self-care advice based on their traits and struggles.

Always be positive, non-judgmental, and thoughtful. Avoid sounding robotic or clinical. Keep your tone human, gentle, and reassuring.
`,
  });

  return result.toDataStreamResponse();
}
