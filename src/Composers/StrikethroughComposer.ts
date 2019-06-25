import { Composer } from "../Composer"
import { ComposerContext } from "../ComposerContext"
import { TextWriter } from "../TextWriter"
import { HtmlNode } from "../HtmlNode"

const nodeToCharMap = {
  strike: "~~",
  del: "~~"
}

export class StrikethroughComposer implements Composer {
  private readonly boundingSequence: string

  constructor(readonly nodeName) {
    if (Reflect.has(nodeToCharMap, nodeName)) {
      this.boundingSequence = nodeToCharMap[nodeName]
    } else {
      this.boundingSequence = "__"
      console.error("Unexpected node name!")
    }
  }

  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    writer.write(this.boundingSequence)
    context.compose(
      writer,
      input.children
    )
    writer.write(this.boundingSequence)
  }
}
