import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import { mentors } from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateMentorInput } from '@bookit/shared';

@Injectable()
export class MentorsService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<any>) {}

  /** Retrieve all mentors for a specific user */
  async getMentors(userId: string) {
    return this.db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, userId))
      .orderBy(desc(mentors.createdAt));
  }

  /** Add a new mentor */
  async addMentor(userId: string, data: CreateMentorInput) {
    const [mentor] = await this.db
      .insert(mentors)
      .values({
        userId,
        name: data.name,
        company: data.company,
        role: data.role,
        email: data.email,
      })
      .returning();

    return mentor;
  }
}
