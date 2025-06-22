import { defineConfig } from "kysely-ctl";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { getEnv } from "../src/shared/env.js";

const sql = postgres({
  host: getEnv().PGHOST,
  port: getEnv().PGPORT,
  database: getEnv().PGDATABASE,
  username: getEnv().PGUSER,
  password: getEnv().PGPASSWORD,
});

const dialect = new PostgresJSDialect({
  postgres: postgres({
    host: getEnv().PGHOST,
    port: getEnv().PGPORT,
    database: getEnv().PGDATABASE,
    username: getEnv().PGUSER,
    password: getEnv().PGPASSWORD,
  }),
});

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "db/migrations",
  },
  //   plugins: [],
  seeds: {
    seedFolder: "db/seeds",
  },
});
