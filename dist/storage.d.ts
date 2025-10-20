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
export declare const Storage: {
    addToken(email: string, token: string): TokenRecord;
    getToken(token: string): TokenRecord | undefined;
    getUsage(token: string, date: string): UsageRecord | undefined;
    addUsage(token: string, date: string, words: number): UsageRecord;
};
export {};
//# sourceMappingURL=storage.d.ts.map