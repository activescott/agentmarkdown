import { TextWriter } from "./TextWriter"
import { CssBox, BoxType } from "./index"

export function renderBoxes(
  writer: TextWriter,
  boxes: Iterable<CssBox>,
  state: RenderState = null
): void {
  if (!state) state = new RenderState()
  state.isFirstSibling = true
  for (const box of boxes) {
    beforeBox(writer, box, state)
    renderBox(box, state, writer)
    afterBox(box, state)
  }
}

function beforeBox(writer: TextWriter, box: CssBox, state: RenderState): void {
  // insert newline for vertical margins: Due to CSS collapsing margins, we only want to insert one newLine even if both topMargin on this box and bottomMargin on the last box are set.
  if (
    (box.topMargin && !state.isFirstSibling) ||
    state.lastBottomMarginNeedsRendered
  ) {
    writer.newLine()
    state.lastBottomMarginNeedsRendered = false
    if (state.activeBlockquoteCount) {
      writer.writeMarkup("> ")
    }
  }
}

function afterBox(box: CssBox, state: RenderState): void {
  state.isFirstSibling = false
  if (box.bottomMargin) {
    /* eslint-disable-next-line no-console */
    console.assert(
      box.type === BoxType.block,
      "expected only block boxes to have a bottomMargin"
    )
    state.lastBottomMarginNeedsRendered = true
  }
}

function renderBox(box: CssBox, state: RenderState, writer: TextWriter): void {
  if (box.type === BoxType.block && !state.isFirstSibling) {
    writer.newLine()
  }
  box.textContent && writer.writeTextContent(box.textContent)
  if (box.debugNote === "blockquote") {
    state.activeBlockquoteCount++
  }
  box.children && renderBoxes(writer, box.children, state)
  if (box.debugNote === "blockquote") {
    state.activeBlockquoteCount--
  }
}

export class RenderState {
  public isFirstSibling: boolean
  public activeBlockquoteCount: number = 0
  public lastBottomMarginNeedsRendered: boolean = false
}
