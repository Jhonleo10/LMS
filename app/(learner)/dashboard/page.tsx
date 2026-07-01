"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Play } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { VideoCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { VideoItem } from "@/types";

export default function DashboardPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error();
      setVideos(await res.json());
    } catch {
      /* empty state handles this */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const categories = Array.from(
    new Set(videos.map((v) => v.category).filter(Boolean))
  ) as string[];

  const filtered = category
    ? videos.filter((v) => v.category === category)
    : videos;

  return (
    <PageTransition>
      <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold mb-1">
            Video Library
          </h1>
          <p className="text-muted">Continue learning at your own pace</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setCategory(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                !category
                  ? "bg-accent text-white shadow-glow"
                  : "bg-surface text-muted hover:text-foreground border border-border"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  category === cat
                    ? "bg-accent text-white shadow-glow"
                    : "bg-surface text-muted hover:text-foreground border border-border"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl ait-card p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                <Film className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              {category ? "No videos in this category" : "No published videos yet"}
            </h2>
            <p className="text-[var(--muted)]">
              Your admin will publish courses here. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Link
                  href={`/videos/${video.id}`}
                  className="block rounded-2xl bg-surface border border-border overflow-hidden hover:shadow-card-hover transition-shadow duration-200"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 shadow-glow">
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    {(video.percentWatched ?? 0) > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${video.percentWatched}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 group-hover:text-accent transition-colors duration-200">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2">
                      {video.description}
                    </p>
                    {video.category && (
                      <span className="mt-2 inline-block text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                        {video.category}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
    </PageTransition>
  );
}
