/**
 * Provides context during layout.
 */
export class LayoutContext {
  private readonly state: Map<string, any> = new Map<string, any>()

  /**
   * Returns the specified stack.
   * If the stack is not yet created it will return an empty stack.
   * @param stackName The stack name (state key) to retreive.
   */
  public getStateStack<TValue>(stackName: string): Array<TValue> {
    let stack = this.state.get(stackName) as Array<TValue>
    if (!stack) {
      stack = new Array<TValue>()
      this.state.set(stackName, stack)
    }
    return stack
  }

  /**
   * Pushes the specified state onto the specified stack.
   * If the stack does not yet exist, it will be created and the value pushed onto it.
   * NOTE: If you want to evaluate the stack itself, use @see getStateStack and it will return the stack.
   * @param stackName The key/name of the stack to push the value onto.
   * @param value The value to push onto the top of the stack.
   */
  public pushState<TValue>(stackName: string, value: TValue) {
    const stack = this.getStateStack<TValue>(stackName)
    stack.push(value)
  }

  /**
   * Pops the top value from the specified stack and returns it.
   * If the stack doesn't exist or is empty @see undefined is returned.
   * @param stackName The key/name of the stack to pop the value from.
   */
  public popState<TValue>(stackName: string): TValue | undefined {
    const stack = this.getStateStack<TValue>(stackName)
    if (stack.length === 0) return undefined
    else return stack.pop()
  }

  /**
   * Returns the top value from the specified stack without removing it from the stack.
   * @param stackName The key/name of the stack to peek at.
   */
  public peekState<TValue>(stackName: string): TValue | undefined {
    const stack = this.getStateStack<TValue>(stackName)
    if (stack.length === 0) return undefined
    else return stack[stack.length - 1]
  }
}
