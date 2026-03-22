import { Controller, Post, Patch, Body, HttpCode, HttpStatus, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema, updateProfileSchema, updatePasswordSchema } from '@bookit/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { JwtAuthGuard } from './jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Authentication controller.
 * Provides login and registration endpoints.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   * Authenticates a user and returns a JWT token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema))
    body: { email: string; password: string },
  ) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * POST /api/auth/register
   * Creates a new user account and returns a JWT token.
   */
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema))
    body: { email: string; password: string; name: string },
  ) {
    return this.authService.register(body.email, body.password, body.name);
  }

  /**
   * PATCH /api/auth/profile
   * Updates the authenticated user's profile.
   * Triggering reload for schema update...
   */
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Body(new ZodValidationPipe(updateProfileSchema)) body: any,
    @Request() req: { user: { id: string } },
  ) {
    return this.authService.updateProfile(req.user.id, body);
  }

  /**
   * PATCH /api/auth/password
   * Updates the authenticated user's password.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @Body(new ZodValidationPipe(updatePasswordSchema)) body: any,
    @Request() req: { user: { id: string } },
  ) {
    await this.authService.updatePassword(req.user.id, body.currentPassword, body.newPassword);
    return { success: true };
  }

  /**
   * POST /api/auth/avatar
   * Uploads an avatar image for the authenticated user.
   */
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(__dirname, '../../../../apps/web/public/uploads');
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  }))
  async uploadAvatar(
    @UploadedFile() file: any,
    @Request() req: { user: { id: string } },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const avatarUrl = `/uploads/${file.filename}`;
    await this.authService.updateProfile(req.user.id, { avatarUrl });
    
    return { avatarUrl };
  }
}
