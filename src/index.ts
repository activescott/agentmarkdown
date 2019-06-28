import { parseHtml } from "./parseHtml"
import { DefaultTextWriter, TextWriter, BlockType } from "./TextWriter"
import { layout } from "./css/layout"
import { CssBox, BoxType } from "./css/CssBox"

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
export class HypertextMarkdown {
  // generate to stream or https://developer.mozilla.org/en-US/docs/Web/API/WritableStream maybe https://github.com/MattiasBuelens/web-streams-polyfill
  public static async produce(html: string): Promise<string> {
    const dom = await parseHtml(html)
    const writer = new DefaultTextWriter()
    const docStructure = layout(dom)
    render(writer, docStructure)
    return writer.toString()
  }
}

function render(writer: TextWriter, boxes: Iterable<CssBox>): void {
  for (const box of boxes) {
    if (box.type === BoxType.block) {
      writer.beginBlock(BlockType.default)
      render(writer, box.children)
      writer.endBlock(BlockType.default)
    } else if (box.type === BoxType.inline) {
      if (box.textContent) {
        writer.writeTextContent(box.textContent)
      } else {
        render(writer, box.children)
      }
    } else {
      throw new Error(`Unexpected BoxType: '${box.type}'`)
    }
  }
}
