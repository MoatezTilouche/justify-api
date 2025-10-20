import request from "supertest";
import express from "express";
import { Storage } from "../src/storage";
import { yyyymmddUTC } from "../src/utils/date";
import { authMiddleware } from "../src/middleware";
import { justifyText, LINE_WIDTH } from "../src/justify";

const app = express();
app.use(express.json());
app.use("/api/justify", express.text({ type: "text/plain" }));

app.post("/api/token", (req, res) => {
  const email = req.body?.email;
  if (!email) return res.status(400).json({ error: "Missing email" });
  const token = "testtoken";
  Storage.addToken(email, token);
  res.status(201).json({ token });
});

app.post("/api/justify", authMiddleware, (req, res) => {
  const text = req.body;
  const token = (req as any).token;
  const today = yyyymmddUTC();
  const words = (text.match(/\b\w+\b/g) || []).length;
  const used = Storage.getUsage(token, today)?.words ?? 0;
  if (used + words > 80000) return res.status(402).json({ error: "Payment Required" });
  const justified = justifyText(text, LINE_WIDTH);
  Storage.addUsage(token, today, words);
  res.type("text/plain").send(justified);
});

describe("API Endpoints", () => {
  it("should create a token", async () => {
    const res = await request(app)
      .post("/api/token")
      .send({ email: "foo@bar.com" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should justify text with valid token", async () => {
    const token = "tokentest";
    Storage.addToken("user@test.com", token);
    const res = await request(app)
      .post("/api/justify")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "text/plain")
      .send("Bonjour à tous, ceci est un test de justification automatique du texte.");
    expect(res.status).toBe(200);
    expect(res.text.length).toBeGreaterThan(0);
  });
});
