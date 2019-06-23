import { Composer } from "./Composer"
import { HtmlNode } from "./HtmlNode"
import { ComposerContext } from "./ComposerContext"
import { TextWriter } from "./TextWriter"

export class FallbackComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    context.compose(
      writer,
      input.children
    )
  }
}

export class TextComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    console.assert(input.type === "text", "expected input to be text")
    let rawText = input.data ? input.data : ""
    rawText = rawText.replace(/\n/g, "")
    writer.write(rawText)
  }
}

export class DivComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    writer.newLine()
    context.compose(
      writer,
      input.children
    )
    writer.newLine()
  }
}

export class UlComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    writer.beginList("ul")
    context.compose(
      writer,
      input.children
    )
    writer.endList()
  }
}

export class OlComposer implements Composer {
  public static readonly ItemCountKey = "ol-item-count-stack"

  public static getItemCountStack(context: ComposerContext): Array<number> {
    return context.getState(OlComposer.ItemCountKey)
  }

  static beginList(context: ComposerContext, writer: TextWriter) {
    // track the list item count:
    let stack = OlComposer.getItemCountStack(context)
    if (!stack) {
      stack = new Array<number>()
    }
    console.log("*****STACK*****:", stack)
    stack.push(0)
    context.setState(OlComposer.ItemCountKey, stack)
    // tell the writer
    writer.beginList("ol")
  }

  static endList(context: ComposerContext, writer: TextWriter) {
    const stack = OlComposer.getItemCountStack(context)
    if (!stack) throw new Error("expected item count stack to exist in state")
    if (stack.length <= 0) throw new Error("expected item count stack to have an item")
    stack.pop()
    writer.endList()
  }

  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    OlComposer.beginList(context, writer)
    context.compose(
      writer,
      input.children
    )
    OlComposer.endList(context, writer)
  }
}

export class LiComposer implements Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    writer.newLine()
    if (writer.listType() === "ul") {
      writer.write("* ")
    } else if (writer.listType() === "ol") {
      const stack = OlComposer.getItemCountStack(context)
      console.assert(stack.length > 0)
      let itemCount = stack[stack.length - 1] = stack[stack.length - 1] + 1
      writer.write(`${itemCount}. `)
    } else {
      throw new Error("Unexpected listType in context:" + writer.listType())
    }
    context.compose(
      writer,
      input.children
    )
  }
}
