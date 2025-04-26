import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { question, options } = await request.json();

  try {
    const saveQuestions = await prisma.question.create({
      data: {
        question,
        options,
      },
    });
    return NextResponse.json(
      { saveQuestions, message: "question saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error saving question:", error);
    return NextResponse.json(
      { message: "Error saving question" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    return NextResponse.json(
      { questions, message: "questions fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Error fetching questions" },
      { status: 500 }
    );
  }
}
