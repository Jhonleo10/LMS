"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { APITypes } from "plyr-react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/Button";
import { VideoCardSkeleton } from "@/components/ui/Skeleton";
import { VideoItem } from "@/types";
import "plyr-react/plyr.css";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

interface VideoDetail {
  video: VideoItem;
  percentWatched: number;
  related: VideoItem[];
}

export default function VideoPlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const lastSaved = useRef(0);
  const playerRef = useRef<APITypes>(null);

  const fetchVideo = useCallback(async () => {
    try {
      const res = await fetch(`/api/videos/${params.id}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
      setPercent(json.percentWatched);
    } catch {
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const saveProgress = useCallback(
    async (pct: number) => {
      try {
        await fetch(`/api/videos/${params.id}/progress`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ percentWatched: Math.min(100, Math.round(pct)) }),
        });
        setPercent(Math.round(pct));
      } catch {
        /* silent fail for progress */
      }
    },
    [params.id]
  );

  const handleTimeUpdate = useCallback(() => {
    const plyr = playerRef.current?.plyr;
    if (!plyr?.duration) return;

    const pct = (plyr.currentTime / plyr.duration) * 100;
    const now = Date.now();
    if (now - lastSaved.current > 10000) {
      lastSaved.current = now;
      saveProgress(pct);
    }
  }, [saveProgress]);

  useEffect(() => {
    const plyr = playerRef.current?.plyr;
    if (!plyr) return;

    plyr.on("timeupdate", handleTimeUpdate);
    plyr.on("ended", () => saveProgress(100));

    return () => {
      plyr.off("timeupdate", handleTimeUpdate);
      plyr.off("ended", () => saveProgress(100));
    };
  }, [data, handleTimeUpdate, saveProgress]);

  const markWatched = () => saveProgress(100);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <VideoCardSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-muted">
        Video not found
      </div>
    );
  }

  const { video, related } = data;

  return (
    <PageTransition>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-surface/40 border-y border-border min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>

          <div className="rounded-2xl overflow-hidden shadow-card mb-6">
            <Plyr
              ref={playerRef}
              source={{
                type: "video",
                sources: [{ src: video.url, type: "video/mp4" }],
                poster: video.thumbnail,
              }}
              options={{
                controls: [
                  "play-large",
                  "play",
                  "progress",
                  "current-time",
                  "mute",
                  "volume",
                  "fullscreen",
                ],
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
                {video.title}
              </h1>
              <p className="text-muted leading-relaxed max-w-2xl">
                {video.description}
              </p>
              {video.category && (
                <span className="mt-3 inline-block text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                  {video.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {percent > 0 && (
                <span className="text-sm text-muted">{percent}% watched</span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={markWatched}
                disabled={percent >= 100}
              >
                <CheckCircle className="h-4 w-4" />
                {percent >= 100 ? "Completed" : "Mark as watched"}
              </Button>
            </div>
          </div>

          {percent > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-muted mb-1.5">
                <span>Your progress</span>
                <span>{percent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Up next</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((v) => (
                  <Link
                    key={v.id}
                    href={`/videos/${v.id}`}
                    className="group rounded-2xl bg-surface border border-border overflow-hidden hover:shadow-card transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                        {v.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}