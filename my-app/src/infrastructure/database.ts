import { Kysely, Migrator } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { getEnv } from "../shared/env.js";
import type { DB } from "./db.d.ts";
import { ESMFileMigrationProvider } from "./kysely/ESMFileMigrationProvider.js";

export function connectDb(name?: string): DBClient {
  const {
    PGHOST: host,
    PGPORT: port,
    PGDATABASE: database,
    PGUSER: username,
    PGPASSWORD: password,
  } = getEnv();

  return new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: postgres({
        host,
        port,
        database: name ?? database,
        username,
        password,
      }),
    }),
  });
}
export type DBClient = Kysely<DB>;

const db = connectDb();
export const getDb = (): DBClient => db;

export async function getCurrentDbRevision(db: DBClient) {
  const migrator = new Migrator({
    db,
    provider: new ESMFileMigrationProvider("../../../db/migrations"),
  });
  const migrations = await migrator.getMigrations();
  const currentVersion = (
    migrations.length > 0 ? migrations[migrations.length - 1].name : "0"
  ).split("_")[0];
  return currentVersion;
}
