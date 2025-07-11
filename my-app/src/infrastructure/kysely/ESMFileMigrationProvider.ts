import type { Migration, MigrationProvider } from "kysely";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// https://github.com/kysely-org/kysely/issues/277
export class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private relativePath: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const resolvedPath = path.resolve(__dirname, this.relativePath);
    const files = await fs.readdir(resolvedPath);
    if (files.length === 0) {
      throw new Error(`No migrations found in ${resolvedPath}`);
    }
    console.log(`Found ${files.length} migrations in ${resolvedPath}`);

    for (const fileName of files) {
      const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));

      // Use a helper function to resolve the import path for compatibility
      const migrationPath = path.join(resolvedPath, fileName);
      const migration = await import(migrationPath);
      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}
