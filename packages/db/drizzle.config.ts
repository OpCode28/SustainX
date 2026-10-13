import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from backend/.env or root/.env
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });
dotenv.config({ path: path.resolve(__dirname, './.env') });

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:9752%40ISKLh@localhost:5432/sustainx_db';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
