import { LayoutContext } from "./LayoutContext"
import { WhitespaceHandling } from "../"

/**
 * Helps manage @see LayoutContext state for misc CSS style state.
 */
export class StyleState {
  private static readonly WhitespaceHandlingKey: string =
    "style-whitespace-handling"

  constructor(readonly context: LayoutContext) {}

  public pushWhitespaceHandling(handling: WhitespaceHandling) {
    this.context.pushState(StyleState.WhitespaceHandlingKey, handling)
  }

  public popWhitespaceHandling() {
    this.context.popState(StyleState.WhitespaceHandlingKey)
  }

  public get whitespaceHandling(): WhitespaceHandling {
    let handling: WhitespaceHandling = this.context.peekState<
      WhitespaceHandling
    >(StyleState.WhitespaceHandlingKey)
    return handling ? handling : WhitespaceHandling.normal
  }
}
