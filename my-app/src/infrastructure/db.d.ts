import type { DB as OriginalDB } from "kysely-codegen";

export type DB = OriginalDB & {
  kysely_migration: { name: string };
};
