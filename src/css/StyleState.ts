import { LayoutContext } from "./LayoutContext"
import { WhitespaceHandling } from "."

/**
 * Helps manage @see LayoutContext state for misc CSS style state.
 */
export class StyleState {
  private static readonly WhitespaceHandlingKey = "style-whitespace-handling"

  public constructor(readonly context: LayoutContext) {}

  pushWhitespaceHandling(handling: WhitespaceHandling) {
    this.context.pushState(StyleState.WhitespaceHandlingKey, handling)
  }

  popWhitespaceHandling() {
    this.context.popState(StyleState.WhitespaceHandlingKey)
  }

  get whitespaceHandling(): WhitespaceHandling {
    let handling: WhitespaceHandling = this.context.peekState<
      WhitespaceHandling
    >(StyleState.WhitespaceHandlingKey)
    return handling ? handling : WhitespaceHandling.normal
  }
}
