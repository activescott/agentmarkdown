/**
 * Normalizes the specified text according to CSS 2.1, section 16.6.1 "The 'white-space' processing model" and returns the normalized text.
 * See see https://www.w3.org/TR/CSS2/text.html#white-space-model
 * @param text The input to normalize
 */
export function normalizeWhitespace(
  text: string,
  whitespace: WhitespaceHandling = WhitespaceHandling.normal
): string {
  let normalized = text
  // Step 1. Each tab (U+0009), carriage return (U+000D), or space (U+0020) character surrounding a linefeed (U+000A) character is removed if 'white-space' is set to 'normal', 'nowrap', or 'pre-line'.
  if (
    whitespace == WhitespaceHandling.normal ||
    whitespace == WhitespaceHandling.nowrap ||
    whitespace == WhitespaceHandling.preline
  ) {
    normalized = normalized.replace(/[\t\r ]*\n[\t\r ]*/g, "\n")
  }
  // Step 2. If 'white-space' is set to 'pre' or 'pre-wrap', any sequence of spaces (U+0020) unbroken by an element boundary is treated as a sequence of non-breaking spaces. However, for 'pre-wrap', a line breaking opportunity exists at the end of the sequence.
  if (
    whitespace == WhitespaceHandling.pre ||
    whitespace == WhitespaceHandling.prewrap
  ) {
    // TODO: ?
  }
  // Step 3. If 'white-space' is set to 'normal' or 'nowrap', linefeed characters are transformed for rendering purpose into one of the following characters: a space character, a zero width space character (U+200B), or no character (i.e., not rendered), according to UA-specific algorithms based on the content script.
  if (
    whitespace == WhitespaceHandling.normal ||
    whitespace == WhitespaceHandling.nowrap
  ) {
    // if there are only LF chars, reaplce them with "no character":
    if (Array.prototype.every.call(normalized, ch => ch === "\n")) {
      normalized = ""
    }
    // if there are some LF chars in the midst of other text, just turn them into spaces:
    normalized = normalized.replace(/\n/g, " ")
  }
  // Step 4. If 'white-space' is set to 'normal', 'nowrap', or 'pre-line',
  if (
    whitespace == WhitespaceHandling.normal ||
    whitespace == WhitespaceHandling.nowrap ||
    whitespace == WhitespaceHandling.preline
  ) {
    // Step 4.1 every tab (U+0009) is converted to a space (U+0020)
    normalized = normalized.replace(/\t/g, " ")
    // Step 4.2 any space (U+0020) following another space (U+0020) — even a space before the inline, if that space also has 'white-space' set to 'normal', 'nowrap' or 'pre-line' — is removed.
    normalized = normalized.replace(/\s{2,}/g, " ")
  }
  return normalized
}

export enum WhitespaceHandling {
  normal,
  pre,
  nowrap,
  prewrap,
  preline
}
