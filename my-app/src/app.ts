import { Hono } from "hono";
import { type DBClient } from "./infrastructure/database.js";
import { healthz } from "./usecases/healthz.usecase.js";

function getApp(db: DBClient) {
  const app = new Hono();

  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });
  app.get("/accounts", async (c) => {
    const accounts = await db.selectFrom("accounts").selectAll().execute();
    return c.json(accounts);
  });
  app.get("/healthz", async (c) => {
    try {
      const dbMigrationName = await db
        .selectFrom("kysely_migration")
        .select("name")
        .executeTakeFirstOrThrow();
      const revision = (dbMigrationName?.name || "").split("_")[0];
      const healthzPayload = healthz(revision);
      return c.json(healthzPayload);
    } catch (e) {
      return c.json({ error: "Database connection failed" }, 500);
    }
  });

  return app;
}

export { getApp };
