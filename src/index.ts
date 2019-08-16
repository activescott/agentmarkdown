import { parseHtml } from "./parseHtml"
import { TextWriter } from "./TextWriter"
import { DefaultTextWriter } from "./DefaultTextWriter"
import { layout } from "./css"
import { HtmlNode } from "./HtmlNode"
import { LayoutContext } from "./LayoutContext"
import { DefaultBoxBuilderFuncs } from "./css/layout/DefaultBoxBuilderFuncs"
import BlockquotePlugin from "./css/layout/BlockquotePlugin"
import { CssBoxFactoryFunc } from "./css/layout/CssBoxFactory"
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
   * A map of "element name" => @see BoxBuilder where the key is the element name and the associated value is a @see BoxBuilder implementations that render markdown for a specified HTML element.
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
  { elementName: "a", layout: DefaultBoxBuilderFuncs.link },
  { elementName: "b", layout: DefaultBoxBuilderFuncs.emphasisThunk("**") },
  { elementName: "br", layout: DefaultBoxBuilderFuncs.br },
  { elementName: "code", layout: DefaultBoxBuilderFuncs.code },
  { elementName: "del", layout: DefaultBoxBuilderFuncs.emphasisThunk("~") },
  { elementName: "li", layout: DefaultBoxBuilderFuncs.listItem },
  { elementName: "ol", layout: DefaultBoxBuilderFuncs.list },
  { elementName: "ul", layout: DefaultBoxBuilderFuncs.list },
  /* eslint-disable no-magic-numbers */
  { elementName: "h1", layout: DefaultBoxBuilderFuncs.headingThunk(1) },
  { elementName: "h2", layout: DefaultBoxBuilderFuncs.headingThunk(2) },
  { elementName: "h3", layout: DefaultBoxBuilderFuncs.headingThunk(3) },
  { elementName: "h4", layout: DefaultBoxBuilderFuncs.headingThunk(4) },
  { elementName: "h5", layout: DefaultBoxBuilderFuncs.headingThunk(5) },
  { elementName: "h6", layout: DefaultBoxBuilderFuncs.headingThunk(6) },
  /* eslint-enable no-magic-numbers */
  { elementName: "hr", layout: DefaultBoxBuilderFuncs.hr },
  { elementName: "i", layout: DefaultBoxBuilderFuncs.emphasisThunk("*") },
  { elementName: "em", layout: DefaultBoxBuilderFuncs.emphasisThunk("*") },
  { elementName: "pre", layout: DefaultBoxBuilderFuncs.pre },
  { elementName: "s", layout: DefaultBoxBuilderFuncs.emphasisThunk("~") },
  { elementName: "strike", layout: DefaultBoxBuilderFuncs.emphasisThunk("~") },
  { elementName: "strong", layout: DefaultBoxBuilderFuncs.emphasisThunk("**") },
  { elementName: "u", layout: DefaultBoxBuilderFuncs.emphasisThunk("_") },
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
    //console.log("! docStructure !:\n", CssBoxImp.traceBoxTree(docStructure))
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
export interface LayoutGenerator {
  (
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null
}

/**
 * A function to map a @see CssBox to another @see CssBox.
 */
export interface LayoutTransformer {
  (context: LayoutContext, boxFactory: CssBoxFactoryFunc, box: CssBox): CssBox
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
  /**
   * In some rare cases the plugin will need to manipulate the boxes created by other @see LayoutPlugin objects (especially when those boxes are for child HTML elements that the plugin is interested in).
   * If specified, this function will be called for every box created during layout.
   */
  transform?: LayoutTransformer
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
