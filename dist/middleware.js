"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const storage_1 = require("./storage");
function authMiddleware(req, res, next) {
    const token = req.header("Authorization")?.replace(/^Bearer\s+/, "");
    if (!token)
        return res.status(401).json({ error: "Missing Bearer token" });
    const record = storage_1.Storage.getToken(token);
    if (!record)
        return res.status(401).json({ error: "Invalid token" });
    req.token = token;
    next();
}
//# sourceMappingURL=middleware.js.map