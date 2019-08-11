import { HtmlNode } from "../../HtmlNode"
import {
  BoxBuilder,
  BoxType,
  CssBox,
  LayoutContext,
  RenderPlugin,
  BoxMapper
} from "../../"
import { normalizeWhitespace } from "../"
import { LayoutContextImp } from "./LayoutContextImp"
import { StyleState } from "./StyleState"
import { CssBoxImp } from "../CssBoxImp"
import { DefaultBoxBuilderFuncs } from "./DefaultBoxBuilderFuncs"

/**
 * Implements the CSS Visual Formatting model's box generation algorithm. It turns HTML elements into a set of CSS Boxes.
 * See https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro
 */
export function layout(
  document: Iterable<HtmlNode>,
  plugins: RenderPlugin[]
): CssBox {
  const boxBuilderMap = createBoxBuilderMap(plugins)
  const compositeBoxBuilder: BoxBuilder = (
    context: LayoutContext,
    element: HtmlNode
  ): CssBox => {
    return buildBoxForElementImp(context, element, boxBuilderMap)
  }

  const context: LayoutContext = new LayoutContextImp(
    createCssBoxConstructor(plugins, BoxType.block),
    createCssBoxConstructor(plugins, BoxType.inline),
    compositeBoxBuilder
  )
  // NOTE: we want a single root box so that the if the incoming HTML is a fragment (e.g. <span>a</span> <span>b</span>) it will still figure out it's own formatting context.
  const body = new CssBoxImp(BoxType.block, "", [], "body")
  for (const node of document) {
    const box = compositeBoxBuilder(context, node)
    box && body.addChild(box)
  }
  //console.debug(traceBoxTree(body))
  return body
}

