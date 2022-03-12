import { WhitespaceHandling } from "../"
import { LayoutContext } from "../.."

/**
 * Helps manage @see LayoutContext state for misc CSS style state.
 */
export class StyleState {
  private static readonly WhitespaceHandlingKey: string =
    "style-whitespace-handling"

  public constructor(private readonly context: LayoutContext) {}

  public get whitespaceHandling(): WhitespaceHandling {
    const handling: WhitespaceHandling =
      this.context.peekState<WhitespaceHandling>(
        StyleState.WhitespaceHandlingKey
      )
    return handling ? handling : WhitespaceHandling.normal
  }

  public pushWhitespaceHandling(handling: WhitespaceHandling): void {
    this.context.pushState(StyleState.WhitespaceHandlingKey, handling)
  }

  public popWhitespaceHandling(): void {
    this.context.popState(StyleState.WhitespaceHandlingKey)
  }
}
