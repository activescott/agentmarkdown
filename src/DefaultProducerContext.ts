import { HtmlNode } from "./HtmlNode"
import { Producer } from "./Producer"
import { ProducerContext } from "./ProducerContext"
import { FallbackProducer, DivProducer, TextProducer } from "./Producers"

const fallback: FallbackProducer = new FallbackProducer()
const nodeMap = new Map<string, Producer>([
  ["tag-div", new DivProducer()],
  ["text", new TextProducer()]
])

export class DefaultProducerContext extends ProducerContext {
  getProducerFor(node: HtmlNode) {
    const key = node.name ? node.type + "-" + node.name : node.type
    let result = nodeMap.get(key)
    console.log("key", key, "=>", result)
    if (!result) {
      return fallback
    }
    return result
  }
}
