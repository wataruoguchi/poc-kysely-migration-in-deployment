import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { getEnv } from "../shared/env.js";
import type { DB } from "./db.d.ts";

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
