export type Role = "ADMIN" | "LEARNER";
export type Status = "ENABLED" | "DISABLED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  percentWatched?: number;
}

export interface UserStats {
  total: number;
  active: number;
  disabled: number;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
