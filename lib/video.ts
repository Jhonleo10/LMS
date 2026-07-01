import type { VideoItem } from "@/types";

type VideoRecord = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
};

export function serializeVideo(
  video: VideoRecord,
  extra?: { percentWatched?: number }
): VideoItem {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    url: video.url,
    thumbnail: video.thumbnail,
    category: video.category,
    order: video.sortOrder,
    published: video.published,
    createdAt: video.createdAt.toISOString(),
    ...extra,
  };
}

export function toVideoCreateData(data: {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category?: string;
  order?: number;
  published?: boolean;
}) {
  const { order, category, published, ...rest } = data;
  return {
    ...rest,
    category: category ?? null,
    sortOrder: order ?? 0,
    published: published ?? false,
  };
}

export function toVideoUpdateData(data: {
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  category?: string;
  order?: number;
  published?: boolean;
}) {
  const { order, category, published, ...rest } = data;
  return {
    ...rest,
    ...(category !== undefined && { category: category || null }),
    ...(order !== undefined && { sortOrder: order }),
    ...(published !== undefined && { published }),
  };
}
