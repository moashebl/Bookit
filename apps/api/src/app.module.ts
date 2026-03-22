import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { MentorsModule } from './mentors/mentors.module';

/**
 * Root application module.
 * Imports all feature modules and configures global providers.
 */
@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    AuthModule,
    BookingsModule,
    MentorsModule,
  ],
})
export class AppModule {}
