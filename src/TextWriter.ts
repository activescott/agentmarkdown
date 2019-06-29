import { normalizeWhitespace, WhitespaceHandling } from "./css"

export enum BlockType {
  /**
   * Indicates a default CSS block box.
   * See https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#display-prop
   */
  default,
  /**
   * Begins `list-item` block box that CSS recognizes as a special type of block.
   * See https://www.w3.org/TR/2011/REC-CSS2-20110607/generate.html#lists and https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#display-prop
   */
  listItem
}

/**
 * Used by @see NodeWriter objects to write text.
 */
export abstract class TextWriter {
  /**
   * Writes inline text content. Collapses whitespace as needed.
   * Begins an inline formatting context.
   * @see beginBlock
   * See https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#inline-formatting
   */
  abstract writeTextContent(content: string): void

  /**
   * Writes markup used to control/influence visual rendering.
   * Any automatic white-space handling applied to text content (such as collapsing consecutive whitespace characters) is *not* applied.
   */
  abstract writeMarkup(markup: string): void

  newLine(): void {
    this.writeMarkup("\n")
  }
}

// TODO: This could be made fast by creating a resizing facade on Uint8Array or via https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
export class DefaultTextWriter extends TextWriter {
  private output: string = ""

  constructor() {
    super()
  }

  writeTextContent(content: string): void {
    if (!content) {
      return
    }
    this.output += content
  }

  writeMarkup(markup: string): void {
    this.output += markup
  }

  toString(): string {
    return this.output
  }
}
