import { Producer } from "./Producer"
import { HtmlNode } from "./HtmlNode"
import { ProducerContext } from "./ProducerContext"

export class FallbackProducer implements Producer {
  produce(context: ProducerContext, input: HtmlNode): string {
    return getInnerMarkdown(context, input)
  }
}

export class TextProducer implements Producer {
  produce(context: ProducerContext, input: HtmlNode): string {
    console.assert(input.type === "text", "expected input to be text")
    return input.data
  }
}

export class DivProducer implements Producer {
  produce(context: ProducerContext, input: HtmlNode): string {
    let inner = getInnerMarkdown(context, input)
    console.log("DivProducer.inner:", inner)
    return "\n" + inner + "\n"
  }
}

function getInnerMarkdown(context: ProducerContext, input: HtmlNode) {
  let inner = ""
  if (input.children) {
    for (let child of input.children) {
      let childProducer = context.getProducerFor(child)
      inner += childProducer.produce(context, child)
    }
  }
  return inner
}
