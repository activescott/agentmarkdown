import { Composer } from "../Composer"
import { ComposerContext } from "../ComposerContext"
import { TextWriter } from "../TextWriter"
import { HtmlNode } from "../HtmlNode"

const nodeToCharMap = {
  h1: "#",
  h2: "##",
  h3: "###",
  h4: "####",
  h5: "#####",
  h6: "######"
}

export class HeadingComposer implements Composer {
  private readonly boundingSequence: string

  constructor(readonly nodeName) {
    if (Reflect.has(nodeToCharMap, nodeName)) {
      this.boundingSequence = nodeToCharMap[nodeName]
    } else {
      this.boundingSequence = ""
      console.error("Unexpected node name!")
    }
  }

  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void {
    writer.write(this.boundingSequence + " ")
    context.compose(
      writer,
      input.children
    )
    writer.write(" " + this.boundingSequence)
  }
}
