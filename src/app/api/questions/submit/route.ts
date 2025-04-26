import { model } from "@/app/AI/gemini";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { answers } = await request.json();
  const { userId } = await auth();
  console.log(userId);
  if (!userId) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }
  try {
    const questions = await prisma.question.findMany();
    const prompt = `
    Analyze these personality assessment responses and provide:
    1. Overall character rating (1-10 scale, 10 being most positive)
    2. Top 3 character traits with scores (1-10)
    3. Brief analysis paragraph
    4. 3 personalized suggestions

    Format requirements:
    - Rating must be between 1-10
    - Respond in perfect JSON format
    - Don't include any markdown or code fences

    Questions and Answers:
    ${questions.map((q) => `${q.question} - ${answers[q.id] || "No answer"}`).join("\n")}

    Response format:
    {
      "rating": 7,
      "traits": [
        {"trait": "Optimism", "score": 8},
        {"trait": "Resilience", "score": 6}
      ],
      "analysis": "The user shows strong optimism but could work on resilience...",
      "suggestions": ["Practice mindfulness..."]
    }
  `;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const analysis = JSON.parse(text);

    if (!analysis.rating || !analysis.traits) {
      return NextResponse.json({ message: "Error parsing response" }, { status: 500 });
    }
    // await prisma.$transaction([
    await prisma.analysis.create({
      data: {
        userId: userId,
        result: text || "", // Ensure result text is not undefined
      },
    });
    await prisma.user.update({
      where: {
        userId,
      },
      data: {
        isSarveyCompleted: true,
      },
    });
    // ]);

    // return NextResponse.json({ analysis, message: "anaylsis fetched successfully", result, text }, { status: 200 });
    return NextResponse.json({ analysis, message: "anaylsis fetched successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error generating analysis:", error);
    return NextResponse.json({ message: "Error generating analysis" }, { status: 500 });
  }
}
