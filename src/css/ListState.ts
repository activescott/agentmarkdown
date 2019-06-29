import { LayoutContext } from "./LayoutContext"

type ListType = "ul" | "ol"

/**
 * Helps manage @see LayoutContext state for lists.
 */
export class ListState {
  private static readonly ItemCountKey = "ol-item-count-stack"
  private static readonly ListTypeKey = "list-type-key-stack"

  static beginList(listType: ListType, context: LayoutContext): void {
    // track list type:
    context.pushState<ListType>(this.ListTypeKey, listType)
    // track the list item count:
    context.pushState(ListState.ItemCountKey, 0)
  }

  static endList(context: LayoutContext) {
    // track list type:
    context.popState<ListType>(this.ListTypeKey)
    // pop the item count for this list
    context.popState(ListState.ItemCountKey)
  }

  static getListType(context: LayoutContext): ListType | undefined {
    return context.peekState<ListType>(ListState.ListTypeKey)
  }

  static newListItem(context: LayoutContext): void {
    const stack = context.getStateStack<number>(ListState.ItemCountKey)
    console.assert(stack.length > 0, "expected ItemCount state")
    stack[stack.length - 1] = stack[stack.length - 1] + 1
  }

  static getListItemCount(context: LayoutContext): number {
    const stack = context.getStateStack<number>(ListState.ItemCountKey)
    console.assert(stack.length > 0, "expected ItemCount state")
    return stack[stack.length - 1]
  }

  /**
   * Returns how many lists are active right now.
   * 1 = no nesting
   * 2 = one list nested inside of another, etc.
   */
  static getListNestingDepth(context: LayoutContext): number {
    const stack = context.getStateStack(this.ListTypeKey)
    return stack.length
  }
}
