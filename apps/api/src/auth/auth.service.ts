import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import type { AuthResponse } from '@bookit/shared';

/**
 * Authentication service.
 * Handles user registration, login, and JWT token generation.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user.
   * Hashes the password with bcrypt and creates a JWT token.
   *
   * @throws ConflictException if email is already registered
   */
  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('Email already registered');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const [newUser] = await this.db
      .insert(schema.users)
      .values({ email, passwordHash, name })
      .returning();

    // Generate JWT token
    const accessToken = this.generateToken(newUser.id, newUser.email);

    return {
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        title: newUser.title,
        bio: newUser.bio,
        avatarUrl: newUser.avatarUrl,
        createdAt: newUser.createdAt.toISOString(),
      },
    };
  }

  /**
   * Updates a user's profile information.
   * Returns the updated user data.
   */
  async updateProfile(userId: string, data: { name?: string; title?: string | null; bio?: string | null; avatarUrl?: string | null; }): Promise<AuthResponse['user']> {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      title: updatedUser.title,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
      createdAt: updatedUser.createdAt.toISOString(),
    };
  }

  /**
   * Updates a user's password.
   * Verifies the current password before applying the new one.
   */
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect current password');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.id, userId));
  }

  /**
   * Authenticates a user by email and password.
   * Returns a JWT token on success.
   *
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user by email
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const accessToken = this.generateToken(user.id, user.email);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        title: user.title,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  /**
   * Finds a user by their ID.
   * Used by the JWT strategy to validate token payloads.
   */
  async findUserById(userId: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    return user || null;
  }

  /** Generates a signed JWT token with user ID and email as payload */
  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
