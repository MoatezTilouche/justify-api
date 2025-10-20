"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yyyymmddUTC = yyyymmddUTC;
function yyyymmddUTC(date = new Date()) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
//# sourceMappingURL=date.js.map