import { Hono } from "hono";
import {
  getCurrentDbRevision,
  type DBClient,
} from "./infrastructure/database.js";
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
      const healthzPayload = healthz(await getCurrentDbRevision(db));
      return c.json(healthzPayload);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  });

  return app;
}

export { getApp };
