import { parseHtml } from "./parseHtml"
import { TextWriter } from "./TextWriter"
import { DefaultTextWriter } from "./DefaultTextWriter"
import { layout } from "./css"
import { HtmlNode } from "./HtmlNode"
import { LayoutContext } from "./LayoutContext"
export { LayoutContext } from "./LayoutContext"
export { HtmlNode } from "./HtmlNode"

export interface RenderOptions {
  /**
   * The HTML to render to markdown.
   */
  html: string
  /**
   * Use to customize the rendering of HTML elements or provide HTML-to-markdown rendering for an element that isn't handled by default.
   * A map of "element name" => @see BoxBuilder where the key is the element name and the associated value is a @see BoxBuilder implementations that render markdown for a specified HTML element.
   * Any elements in this map that conflict with the default intrinsic implementations will override the default rendering.
   */
  renderPlugins?: RenderPlugin[]
}

export interface MarkdownOutput {
  markdown: string
  images: ImageReference[]
}

export interface ImageReference {
  /**
   * A url that refers to an image.
   */
  url: string
}

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
export class AgentMarkdown {
  /**
   * @deprecated Use @see render instead.
   */
  public static async produce(html: string): Promise<string> {
    const result = await AgentMarkdown.render({ html })
    return result.markdown
  }

  /**
   * Renders the the specified HTML to markdown.
   */
  public static async render(options: RenderOptions): Promise<MarkdownOutput> {
    const dom = await parseHtml(options.html)
    //console.debug(traceHtmlNodes(dom))
    const writer = new DefaultTextWriter()
    const docStructure = layout(dom, options.renderPlugins)
    renderImp(writer, docStructure.children)
    return {
      markdown: writer.toString(),
      images: []
    }
  }
}

function renderImp(writer: TextWriter, boxes: Iterable<CssBox>): void {
  let isFirst = true
  for (const box of boxes) {
    if (box.type == BoxType.block && !isFirst) {
      writer.newLine()
    }
    box.textContent && writer.writeTextContent(box.textContent)
    box.children && renderImp(writer, box.children)
    isFirst = false
  }
}

/**
 * Defines the function used to create a @see CssBox from an HTML element.
 */
export interface BoxBuilder {
  (context: LayoutContext, element: HtmlNode): CssBox | null
}

/**
 * Defines a function to map a @see CssBox to another @css CssBox (or just returns the same box).
 */
export interface BoxMapper {
  (context: LayoutContext, box: CssBox): CssBox
}

export interface RenderPlugin {
  /**
   * Specifies the name of the HTML element that this plugin renders markdown for.
   * NOTE: Must be all lowercase
   */
  elementName: string
  /**
   * This is the core of the implementation that will be called for each instance of the HTML element that this plugin is registered for.
   */
  renderer: BoxBuilder
  /**
   * In some rare cases the BoxBuilder will need to manipulate the boxes created by other @see RenderPlugin objects.
   * If specified, this function will be called for every inline box created.
   */
  inlineBoxMapper?: BoxMapper
  /**
   * In some rare cases the BoxBuilder will need to manipulate the boxes created by other @see RenderPlugin objects.
   * If specified, this function will be called for every block box created.
   */
  blockBoxMapper?: BoxMapper
}

/* eslint-disable no-unused-vars */
export enum BoxType {
  block = 0,
  inline = 1
}
/* eslint-enable no-unused-vars */

/**
 * Represents a (simplified) a CSS box as described at https://www.w3.org/TR/CSS22/visuren.html#box-gen.
 */
export interface CssBox {
  children: IterableIterator<CssBox>
  type: BoxType
  textContent: string
  readonly debugNote: string
  addChild(box: CssBox): void
}
