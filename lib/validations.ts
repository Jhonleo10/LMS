import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["LEARNER"]).default("LEARNER"),
});

export const updateUserSchema = z.object({
  status: z.enum(["ENABLED", "DISABLED"]).optional(),
  role: z.enum(["ADMIN", "LEARNER"]).optional(),
});

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Please enter a valid URL"),
  thumbnail: z.string().url("Please enter a valid thumbnail URL"),
  category: z.string().optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const progressSchema = z.object({
  percentWatched: z.number().int().min(0).max(100),
});
