import { eq } from 'drizzle-orm';
import { db } from './db';
import { applications } from '@shared/schema';
import type { Application, InsertApplication } from '@shared/schema';

export class DatabaseStorage {
  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const [result] = await db
      .insert(applications)
      .values(insertApp)
      .returning();

    if (!result) throw new Error('Failed to insert application');
    return result;
  }

  async getApplicationByAddress(address: string): Promise<Application | null> {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.evmAddress, address))
      .limit(1);

    return result[0] ?? null;
  }
}

export const storage = new DatabaseStorage();
