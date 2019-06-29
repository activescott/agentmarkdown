import { normalizeWhitespace, WhitespaceHandling } from "../../src/css"

/**
 * The goal of these tests is to cover whitespace collapsing and block formatting contexts.
 * - Ensure any extra whitespace is removed according to CSS rules: https://www.w3.org/TR/CSS2/text.html#white-space-model
 * - ensure necessary whitespace is preserved:
 *   - preserve non-breaking spaces
 *   - preserve any space characters that cannot be collapsed
 *   - preserve whitespace in a pre/code context
 * - Ensure block formatting context creates a newline to render block elements vertically: https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#block-formatting
 *   - But not *extra* unnecessary newlines.
 */

describe("whitespace handling", () => {
  describe("https://www.w3.org/TR/CSS2/text.html#white-space-model", () => {
    it("Step 1.", async () => {
      //  Each tab (U+0009), carriage return (U+000D), or space (U+0020) character surrounding a linefeed (U+000A) character is removed if 'white-space' is set to 'normal', 'nowrap', or 'pre-line'.
      expect(
        normalizeWhitespace("two\n    ", WhitespaceHandling.normal)
      ).toMatch(/^two $/)
      expect(
        normalizeWhitespace("\n  three", WhitespaceHandling.normal)
      ).toMatch(/^ three$/)
    })

    it.skip("Step 2.", async () => {
      // If 'white-space' is set to 'pre' or 'pre-wrap', any sequence of spaces (U+0020) unbroken by an element boundary is treated as a sequence of non-breaking spaces. However, for 'pre-wrap', a line breaking opportunity exists at the end of the sequence.
      throw "todo"
    })

    it.skip("Step 3.", async () => {
      // If 'white-space' is set to 'normal' or 'nowrap', linefeed characters are transformed for rendering purpose into one of the following characters: a space character, a zero width space character (U+200B), or no character (i.e., not rendered), according to UA-specific algorithms based on the content script.
      throw "todo"
    })

    it.skip("Step 4.", async () => {
      /**
       * If 'white-space' is set to 'normal', 'nowrap', or 'pre-line',
       * 1. every tab (U+0009) is converted to a space (U+0020)
       * 2. any space (U+0020) following another space (U+0020) — even a space before the inline, if that space also has 'white-space' set to 'normal', 'nowrap' or 'pre-line' — is removed.
       */
      throw "todo"
    })
  })
})
