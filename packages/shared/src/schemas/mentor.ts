import { z } from 'zod';

// ============================================
// Mentor Schemas
// ============================================

/** Schema for a created mentor record */
export const mentorSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  company: z.string().min(1, 'Company is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  createdAt: z.string(),
});

/** Schema for creating a new mentor */
export const createMentorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  company: z.string().min(1, 'Company is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  email: z.string().email('Invalid email address').max(255),
});

export type Mentor = z.infer<typeof mentorSchema>;
export type CreateMentorInput = z.infer<typeof createMentorSchema>;
