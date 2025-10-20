import { justifyText } from "../src/justify";

describe("justifyText", () => {
  it("should justify text to 80 chars per line", () => {
    const input = "Bonjour à tous. Ceci est un test de justification automatique du texte.";
    const output = justifyText(input, 80);
    const lines = output.split("\n");
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(80);
    }
  });

  it("should preserve paragraphs", () => {
    const input = "Paragraphe 1.\n\nParagraphe 2.";
    const output = justifyText(input, 80);
    expect(output.split("\n\n").length).toBe(2);
  });
});
