import { LayoutContext } from "../.."

/**
 * Provides context during layout.
 */
export class LayoutContextImp implements LayoutContext {
  private readonly state: Map<string, any> = new Map<string, any>() // eslint-disable-line @typescript-eslint/no-explicit-any

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
