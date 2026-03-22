import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { users, timeSlots } from './schema';

// Load environment variables
dotenv.config({ path: '../../.env' });

/**
 * Database seed script.
 * Creates a demo user and generates time slots for the next 30 days.
 * 
 * Run with: pnpm --filter @bookit/api db:seed
 */
async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log('🌱 Seeding database...');

  // --- Create demo user ---
  const passwordHash = await bcrypt.hash('password123', 10);
  const [demoUser] = await db
    .insert(users)
    .values({
      email: 'demo@bookit.com',
      passwordHash,
      name: 'Alex Carter',
      title: 'Senior Product Designer',
      bio: 'Passionate about building intuitive digital experiences and mentoring early-career designers. Specializing in high-end editorial interfaces and precision systems.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc-wNDBAh0042iYNIBujRess92P8u_JoGXaR31fQGYnHMlTyctiq9aIfwuJZKxTDQXq6evWeX4pEWQJTPA6vPaxD2C04KBsbFUlvjVa_65hvrafFyyWw3j6sqae53OKIoqxJzPDEE398HXEohRiPb6wv1_gFikx61AsR_jjOs3r2Rfd3hmjWxt5qeixDGIxEiDMqbx0XCS3ruliqp5Iw9NdF2CL9gpDs-zZxDfPv9gvqq0vevHJteO7Lfg8_5uhOBRD-bSpVCYGA',
    })
    .returning()
    .onConflictDoNothing();

  if (demoUser) {
    console.log(`✅ Created demo user: ${demoUser.email}`);
  } else {
    console.log('ℹ️  Demo user already exists, skipping...');
  }

  // --- Generate time slots for the next 30 days ---
  const slots: Array<{
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
  }> = [];

  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Generate hourly slots from 9 AM to 5 PM (last slot starts at 4 PM)
    for (let hour = 9; hour <= 16; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

      slots.push({
        date: dateStr,
        startTime,
        endTime,
        duration: 60,
      });
    }
  }

  if (slots.length > 0) {
    // Batch insert in chunks to avoid hitting parameter limits
    const chunkSize = 100;
    for (let i = 0; i < slots.length; i += chunkSize) {
      const chunk = slots.slice(i, i + chunkSize);
      await db.insert(timeSlots).values(chunk).onConflictDoNothing();
    }
    console.log(`✅ Created ${slots.length} time slots for the next 30 days`);
  }

  console.log('🎉 Seeding complete!');
  await pool.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
