import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  quoteTweet: text('quote_tweet').notNull(),
  xUsername: text('x_username').notNull(),
  evmAddress: text('evm_address').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

const schema = z.object({
  quoteTweet: z.string().url(),
  xUsername: z.string().min(1),
  evmAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export async function onRequestPost(context: any) {
  const { env, request } = context;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const sql = neon(env.DATABASE_URL);
    const db = drizzle(sql);

    const [result] = await db.insert(applications).values(data).returning();

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: 'Validation failed', errors: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}