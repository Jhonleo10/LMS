"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { VideoCardSkeleton } from "@/components/ui/Skeleton";
import { VideoItem } from "@/types";

const emptyForm = {
  title: "",
  description: "",
  url: "",
  thumbnail: "",
  category: "",
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error();
      setVideos(await res.json());
    } catch {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (video: VideoItem) => {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail: video.thumbnail,
      category: video.category || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editing ? `/api/videos/${editing.id}` : "/api/videos";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: form.category || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(data.details).forEach(([k, v]) => {
            if (Array.isArray(v) && v[0]) fieldErrors[k] = v[0];
          });
          setFormErrors(fieldErrors);
        } else {
          toast.error(data.error || "Failed to save video");
        }
        return;
      }

      if (editing) {
        setVideos((vs) => vs.map((v) => (v.id === editing.id ? data : v)));
        toast.success("Video updated");
      } else {
        setVideos((vs) => [...vs, data]);
        toast.success("Video created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save video");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (video: VideoItem) => {
    const next = !video.published;
    setVideos((vs) =>
      vs.map((v) => (v.id === video.id ? { ...v, published: next } : v))
    );
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(next ? "Video published" : "Video unpublished");
    } catch {
      setVideos((vs) =>
        vs.map((v) => (v.id === video.id ? { ...v, published: !next } : v))
      );
      toast.error("Failed to update publish status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVideos((vs) => vs.filter((v) => v.id !== id));
      toast.success("Video deleted");
    } catch {
      toast.error("Failed to delete video");
    }
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Videos</h1>
          <p className="text-muted">Manage your video library</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-border p-16 text-center">
          <p className="text-muted mb-4">No videos in the library yet</p>
          <Button onClick={openCreate}>Add your first video</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="ait-card overflow-hidden group hover:shadow-[var(--card-shadow-hover)] transition-shadow duration-200"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    video.published
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {video.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 truncate text-[var(--ink)]">{video.title}</h3>
                <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">
                  {video.description}
                </p>
                {video.category && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[rgba(255,107,71,0.12)] text-[var(--coral-deep)] mb-3 inline-block">
                    {video.category}
                  </span>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={video.published ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleTogglePublish(video)}
                  >
                    {video.published ? (
                      <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                    ) : (
                      <><Eye className="h-3.5 w-3.5" /> Publish</>
                    )}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(video)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(video.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Video" : "Add Video"}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={formErrors.title}
          />
          <Textarea
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={formErrors.description}
          />
          <Input
            label="Video URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            error={formErrors.url}
            placeholder="https://..."
          />
          <Input
            label="Thumbnail URL"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            error={formErrors.thumbnail}
            placeholder="https://..."
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Development"
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              {editing ? "Save Changes" : "Create Video"}
            </Button>
          </div>
        </form>
      </Dialog>
    </PageTransition>
  );
}
