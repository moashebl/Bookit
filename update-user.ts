import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { users } from './apps/api/src/database/schema';

dotenv.config({ path: './.env' });

async function update() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  await db.update(users)
    .set({
      name: 'Mohamed Alaa',
      title: 'Fullstack eng..',
      avatarUrl: '/Photo.jpg'
    })
    .where(eq(users.email, 'demo@bookit.com'));

  console.log('User updated successfully');
  await pool.end();
}

update().catch(console.error);
