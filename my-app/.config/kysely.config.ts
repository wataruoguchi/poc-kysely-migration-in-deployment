import { defineConfig } from "kysely-ctl";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { z } from "zod";

const getEnv = () =>
  z
    .object({
      PGHOST: z.string(),
      PGPORT: z.coerce.number(),
      PGDATABASE: z.string(),
      PGUSER: z.string(),
      PGPASSWORD: z.string(),
    })
    .parse(process.env);

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
