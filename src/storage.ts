import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), "data");
const TOKENS_FILE = join(DATA_DIR, "tokens.json");
const USAGE_FILE = join(DATA_DIR, "usage.json");

function ensureFiles() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(TOKENS_FILE)) writeFileSync(TOKENS_FILE, "[]", "utf8");
  if (!existsSync(USAGE_FILE)) writeFileSync(USAGE_FILE, "[]", "utf8");
}

function readJSON<T>(file: string): T {
  ensureFiles();
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function writeJSON<T>(file: string, data: T) {
  ensureFiles();
  writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

interface TokenRecord {
  token: string;
  email: string;
  createdAt: string;
}

interface UsageRecord {
  token: string;
  date: string;
  words: number;
}

export const Storage = {
  addToken(email: string, token: string): TokenRecord {
    const tokens = readJSON<TokenRecord[]>(TOKENS_FILE);
    const record = { token, email, createdAt: new Date().toISOString() };
    tokens.push(record);
    writeJSON(TOKENS_FILE, tokens);
    return record;
  },

  getToken(token: string): TokenRecord | undefined {
    const tokens = readJSON<TokenRecord[]>(TOKENS_FILE);
    return tokens.find(t => t.token === token);
  },

  getUsage(token: string, date: string): UsageRecord | undefined {
    const usage = readJSON<UsageRecord[]>(USAGE_FILE);
    return usage.find(u => u.token === token && u.date === date);
  },

  addUsage(token: string, date: string, words: number): UsageRecord {
    const usage = readJSON<UsageRecord[]>(USAGE_FILE);
    const existing = usage.find(u => u.token === token && u.date === date);
    if (existing) existing.words += words;
    else usage.push({ token, date, words });
    writeJSON(USAGE_FILE, usage);
    return usage.find(u => u.token === token && u.date === date)!;
  },
};
