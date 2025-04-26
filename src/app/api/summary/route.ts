import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

  return NextResponse.json({ analysis });
}
