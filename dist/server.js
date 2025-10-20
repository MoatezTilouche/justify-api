"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const justify_1 = require("./justify");
const storage_1 = require("./storage");
const middleware_1 = require("./middleware");
const date_1 = require("./utils/date");
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const DAILY_LIMIT = 80000;
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/api/justify", express_1.default.text({ type: "text/plain", limit: "5mb" }));
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.post("/api/token", (req, res) => {
    const email = req.body?.email;
    if (!email || typeof email !== "string")
        return res.status(400).json({ error: "Missing or invalid { email }" });
    const token = crypto_1.default.randomUUID().replace(/-/g, "");
    storage_1.Storage.addToken(email, token);
    res.status(201).json({ token });
});
app.post("/api/justify", middleware_1.authMiddleware, (req, res) => {
    if (typeof req.body !== "string")
        return res.status(415).json({ error: "Content-Type must be text/plain" });
    const token = req.token;
    const today = (0, date_1.yyyymmddUTC)();
    const text = req.body;
    const words = (text.match(/\b\w+\b/g) || []).length;
    const used = storage_1.Storage.getUsage(token, today)?.words ?? 0;
    if (used + words > DAILY_LIMIT)
        return res.status(402).json({
            error: "Payment Required",
            message: `Daily quota exceeded: ${used + words} > ${DAILY_LIMIT} words`,
        });
    const justified = (0, justify_1.justifyText)(text, justify_1.LINE_WIDTH);
    storage_1.Storage.addUsage(token, today, words);
    res.type("text/plain").send(justified);
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map