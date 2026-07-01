import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { videoSchema } from "@/lib/validations";
import { serializeVideo, toVideoUpdateData } from "@/lib/video";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const video = await prisma.video.findUnique({
    where: { id: params.id },
  });

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  if (user.role === "LEARNER" && !video.published) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const progress = await prisma.progress.findUnique({
    where: {
      userId_videoId: { userId: user.id, videoId: params.id },
    },
  });

  const relatedWhere =
    user.role === "LEARNER"
      ? {
          id: { not: params.id },
          published: true,
          ...(video.category ? { category: video.category } : {}),
        }
      : {
          id: { not: params.id },
          ...(video.category ? { category: video.category } : {}),
        };

  const related = await prisma.video.findMany({
    where: relatedWhere,
    take: 4,
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    video: serializeVideo(video),
    percentWatched: progress?.percentWatched ?? 0,
    related: related.map((v) => serializeVideo(v)),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = videoSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const video = await prisma.video.update({
      where: { id: params.id },
      data: toVideoUpdateData(parsed.data),
    });

    return NextResponse.json(serializeVideo(video));
  } catch {
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.video.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
