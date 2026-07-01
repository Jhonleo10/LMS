import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { videoSchema } from "@/lib/validations";
import { serializeVideo, toVideoCreateData } from "@/lib/video";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isLearner = user.role === "LEARNER";

  const videos = await prisma.video.findMany({
    where: isLearner ? { published: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  if (isLearner) {
    const progress = await prisma.progress.findMany({
      where: { userId: user.id },
    });
    const progressMap = new Map(
      progress.map((p) => [p.videoId, p.percentWatched])
    );

    return NextResponse.json(
      videos.map((v) =>
        serializeVideo(v, { percentWatched: progressMap.get(v.id) ?? 0 })
      )
    );
  }

  return NextResponse.json(videos.map((v) => serializeVideo(v)));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = videoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: toVideoCreateData(parsed.data),
    });
    return NextResponse.json(serializeVideo(video), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
