import { Composer } from "../Composer"
import { ComposerContext } from "../ComposerContext"
import { TextWriter } from "../TextWriter"
import { HtmlNode } from "../HtmlNode"

export class UlComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    ListState.beginList("ul", context, writer)
    context.compose(
      writer,
      input.children
    )
    ListState.endList(context, writer)
  }
}

export class OlComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    ListState.beginList("ol", context, writer)
    context.compose(
      writer,
      input.children
    )
    ListState.endList(context, writer)
  }
}

export class LiComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    writer.newLine()
    const listType = ListState.getListType(context)
    if (listType === "ul") {
      writer.write("* ")
    } else if (listType === "ol") {
      ListState.newListItem(context)
      const itemCount = ListState.getListItemCount(context)
      writer.write(`${itemCount}. `)
    } else {
      throw new Error("Unexpected listType in context:" + listType)
    }
    context.compose(
      writer,
      input.children
    )
  }
}

type ListType = "ul" | "ol"

class ListState {
  private static readonly ItemCountKey = "ol-item-count-stack"
  private static readonly ListTypeKey = "list-type-key-stack"

  static beginList(
    listType: ListType,
    context: ComposerContext,
    writer: TextWriter
  ): void {
    // track list type:
    context.pushState<ListType>(this.ListTypeKey, listType)
    // track the list item count:
    context.pushState(ListState.ItemCountKey, 0)
    // indent accordingly for nested lists:
    const listCount = context.getStateStack(this.ListTypeKey).length
    if (listCount > 1) {
      writer.pushIndentSequence("  ".repeat(listCount - 1))
    }
  }

  static endList(context: ComposerContext, writer: TextWriter) {
    // track list type:
    context.popState<ListType>(this.ListTypeKey)
    // pop the item count for this list
    context.popState(ListState.ItemCountKey)
    // update indent for nested lists:
    const listCount = context.getStateStack(this.ListTypeKey).length
    if (listCount > 0) {
      writer.popIndentSequence()
    }
  }

  static getListType(context: ComposerContext): ListType | undefined {
    return context.peekState<ListType>(ListState.ListTypeKey)
  }

  static newListItem(context: ComposerContext): void {
    const stack = context.getStateStack<number>(ListState.ItemCountKey)
    console.assert(stack.length > 0, "expected ItemCount state")
    stack[stack.length - 1] = stack[stack.length - 1] + 1
  }

  static getListItemCount(context: ComposerContext): number {
    const stack = context.getStateStack<number>(ListState.ItemCountKey)
    console.assert(stack.length > 0, "expected ItemCount state")
    return stack[stack.length - 1]
  }
}
