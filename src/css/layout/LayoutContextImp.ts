import { HtmlNode, CssBox, LayoutContext, BoxBuilder } from "../.."
import { CssBoxConstructor } from "./layout"

/**
 * Provides context during layout.
 */
export class LayoutContextImp implements LayoutContext {
  private readonly state: Map<string, any> = new Map<string, any>() // eslint-disable-line @typescript-eslint/no-explicit-any

  public constructor(
    private readonly blockBoxCreator: CssBoxConstructor,
    private readonly inlineBoxCreator: CssBoxConstructor,
    private readonly compositeBoxBuilder: BoxBuilder
  ) {}

  public buildBoxes(context: LayoutContext, elements: HtmlNode[]): CssBox[] {
    const boxes = elements
      ? elements
          .map(el => this.compositeBoxBuilder(context, el))
          .filter(childBox => childBox !== null)
      : []
    return boxes
  }

  public createBlockBox(
    textContent: string = "",
    children: Iterable<CssBox> = [],
    debugNote: string = ""
  ): CssBox {
    return this.blockBoxCreator(this, textContent, children, debugNote)
  }

  public createInlineBox(
    textContent: string = "",
    children: Iterable<CssBox> = [],
    debugNote: string = ""
  ): CssBox {
    return this.inlineBoxCreator(this, textContent, children, debugNote)
  }

  public getStateStack<TValue>(stackName: string): TValue[] {
    let stack = this.state.get(stackName) as TValue[]
    if (!stack) {
      stack = new Array<TValue>()
      this.state.set(stackName, stack)
    }
    return stack
  }

  public pushState<TValue>(stackName: string, value: TValue): void {
    const stack = this.getStateStack<TValue>(stackName)
    stack.push(value)
  }

  public popState<TValue>(stackName: string): TValue | undefined {
    const stack = this.getStateStack<TValue>(stackName)
    if (stack.length === 0) return undefined
    else return stack.pop()
  }

  public peekState<TValue>(stackName: string): TValue | undefined {
    const stack = this.getStateStack<TValue>(stackName)
    if (stack.length === 0) return undefined
    else return stack[stack.length - 1]
  }
}