function createBoxBuilderMap(plugins: RenderPlugin[]): Map<string, BoxBuilder> {
  const builders = new Map<string, BoxBuilder>([
    ["a", DefaultBoxBuilderFuncs.link],
    ["b", DefaultBoxBuilderFuncs.emphasisThunk("**")],
    ["blockquote", DefaultBoxBuilderFuncs.blockquote],
    ["br", DefaultBoxBuilderFuncs.br],
    ["code", DefaultBoxBuilderFuncs.code],
    ["del", DefaultBoxBuilderFuncs.emphasisThunk("~")],
    ["li", DefaultBoxBuilderFuncs.listItem],
    ["ol", DefaultBoxBuilderFuncs.list],
    ["ul", DefaultBoxBuilderFuncs.list],
    /* eslint-disable no-magic-numbers */
    ["h1", DefaultBoxBuilderFuncs.headingThunk(1)],
    ["h2", DefaultBoxBuilderFuncs.headingThunk(2)],
    ["h3", DefaultBoxBuilderFuncs.headingThunk(3)],
    ["h4", DefaultBoxBuilderFuncs.headingThunk(4)],
    ["h5", DefaultBoxBuilderFuncs.headingThunk(5)],
    ["h6", DefaultBoxBuilderFuncs.headingThunk(6)],
    /* eslint-enable no-magic-numbers */
    ["hr", DefaultBoxBuilderFuncs.hr],
    ["i", DefaultBoxBuilderFuncs.emphasisThunk("*")],
    ["em", DefaultBoxBuilderFuncs.emphasisThunk("*")],
    ["pre", DefaultBoxBuilderFuncs.pre],
    ["s", DefaultBoxBuilderFuncs.emphasisThunk("~")],
    ["strike", DefaultBoxBuilderFuncs.emphasisThunk("~")],
    ["strong", DefaultBoxBuilderFuncs.emphasisThunk("**")],
    ["u", DefaultBoxBuilderFuncs.emphasisThunk("_")]
  ])
  if (plugins) {
    for (const plugin of plugins) {
      builders.set(plugin.elementName, plugin.renderer)
    }
  }
  return builders
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function traceBoxTree(box: CssBox, indent = 0): string {
  const typeStr = (type: BoxType): string =>
    type === BoxType.inline ? "inline" : "block"
  const boxStr = (b: CssBox): string =>
    "CssBox " +
    (b == null
      ? "<null>"
      : JSON.stringify({
          type: typeStr(b.type),
          text: b.textContent,
          debug: b.debugNote
        })) +
    "\n"
  let output = "  ".repeat(indent) + boxStr(box)
  if (box) {
    for (const child of box.children) {
      output += traceBoxTree(child, indent + 1)
    }
  }
  return output
}

/**
 * Returns @see BlockBuilder for specified element.
 * @param elementName name/tag of element
 */
function getBoxBuilderForElement(
  elementName: string,
  builders: Map<string, BoxBuilder>
): BoxBuilder {
  if (!builders) throw new Error("builders must not be null!!")
  let builder = builders.get(elementName)
  if (!builder) {
    const display = getElementDisplay(elementName)
    if (display === CssDisplayValue.block) {
      builder = DefaultBoxBuilderFuncs.genericBlock
    } else if (display === CssDisplayValue.inline) {
      builder = DefaultBoxBuilderFuncs.genericInline
    } else if (display === CssDisplayValue.listItem) {
      builder = DefaultBoxBuilderFuncs.listItem
    } else {
      throw new Error("unexpected element and unexpected display")
    }
  }
  return builder
}

/**
 * Generates zero or more CSS boxes for the specified element.
 * See https://www.w3.org/TR/CSS22/visuren.html#propdef-display
 * @param element The element to generate a box for
 */
export function buildBoxForElementImp(
  context: LayoutContext,
  element: HtmlNode,
  builders: Map<string, BoxBuilder>
): CssBox | null {
  if (!builders) throw new Error("builders must not be null!")
  let box: CssBox = null
  if (element.type === "text") {
    const text = normalizeWhitespace(
      element.data,
      new StyleState(context).whitespaceHandling
    )
    if (text) {
      // only create a box if normalizeWhitespace left something over
      box = context.createInlineBox(text, [], "textNode")
    }
  } else if (element.type === "tag") {
    const boxBuilderFunc = getBoxBuilderForElement(element.name, builders)
    try {
      box = boxBuilderFunc(context, element)
    } catch (e) {
      throw new Error(
        `boxbuilder (${JSON.stringify(
          boxBuilderFunc
        )}) error for element ${JSON.stringify(element.name)}: ${e}`
      )
    }
  } else if (element.type === "comment") {
    // deliberately ignored
  } else {
    console.error(`Ignoring element with type ${element.type}`)
    box = null
  }
  return box
}

/**
 * https://www.w3.org/TR/CSS22/visuren.html#propdef-display
 */
enum CssDisplayValue {
  block,
  inline,
  listItem,
  none
}

const elementToDisplayMap: Map<string, CssDisplayValue> = new Map<
  string,
  CssDisplayValue
>([
  ["html", CssDisplayValue.block],
  ["address", CssDisplayValue.block],
  ["blockquote", CssDisplayValue.block],
  ["body", CssDisplayValue.block],
  ["dd", CssDisplayValue.block],
  ["div", CssDisplayValue.block],
  ["dl", CssDisplayValue.block],
  ["dt", CssDisplayValue.block],
  ["fieldset", CssDisplayValue.block],
  ["form", CssDisplayValue.block],
  ["frame", CssDisplayValue.block],
  ["frameset", CssDisplayValue.block],
  ["h1", CssDisplayValue.block],
  ["h2", CssDisplayValue.block],
  ["h3", CssDisplayValue.block],
  ["h4", CssDisplayValue.block],
  ["h5", CssDisplayValue.block],
  ["h6", CssDisplayValue.block],
  ["noframes", CssDisplayValue.block],
  ["ol", CssDisplayValue.block],
  ["p", CssDisplayValue.block],
  ["ul", CssDisplayValue.block],
  ["center", CssDisplayValue.block],
  ["dir", CssDisplayValue.block],
  ["hr", CssDisplayValue.block],
  ["menu", CssDisplayValue.block],
  ["pre", CssDisplayValue.block],
  ["li", CssDisplayValue.listItem],
  ["head", CssDisplayValue.none]
])

/**
 * Returns the CSS Display type for the specified element
 * @param elementTypeName The name of a document language element type (e.g. div, span, etc.).
 */
function getElementDisplay(elementTypeName: string): CssDisplayValue {
  /**
   * See https://www.w3.org/TR/CSS22/sample.html for how we identify block elements in HTML.
   * A less concise but more current reference for HTML5 is at https://html.spec.whatwg.org/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints
   */
  let display = elementToDisplayMap.get(elementTypeName)
  if (display === undefined) {
    // default to inline:
    display = CssDisplayValue.inline
  }
  return display
}

export interface CssBoxConstructor {
  (
    context: LayoutContext,
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string
  ): CssBox
}

/**
 * Creates the function that creates @see CssBox objects. It will handle incorporating any mappers from plugins.
 * We use this to make sure that plugins can modify the boxes created by other plugins/builders.
 * @param plugins The list of plugins
 * @param mapperName Whether we're dealing with inline or block boxes.
 */
function createCssBoxConstructor(
  plugins: RenderPlugin[],
  boxType: BoxType
): CssBoxConstructor {
  let creator: CssBoxConstructor = (
    context: LayoutContext,
    textContent: string,
    children: CssBox[],
    debugNote: string
  ): CssBox => new CssBoxImp(boxType, textContent, children, debugNote)
  /* for reference, this is what an identity BoxMapper looks like:
   * const identityMapper: BoxMapper = (context: LayoutContext, box: CssBox) => box
   */
  if (plugins) {
    const mapperName: string =
      boxType === BoxType.inline ? "inlineBoxMapper" : "blockBoxMapper"
    const mappers: BoxMapper[] = plugins
      .filter(p => p[mapperName])
      .map(p => p[mapperName])
    for (const mapper of mappers) {
      creator = (
        context: LayoutContext,
        textContent: string,
        children: CssBox[],
        debugNote: string
      ): CssBox => {
        return mapper(
          context,
          creator(context, textContent, children, debugNote)
        )
      }
    }
  }
  return creator
}
