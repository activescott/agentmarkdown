export interface LayoutContext {
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
