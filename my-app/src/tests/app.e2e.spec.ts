import { faker } from "@faker-js/faker";
import type { Hono } from "hono";
import { getApp } from "../app.js";
import { getTestDb, type TestDb } from "../dev-tools/test-db.js";

describe("app", () => {
  let testDb: TestDb;
  let app: Hono;
  let accounts: { id: string; name: string | null }[];

  beforeAll(async () => {
    testDb = await getTestDb("app-spec");
    accounts = Array.from({ length: 10 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
    }));
    await testDb
      .insertInto("accounts")
      .values(accounts)
      .returningAll()
      .execute();
    app = getApp(testDb);
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  describe("app", () => {
    describe("GET /accounts", () => {
      test("should return all accounts", async () => {
        const res = await app.request("/accounts");
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(JSON.parse(JSON.stringify(accounts)));
      });
    });

    describe("GET /healthz", () => {
      test("should return healthz", async () => {
        const res = await app.request("/healthz");
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual({
          dbRevision: expect.any(String),
        });
        expect(json.dbRevision).toMatch(/^\d{13}$/);
      });
    });
  });
});
