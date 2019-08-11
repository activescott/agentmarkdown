import { CssBox, HtmlNode } from "."

export interface LayoutBoxFactory {
  /**
   * Builds a set of @see CssBox objects for the specified elements.
   */
  buildBoxes(context: LayoutContext, elements: HtmlNode[]): CssBox[]
  /**
   * Creates a new @see CssBox instance.
   * @param textContent Returns any text content if this box has text to render.
   * @param children Returns any child boxes of this box.
   * @param debugNote A string to add to the box to help with debugging.
   */
  createBlockBox(
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string
  ): CssBox
  createBlockBox(textContent: string, children: Iterable<CssBox>): CssBox
  createBlockBox(textContent: string): CssBox
  /**
   * Creates a new @see CssBox instance.
   * @param textContent Returns any text content if this box has text to render.
   * @param children Returns any child boxes of this box.
   * @param debugNote A string to add to the box to help with debugging.
   */
  createInlineBox(
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string
  ): CssBox
  createInlineBox(textContent: string, children: Iterable<CssBox>): CssBox
  createInlineBox(textContent: string): CssBox
}

export interface LayoutContext extends LayoutBoxFactory {
  /**
   * Returns the specified stack.
   * If the stack is not yet created it will return an empty stack.
   * @param stackName The stack name (state key) to retrieve.
   */
  getStateStack<TValue>(stackName: string): TValue[]
  /**
   * Pushes the specified state onto the specified stack.
   * If the stack does not yet exist, it will be created and the value pushed onto it.
   * NOTE: If you want to evaluate the stack itself, use @see getStateStack and it will return the stack.
   * @param stackName The ´key/name of the stack to push the value onto.
   * @param value The value to push onto the top of the stack.
   */
  pushState<TValue>(stackName: string, value: TValue): void
  /**
   * Pops the top value from the specified stack and returns it.
   * If the stack doesn't exist or is empty @see undefined is returned.
   * @param stackName The key/name of the stack to pop the value from.
   */
  popState<TValue>(stackName: string): TValue | undefined
  /**
   * Returns the top value from the specified stack without removing it from the stack.
   * @param stackName The key/name of the stack to peek at.
   */
  peekState<TValue>(stackName: string): TValue | undefined
}
