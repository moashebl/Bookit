"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResponseSchema = exports.userSchema = exports.updatePasswordSchema = exports.updateProfileSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// ============================================
// Authentication Schemas
// ============================================
/** Schema for user login request */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
/** Schema for user registration request */
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(1, 'Name is required').max(100),
});
/** Schema for updating user profile */
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100).optional(),
    title: zod_1.z.string().max(100).nullable().optional(),
    bio: zod_1.z.string().max(2000).nullable().optional(),
    avatarUrl: zod_1.z.string().nullable().optional(),
});
/** Schema for updating user password */
exports.updatePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
/** Schema for a user profile */
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    title: zod_1.z.string().nullable().optional(),
    bio: zod_1.z.string().nullable().optional(),
    avatarUrl: zod_1.z.string().nullable().optional(),
    createdAt: zod_1.z.string(),
});
/** Schema for authentication response (login/register) */
exports.authResponseSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    user: exports.userSchema,
});
//# sourceMappingURL=auth.js.map