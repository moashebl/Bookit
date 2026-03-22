import { z } from 'zod';
/** Schema for user login request */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
/** Schema for user registration request */
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
/** Schema for updating user profile */
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    title?: string | null | undefined;
    bio?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}, {
    name?: string | undefined;
    title?: string | null | undefined;
    bio?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
/** Schema for updating user password */
export declare const updatePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
/** Schema for a user profile */
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    id: string;
    createdAt: string;
    title?: string | null | undefined;
    bio?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}, {
    email: string;
    name: string;
    id: string;
    createdAt: string;
    title?: string | null | undefined;
    bio?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}>;
/** Schema for authentication response (login/register) */
export declare const authResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        id: string;
        createdAt: string;
        title?: string | null | undefined;
        bio?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }, {
        email: string;
        name: string;
        id: string;
        createdAt: string;
        title?: string | null | undefined;
        bio?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    user: {
        email: string;
        name: string;
        id: string;
        createdAt: string;
        title?: string | null | undefined;
        bio?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    };
}, {
    accessToken: string;
    user: {
        email: string;
        name: string;
        id: string;
        createdAt: string;
        title?: string | null | undefined;
        bio?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    };
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
//# sourceMappingURL=auth.d.ts.map