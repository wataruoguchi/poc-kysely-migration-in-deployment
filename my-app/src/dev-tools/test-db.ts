import { Migrator, sql } from "kysely";
import { connectDb, getDb, type DBClient } from "../infrastructure/database.js";
import { ESMFileMigrationProvider } from "../infrastructure/kysely/ESMFileMigrationProvider.js";

export type TestDb = DBClient;
export async function getTestDb(name = "test"): Promise<TestDb> {
  // connect to default db
  const db = getDb();
  // drop database and recreate it
  await sql`DROP DATABASE IF EXISTS ${sql.id(name)}`.execute(db);
  await sql`CREATE DATABASE ${sql.id(name)}`.execute(db);
  // disconnect from default db
  await db.destroy();

  // connect to test db
  const testDb = connectDb(name);
  // run migrations
  const migrator = new Migrator({
    db: testDb,
    provider: new ESMFileMigrationProvider("../../../db/migrations"),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Error") {
      console.error(`Migration ${it.migrationName} failed`);
    }
  });

  if (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  return testDb;
}
