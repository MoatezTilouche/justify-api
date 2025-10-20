"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const DATA_DIR = process.env.DATA_DIR || (0, path_1.join)(process.cwd(), "data");
const TOKENS_FILE = (0, path_1.join)(DATA_DIR, "tokens.json");
const USAGE_FILE = (0, path_1.join)(DATA_DIR, "usage.json");
function ensureFiles() {
    if (!(0, fs_1.existsSync)(DATA_DIR))
        (0, fs_1.mkdirSync)(DATA_DIR, { recursive: true });
    if (!(0, fs_1.existsSync)(TOKENS_FILE))
        (0, fs_1.writeFileSync)(TOKENS_FILE, "[]", "utf8");
    if (!(0, fs_1.existsSync)(USAGE_FILE))
        (0, fs_1.writeFileSync)(USAGE_FILE, "[]", "utf8");
}
function readJSON(file) {
    ensureFiles();
    return JSON.parse((0, fs_1.readFileSync)(file, "utf8"));
}
function writeJSON(file, data) {
    ensureFiles();
    (0, fs_1.writeFileSync)(file, JSON.stringify(data, null, 2), "utf8");
}
exports.Storage = {
    addToken(email, token) {
        const tokens = readJSON(TOKENS_FILE);
        const record = { token, email, createdAt: new Date().toISOString() };
        tokens.push(record);
        writeJSON(TOKENS_FILE, tokens);
        return record;
    },
    getToken(token) {
        const tokens = readJSON(TOKENS_FILE);
        return tokens.find(t => t.token === token);
    },
    getUsage(token, date) {
        const usage = readJSON(USAGE_FILE);
        return usage.find(u => u.token === token && u.date === date);
    },
    addUsage(token, date, words) {
        const usage = readJSON(USAGE_FILE);
        const existing = usage.find(u => u.token === token && u.date === date);
        if (existing)
            existing.words += words;
        else
            usage.push({ token, date, words });
        writeJSON(USAGE_FILE, usage);
        return usage.find(u => u.token === token && u.date === date);
    },
};
//# sourceMappingURL=storage.js.map