"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMentorSchema = exports.mentorSchema = void 0;
const zod_1 = require("zod");
// ============================================
// Mentor Schemas
// ============================================
/** Schema for a created mentor record */
exports.mentorSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    company: zod_1.z.string().min(1, 'Company is required').max(100),
    role: zod_1.z.string().min(1, 'Role is required').max(100),
    email: zod_1.z.string().email('Invalid email address').max(255),
    createdAt: zod_1.z.string(),
});
/** Schema for creating a new mentor */
exports.createMentorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    company: zod_1.z.string().min(1, 'Company is required').max(100),
    role: zod_1.z.string().min(1, 'Role is required').max(100),
    email: zod_1.z.string().email('Invalid email address').max(255),
});
//# sourceMappingURL=mentor.js.map