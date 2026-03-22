import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '../../.env' });

/**
 * Drops all tables and custom types from the bookit database.
 * Used to reset the DB before applying a fresh schema.
 */
async function reset() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  console.log('🗑️  Dropping all tables...');
  await pool.query(`
    DROP TABLE IF EXISTS bookings CASCADE;
    DROP TABLE IF EXISTS time_slots CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TYPE IF EXISTS booking_status CASCADE;
  `);
  
  console.log('✅ Database reset complete!');
  await pool.end();
}

reset().catch((err) => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});
