import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MentorsService } from './mentors.service';
import { createMentorSchema } from '@bookit/shared';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@Controller('mentors')
@UseGuards(JwtAuthGuard)
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  async getMentors(@Request() req: { user: { id: string } }) {
    return this.mentorsService.getMentors(req.user.id);
  }

  @Post()
  async addMentor(
    @Request() req: { user: { id: string } },
    @Body(new ZodValidationPipe(createMentorSchema)) body: any
  ) {
    return this.mentorsService.addMentor(req.user.id, body);
  }
}
