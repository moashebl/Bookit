import { z } from 'zod';
/** Schema for a created mentor record */
export declare const mentorSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    company: z.ZodString;
    role: z.ZodString;
    email: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    name: string;
    company: string;
    role: string;
    email: string;
    createdAt: string;
}, {
    id: string;
    userId: string;
    name: string;
    company: string;
    role: string;
    email: string;
    createdAt: string;
}>;
/** Schema for creating a new mentor */
export declare const createMentorSchema: z.ZodObject<{
    name: z.ZodString;
    company: z.ZodString;
    role: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    company: string;
    role: string;
    email: string;
}, {
    name: string;
    company: string;
    role: string;
    email: string;
}>;
export type Mentor = z.infer<typeof mentorSchema>;
export type CreateMentorInput = z.infer<typeof createMentorSchema>;
//# sourceMappingURL=mentor.d.ts.map