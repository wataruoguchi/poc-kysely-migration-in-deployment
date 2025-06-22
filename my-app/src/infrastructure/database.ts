import { Kysely, Migrator } from "kysely";
import type { DB } from "kysely-codegen";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { getEnv } from "../shared/env.js";
import { ESMFileMigrationProvider } from "./kysely/ESMFileMigrationProvider.js";

const sql = postgres({
  host: getEnv().PGHOST,
  port: getEnv().PGPORT,
  database: getEnv().PGDATABASE,
  username: getEnv().PGUSER,
  password: getEnv().PGPASSWORD,
});

export const dialect = new PostgresJSDialect({
  postgres: sql,
});

export function connectDb(name?: string): DBClient {
  return new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: postgres({
        host: getEnv().PGHOST,
        port: getEnv().PGPORT,
        database: name ?? getEnv().PGDATABASE,
        username: getEnv().PGUSER,
        password: getEnv().PGPASSWORD,
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
