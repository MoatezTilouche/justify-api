"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_WIDTH = void 0;
exports.justifyParagraph = justifyParagraph;
exports.justifyText = justifyText;
exports.LINE_WIDTH = 80;
function normalizeSpaces(input) {
    const paragraphs = input.replace(/\r\n?/g, "\n").split(/\n{2,}/);
    const normalized = paragraphs.map(p => p.trim().replace(/\s+/g, " "));
    return normalized.join("\n\n");
}
function justifyLine(words, width) {
    if (words.length === 1)
        return words[0].padEnd(width, " ");
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const totalSpaces = width - totalChars;
    const gaps = words.length - 1;
    const base = Math.floor(totalSpaces / gaps);
    let extra = totalSpaces % gaps;
    let line = "";
    for (let i = 0; i < words.length; i++) {
        line += words[i];
        if (i < words.length - 1) {
            const spaces = base + (extra > 0 ? 1 : 0);
            if (extra > 0)
                extra--;
            line += " ".repeat(spaces);
        }
    }
    return line;
}
function justifyParagraph(paragraph, width = exports.LINE_WIDTH) {
    if (!paragraph.trim())
        return "";
    const words = paragraph.split(" ").filter(Boolean);
    const lines = [];
    let lineWords = [];
    let lineLen = 0;
    for (const word of words) {
        if (lineWords.length === 0) {
            lineWords.push(word);
            lineLen = word.length;
        }
        else {
            if (lineLen + 1 + word.length <= width) {
                lineWords.push(word);
                lineLen += 1 + word.length;
            }
            else {
                lines.push(justifyLine(lineWords, width));
                lineWords = [word];
                lineLen = word.length;
            }
        }
    }
    if (lineWords.length > 0)
        lines.push(lineWords.join(" "));
    // Last line of a paragraph should be left-aligned (single spaces, no padding)
    if (lines.length === 0)
        return "";
    if (lines.length === 1)
        return lines[0].trimEnd();
    const lastLine = lines.pop();
    return lines.join("\n") + "\n" + lastLine;
}
function justifyText(input, width = exports.LINE_WIDTH) {
    const normalized = normalizeSpaces(input);
    const paragraphs = normalized.split(/\n{2,}/);
    const out = paragraphs.map(p => justifyParagraph(p, width));
    return out.join("\n\n");
}
//# sourceMappingURL=justify.js.map