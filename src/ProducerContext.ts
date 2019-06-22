import { HtmlNode } from "./HtmlNode"
import { DefaultProducerContext } from "./DefaultProducerContext"
import { Producer } from "./Producer"

/**
 * Provides context when generating output.
 */
export abstract class ProducerContext {
  abstract getProducerFor(node: HtmlNode): Producer
}
