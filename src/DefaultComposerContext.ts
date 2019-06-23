import { HtmlNode } from "./HtmlNode"
import { Composer } from "./Composer"
import { ComposerContext } from "./ComposerContext"
import {
  FallbackComposer,
  DivComposer,
  TextComposer,
  UlComposer,
  LiComposer,
  OlComposer
} from "./Composers"

const fallback: FallbackComposer = new FallbackComposer()
const nodeMap = new Map<string, Composer>([
  ["text", new TextComposer()],
  ["tag-div", new DivComposer()],
  ["tag-ul", new UlComposer()],
  ["tag-ol", new OlComposer()],
  ["tag-li", new LiComposer()]
])

export class DefaultComposerContext extends ComposerContext {
  getComposerFor(node: HtmlNode) {
    const key = node.name ? node.type + "-" + node.name : node.type
    let result = nodeMap.get(key)
    if (process.env.DEBUG) {
      console.log("key", key, "=>", result)
    }
    if (!result) {
      return fallback
    }
    return result
  }
}
