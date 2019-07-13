import { LayoutContext } from "./LayoutContext"

type ListType = "ul" | "ol"

/**
 * Helps manage @see LayoutContext state for lists.
 */
export class ListState {
  private static readonly ItemCountKey = "ol-item-count-stack"
  private static readonly ListTypeKey = "list-type-key-stack"

  constructor(readonly context: LayoutContext) {}

  public beginList(listType: ListType): void {
    // track list type:
    this.context.pushState<ListType>(ListState.ListTypeKey, listType)
    // track the list item count:
    this.context.pushState(ListState.ItemCountKey, 0)
  }

  public endList() {
    // track list type:
    this.context.popState<ListType>(ListState.ListTypeKey)
    // pop the item count for this list
    this.context.popState(ListState.ItemCountKey)
  }

  public getListType(): ListType | undefined {
    return this.context.peekState<ListType>(ListState.ListTypeKey)
  }

  public newListItem(): void {
    const stack = this.context.getStateStack<number>(ListState.ItemCountKey)
    console.assert(stack.length > 0, "expected ItemCount state")
    stack[stack.length - 1] = stack[stack.length - 1] + 1
  }

  public getListItemCount(): number {
    const stack = this.context.getStateStack<number>(ListState.ItemCountKey)
    console.assert(stack.length > 0, "expected ItemCount state")
    return stack[stack.length - 1]
  }

  /**
   * Returns how many lists are active right now.
   * 1 = no nesting
   * 2 = one list nested inside of another, etc.
   */
  public getListNestingDepth(): number {
    const stack = this.context.getStateStack(ListState.ListTypeKey)
    return stack.length
  }
}
