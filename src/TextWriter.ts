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

  /**
   * Begins a block formatting context and introduces a newline to render the block vertically.
   * Remember to call @see endBlock to indicate the block is no longer rendering its contained/child content.
   * See https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#block-formatting
   * See https://www.w3.org/TR/2011/REC-CSS2-20110607/box.html#box-model
   * See https://spec.commonmark.org/0.29/#blocks-and-inlines
   */
  abstract beginBlock(blockType: BlockType): void

  /**
   * Signals the end of a block rendering that began with @see beginBlock
   */
  abstract endBlock(blockType: BlockType): void

  /**
   * Prevents collapsing sequences of white space in text content.
   * Call @see endPreformattedContext to end this behavior and return to normal whitespace collapsing behavior.
   * See https://www.w3.org/TR/CSS2/text.html#white-space-prop
   */
  abstract beginPreformattedContext(): void

  /**
   * Ends the prefomratted context started with @see beginPreformattedContext.
   */
  abstract endPreformattedContext(): void
}

const newLineSequence = "\n"
const indentSequence = "  "
// TODO: This could be made fast by creating a resizing facade on Uint8Array or via https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
export class DefaultTextWriter extends TextWriter {
  private output: string = ""
  private listItemNestingLevel: number = 0
  private readonly activeBlocks: Array<BlockType> = new Array<BlockType>()
  private whitespaceMode: WhitespaceHandling = WhitespaceHandling.normal

  constructor() {
    super()
  }

  writeTextContent(content: string): void {
    if (!content) {
      return
    }
    const normalized = normalizeWhitespace(content, this.whitespaceMode)
    this.output += normalized
  }

  writeMarkup(markup: string): void {
    this.output += markup
  }

  beginBlock(blockType: BlockType): void {
    this.activeBlocks.push(blockType)
    if (blockType === BlockType.listItem) {
      this.listItemNestingLevel++
    }
    if (this.output.length > 0) {
      // if this is the very begining of the content, don't insert a newline
      // TODO: SIMILARLY if two blocks are rendered back to back (because they're nested) we probably shouldn't allow this!
      this.output += newLineSequence
    }
    if (this.listItemNestingLevel > 1) {
      this.output += indentSequence.repeat(this.listItemNestingLevel - 1)
    }
  }

  endBlock(blockType: BlockType): void {
    if (this.activeBlocks.length == 0) {
      throw new Error("Cannot endBlock when one has not been started.")
    }
    const last: BlockType = this.activeBlocks.pop()
    if (last !== blockType) {
      throw new Error(
        `The last block started was '${last}, but attempting to end block of type '${blockType}`
      )
    }
    if (blockType === BlockType.listItem) {
      this.listItemNestingLevel++
    }
  }

  beginPreformattedContext(): void {
    this.whitespaceMode = WhitespaceHandling.pre
  }

  endPreformattedContext(): void {
    this.whitespaceMode = WhitespaceHandling.normal
  }

  toString(): string {
    return this.output
  }
}
