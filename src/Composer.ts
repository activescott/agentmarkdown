import { HtmlNode } from "./HtmlNode"
import { ComposerContext } from "./ComposerContext"
import { TextWriter } from "./TextWriter"

/**
 * Composes markdown for the specified input node.
 */
export interface Composer {
  compose(context: ComposerContext, writer: TextWriter, input: HtmlNode): void
}
