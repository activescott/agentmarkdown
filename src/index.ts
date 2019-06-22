import { parseHtml } from "./parseHtml"
import { ProducerContext } from "./ProducerContext"
import { DefaultProducerContext } from "./DefaultProducerContext";

/**
 * An HTML to markdown converter.
 * Goals:
 * - Nested UL/OL lists!
 * - Generates markdown according to https://commonmark.org/
 *  - Passes commonmark tests (in the html->md and back)
 * - ALWAYS prefers markdown syntax over HTML tags when available
 * - Forgiving of invalid HTML:
 *  - Supports html fragments
 *  - Supports technically non-compliant html where possible
 * - Works in browsers or node.
 *  - Uses dependencies judiciously
 * - Allows overriding the MD generators for nodes so the user can customize output.
 */
export class HyperMarkdown {
  // generate to stream or https://developer.mozilla.org/en-US/docs/Web/API/WritableStream maybe https://github.com/MattiasBuelens/web-streams-polyfill
  public static async produce(html: string): Promise<string> {
    const dom = await parseHtml(html)
    const context = new DefaultProducerContext()
    let out = ""
    for (let node of dom) {
      const producer = context.getProducerFor(node)
      const product = producer.produce(context, node)
      console.log(node, "=>", product)
      out += product
    }
    return out
  }
}
