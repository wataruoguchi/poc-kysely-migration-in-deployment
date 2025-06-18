import { serve } from "@hono/node-server";
import { getApp } from "./app.js";
import { getDb } from "./infrastructure/database.js";
import { env } from "./shared/env.js";

serve(
  {
    fetch: getApp(getDb()).fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
