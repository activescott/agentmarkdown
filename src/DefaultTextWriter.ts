import { TextWriter } from "./TextWriter"

// TODO: This could be made fast by creating a resizing facade on Uint8Array or via https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
export class DefaultTextWriter extends TextWriter {
  private output: string = ""
  public constructor() {
    super()
  }

  public writeTextContent(content: string): void {
    if (!content) {
      return
    }
    this.output += content
  }

  public writeMarkup(markup: string): void {
    this.output += markup
  }

  public toString(): string {
    return this.output
  }
}
