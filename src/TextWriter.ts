/**
 * Used by @see NodeWriter objects to write text.
 */
export abstract class TextWriter {
  protected activeLists: Array<ListType> = new Array<ListType>()

  abstract write(text: string): void
  abstract newLine(): void

  writeLine(text: string): void {
    this.write(text)
    this.newLine()
  }

  /**
   * Increases the current list level for determing the amount to indent lines by.
   * All new lines created will be indented by this amount.
   * To decrease the indent level the caller needs to call @see decreaseListLevel .
   *
   * NOTE: https://spec.commonmark.org/0.29/#indented-code-blocks
   * NOTE: https://spec.commonmark.org/0.29/#list-items
   */
  beginList(listType: ListType): void {
    this.activeLists.push(listType)
  }

  /**
   * Decreases the List level
   */
  endList(): void {
    this.activeLists.pop()
  }

  /**
   * If currently in the middle of a list returnst he type of list.
   * If not in a list null is returned.
   */
  listType(): ListType | null {
    return this.activeLists.length > 0
      ? this.activeLists[this.activeLists.length - 1]
      : null
  }

  /**
   * Returns the current indent level of lists.
   *
   */
  listLevel(): number {
    return this.activeLists.length
  }
}

export type ListType = "ul" | "ol"

// TODO: This could be made fast by creating a resizing facade on Uint8Array or via https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
export class DefaultTextWriter extends TextWriter {
  private output: string = ""
  private readonly newLineSequence = "\n"
  private readonly indentSequence = " "

  constructor() {
    super()
  }

  write(text: string): void {
    this.output += text
  }

  newLine(): void {
    this.output += this.newLineSequence
    if (this.listLevel() > 0) {
      this.output += this.indentSequence.repeat(this.listLevel() - 1)
    }
  }

  toString(): string {
    return this.output
  }
}
