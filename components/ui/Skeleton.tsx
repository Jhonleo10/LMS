import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-surface-hover",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface border border-border p-6">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-7 w-12 rounded-full" />
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
