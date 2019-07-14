/**
 * Used by @see NodeWriter objects to write text.
 */
export abstract class TextWriter {
  public newLine(): void {
    this.writeMarkup("\n")
  }

  /**
   * Writes inline text content. Collapses whitespace as needed.
   * Begins an inline formatting context.
   * @see beginBlock
   * See https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#inline-formatting
   */
  public abstract writeTextContent(content: string): void

  /**
   * Writes markup used to control/influence visual rendering.
   * Any automatic white-space handling applied to text content (such as collapsing consecutive whitespace characters) is *not* applied.
   */
  public abstract writeMarkup(markup: string): void
}
