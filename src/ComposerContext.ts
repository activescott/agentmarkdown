import { HtmlNode } from "./HtmlNode"
import { Composer } from "./Composer"
import { TextWriter } from "./TextWriter"

/**
 * Provides context when composing output.
 */
export abstract class ComposerContext {
  protected state: Map<string, any> = new Map<string, any>()

  abstract getComposerFor(node: HtmlNode): Composer

  /**
   * Composes for the specified list of nodes.
   */
  compose(writer: TextWriter, nodes: HtmlNode[]): void {
    if (nodes) {
      for (let child of nodes) {
        let childComposer = this.getComposerFor(child)
        childComposer.compose(
          this,
          writer,
          child
        )
      }
    }
  }

  setState(key: string, value: any) {
    this.state.set(key, value)
  }

  getState(key: string): any {
    return this.state.get(key)
  }
}
