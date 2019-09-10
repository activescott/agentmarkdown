import { parseHtml } from "./parseHtml"
import { TextWriter } from "./TextWriter"
import { DefaultTextWriter } from "./DefaultTextWriter"
import { layout } from "./css"
import { HtmlNode } from "./HtmlNode"
import { LayoutContext } from "./LayoutContext"
import { DefaultLayoutGenerators } from "./css/layout/DefaultLayoutGenerators"
import BlockquotePlugin from "./css/layout/BlockquotePlugin"
import { LayoutManager } from "./LayoutManager"
export { LayoutContext } from "./LayoutContext"
export { HtmlNode } from "./HtmlNode"

export interface RenderOptions {
  /**
   * The HTML to render to markdown.
   */
  html: string
  /**
   * Use to customize the rendering of HTML elements or provide HTML-to-markdown rendering for an element that isn't handled by default.
   * A map of "element name" => @see LayoutPlugin where the key is the element name and the associated value is a @see LayoutPlugin implementations that render markdown for a specified HTML element.
   * Any elements in this map that conflict with the default intrinsic implementations will override the default rendering.
   */
  layoutPlugins?: LayoutPlugin[]
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

const defaultPlugins: LayoutPlugin[] = [
  { elementName: "a", layout: DefaultLayoutGenerators.link },
  { elementName: "b", layout: DefaultLayoutGenerators.emphasisThunk("**") },
  { elementName: "br", layout: DefaultLayoutGenerators.br },
  { elementName: "code", layout: DefaultLayoutGenerators.code },
  { elementName: "del", layout: DefaultLayoutGenerators.emphasisThunk("~") },
  { elementName: "div", layout: DefaultLayoutGenerators.blockThunk("div") },
  { elementName: "li", layout: DefaultLayoutGenerators.listItem },
  { elementName: "ol", layout: DefaultLayoutGenerators.list },
  { elementName: "ul", layout: DefaultLayoutGenerators.list },
  /* eslint-disable no-magic-numbers */
  { elementName: "h1", layout: DefaultLayoutGenerators.headingThunk(1) },
  { elementName: "h2", layout: DefaultLayoutGenerators.headingThunk(2) },
  { elementName: "h3", layout: DefaultLayoutGenerators.headingThunk(3) },
  { elementName: "h4", layout: DefaultLayoutGenerators.headingThunk(4) },
  { elementName: "h5", layout: DefaultLayoutGenerators.headingThunk(5) },
  { elementName: "h6", layout: DefaultLayoutGenerators.headingThunk(6) },
  /* eslint-enable no-magic-numbers */
  { elementName: "hr", layout: DefaultLayoutGenerators.hr },
  { elementName: "html", layout: DefaultLayoutGenerators.blockThunk("html") },
  { elementName: "i", layout: DefaultLayoutGenerators.emphasisThunk("*") },
  { elementName: "em", layout: DefaultLayoutGenerators.emphasisThunk("*") },
  { elementName: "p", layout: DefaultLayoutGenerators.paragraph },
  { elementName: "pre", layout: DefaultLayoutGenerators.pre },
  { elementName: "s", layout: DefaultLayoutGenerators.emphasisThunk("~") },
  { elementName: "strike", layout: DefaultLayoutGenerators.emphasisThunk("~") },
  {
    elementName: "strong",
    layout: DefaultLayoutGenerators.emphasisThunk("**")
  },
  { elementName: "u", layout: DefaultLayoutGenerators.emphasisThunk("_") },
  new BlockquotePlugin()
]

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
    const plugins = options.layoutPlugins
      ? defaultPlugins.concat(options.layoutPlugins)
      : defaultPlugins
    const docStructure = layout(dom, plugins)
    // console.log("! docStructure !:\n", CssBoxImp.traceBoxTree(docStructure))
    renderImp(writer, new RenderState(), docStructure.children)
    return {
      markdown: writer.toString(),
      images: []
    }
  }
}

function renderImp(
  writer: TextWriter,
  state: RenderState,
  boxes: Iterable<CssBox>
): void {
  let isFirst = true
  for (const box of boxes) {
    // insert newline for vertical margins: Due to CSS collapsing margins, we only want to insert one newLine even if both topMargin on this box and bottomMargin on the last box are set.
    if ((box.topMargin && !isFirst) || state.lastBottomMarginNeedsRendered) {
      writer.newLine()
      state.lastBottomMarginNeedsRendered = false
      if (state.activeBlockquoteCount) {
        writer.writeMarkup("> ")
      }
    }
    if (box.type === BoxType.block && !isFirst) {
      writer.newLine()
    }
    box.textContent && writer.writeTextContent(box.textContent)
    if (box.debugNote === "blockquote") {
      state.activeBlockquoteCount++
    }
    box.children && renderImp(writer, state, box.children)
    if (box.debugNote === "blockquote") {
      state.activeBlockquoteCount--
    }
    isFirst = false
    if (box.type === BoxType.block)
      state.lastBottomMarginNeedsRendered = box.bottomMargin
  }
}

class RenderState {
  activeBlockquoteCount: number = 0
  lastBottomMarginNeedsRendered: boolean = false
}

/**
 * Defines the function used to create a @see CssBox from an HTML element.
 */
export interface LayoutGenerator {
  (
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null
}

export interface LayoutPlugin {
  /**
   * Specifies the name of the HTML element that this plugin renders markdown for.
   * NOTE: Must be all lowercase
   */
  elementName: string
  /**
   * This is the core of the implementation that will be called for each instance of the HTML element that this plugin is registered for.
   */
  layout: LayoutGenerator
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
  /**
   * True if this box requires a top margin
   * NOTE: If two boxes have [adjoining margins](https://www.w3.org/TR/CSS22/box.html#x28) the output should have only a single new line between two boxes to support [CSS's Collapsing Margins](https://www.w3.org/TR/CSS22/box.html#collapsing-margins).
   * NOTE: The top margin of a first in-flow child and top margin of its parent can be collapsed; thus, a newline is not introduced for margin purposes when the first inflow child and its parent have a top margin.
   */
  topMargin: boolean
  /**
   * True if this box requires a bottom margin.
   * NOTE: If two boxes have [adjoining margins](https://www.w3.org/TR/CSS22/box.html#x28) the output should have only a single new line between two boxes to support [CSS's Collapsing Margins](https://www.w3.org/TR/CSS22/box.html#collapsing-margins).
   * NOTE: The bottom margin of a last in-flow child and bottom margin of its parent can be collapsed; thus, a newline is not introduced for margin purposes when the last inflow child and its parent have a bottom margin.
   */
  bottomMargin: boolean
  /**
   * Returns true if this box establishes new block formatting contexts for it's contents as explained in [9.4.1 Block formatting contexts](https://www.w3.org/TR/CSS22/visuren.html#normal-flow).
   */
  doesEstablishBlockFormattingContext: boolean
  addChild(box: CssBox): void
  prependChild(box: CssBox): void
}
