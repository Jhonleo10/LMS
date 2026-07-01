import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { progressSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = progressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const video = await prisma.video.findUnique({ where: { id: params.id } });
    if (!video || (user.role === "LEARNER" && !video.published)) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_videoId: { userId: user.id, videoId: params.id },
      },
      update: {
        percentWatched: parsed.data.percentWatched,
      },
      create: {
        userId: user.id,
        videoId: params.id,
        percentWatched: parsed.data.percentWatched,
      },
    });

    return NextResponse.json({
      percentWatched: progress.percentWatched,
      lastWatchedAt: progress.lastWatchedAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
