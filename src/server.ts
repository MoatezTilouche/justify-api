import express from "express";
import crypto from "crypto";
import helmet from "helmet";
import morgan from "morgan";
import { justifyText, LINE_WIDTH } from "./justify";
import { Storage } from "./storage";
import { authMiddleware } from "./middleware";
import { yyyymmddUTC } from "./utils/date";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const DAILY_LIMIT = 80000;

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/justify", express.text({ type: "text/plain", limit: "5mb" }));

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.post("/api/token", (req, res) => {
  const email = req.body?.email;
  if (!email || typeof email !== "string")
    return res.status(400).json({ error: "Missing or invalid { email }" });
  const token = crypto.randomUUID().replace(/-/g, "");
  Storage.addToken(email, token);
  res.status(201).json({ token });
});

app.post("/api/justify", authMiddleware, (req, res) => {
  if (typeof req.body !== "string")
    return res.status(415).json({ error: "Content-Type must be text/plain" });

  const token = (req as any).token as string;
  const today = yyyymmddUTC();
  const text = req.body;
  const words = (text.match(/\b\w+\b/g) || []).length;
  const used = Storage.getUsage(token, today)?.words ?? 0;

  if (used + words > DAILY_LIMIT)
    return res.status(402).json({
      error: "Payment Required",
      message: `Daily quota exceeded: ${used + words} > ${DAILY_LIMIT} words`,
    });

  const justified = justifyText(text, LINE_WIDTH);
  Storage.addUsage(token, today, words);
  res.type("text/plain").send(justified);
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
