import { z } from 'zod';

// ============================================
// Authentication Schemas
// ============================================

/** Schema for user login request */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/** Schema for user registration request */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100),
});

/** Schema for updating user profile */
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  title: z.string().max(100).nullable().optional(),
  bio: z.string().max(2000).nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/** Schema for updating user password */
export const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

/** Schema for a user profile */
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});

/** Schema for authentication response (login/register) */
export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});

// ============================================
// Inferred TypeScript types
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
