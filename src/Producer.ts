import { HtmlNode } from "./HtmlNode"
import { ProducerContext } from "./ProducerContext"

/**
 * Generates markdown for the specified input.
 */
export interface Producer {
  produce(context: ProducerContext, input: HtmlNode): string
}
