/**
 * Used by @see NodeWriter objects to write text.
 */
export abstract class TextWriter {
  protected indentSequences: Array<string> = new Array<string>()

  abstract write(text: string): void
  abstract newLine(): void

  writeLine(text: string): void {
    this.write(text)
    this.newLine()
  }

  /**
   * Adds the specified string sequence to the begining of newlines created.
   * To decrease the indent level the caller needs to call @see popIndentSequence.
   * NOTE: https://spec.commonmark.org/0.29/#indented-code-blocks
   * NOTE: https://spec.commonmark.org/0.29/#list-items
   */
  pushIndentSequence(sequence: string): void {
    this.indentSequences.push(sequence)
  }

  /**
   * Pops the most recently pushed indent sequence off of the stack and returns it.
   * If there are no indentSequences on the stack it will throw.
   */
  popIndentSequence(): string {
    if (this.indentSequences.length === 0) {
      throw new Error("No indent sequence to pop")
    }
    return this.indentSequences.pop()
  }
}

// TODO: This could be made fast by creating a resizing facade on Uint8Array or via https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
export class DefaultTextWriter extends TextWriter {
  private output: string = ""
  private readonly newLineSequence = "\n"
  private readonly indentSequence = "  "

  constructor() {
    super()
  }

  write(text: string): void {
    this.output += text
  }

  newLine(): void {
    this.output += this.newLineSequence
    this.indentSequences.forEach(seq => (this.output += seq))
  }

  toString(): string {
    return this.output
  }
}
