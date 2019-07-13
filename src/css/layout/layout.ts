import { HtmlNode } from "../../HtmlNode"
import { BoxType, CssBox, FormattingContext } from "../CssBox"
import { normalizeWhitespace } from "../"
import { LayoutContext } from "./LayoutContext"
import { StyleState } from "./StyleState"
import { BoxBuilders, BoxBuilder } from "./BoxBuilders"

/**
 * Implements the CSS Visual Formatting model's box generation algorithm. It turns HTML elements into a set of CSS Boxes.
 * See https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro
 */
export function layout(document: Iterable<HtmlNode>): CssBox {
  const context = new LayoutContext()
  // NOTE: we want a single root box so that the if the incoming HTML is a fragment (e.g. <span>a</span> <span>b</span>) it will still figure out it's own formatting context.
  const body = new CssBox(BoxType.block, "", [], "body")
  for (const node of document) {
    const box = generateElementBox(context, node)
    box && body.addChild(box)
  }
  //console.debug(traceBoxTree(body))
  return body
}

function traceBoxTree(box: CssBox, indent = 0): string {
  const typeStr = (type: BoxType) =>
    type === BoxType.inline ? "inline" : "block"
  const fcStr = (fc: FormattingContext) =>
    fc === FormattingContext.inline ? "inline" : "block"
  const boxStr = (b: CssBox) =>
    "CssBox " +
    (b == null
      ? "<null>"
      : JSON.stringify({
          type: typeStr(b.type),
          fc: fcStr(b.formattingContext),
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
 * Generates zero or more CSS boxes for the specified element.
 * See https://www.w3.org/TR/CSS22/visuren.html#propdef-display
 * @param element The element to generate a box for
 */
export function generateElementBox(
  context: LayoutContext,
  element: HtmlNode
): CssBox | null {
  let box: CssBox = null
  if (element.type === "text") {
    const text = normalizeWhitespace(
      element.data,
      new StyleState(context).whitespaceHandling
    )
    if (text) {
      // only create a box if normalizeWhitespace left something over
      box = new CssBox(BoxType.inline, text, [], "textNode")
    }
  } else if (element.type === "tag") {
    const boxBuilder = getBoxBuilderForElement(element.name)
    try {
      box = boxBuilder(context, element)
    } catch (e) {
      throw new Error(
        `boxbuilder (${JSON.stringify(
          boxBuilder
        )}) error for element ${JSON.stringify(element.name)}: ${e}`
      )
    }
  } else {
    console.error(`Ignoring element with type ${element.type}`)
    box = null
  }
  return box
}

/**
 * Returns @see BlockBuilder for specified element.
 * @param elementName name/tag of element
 */
function getBoxBuilderForElement(elementName: string): BoxBuilder {
  const builders = new Map<string, BoxBuilder>([
    ["ul", BoxBuilders.list],
    ["ol", BoxBuilders.list],
    ["li", BoxBuilders.listItem],
    ["h1", BoxBuilders.headingThunk(1)],
    ["h2", BoxBuilders.headingThunk(2)],
    ["h3", BoxBuilders.headingThunk(3)],
    ["h4", BoxBuilders.headingThunk(4)],
    ["h5", BoxBuilders.headingThunk(5)],
    ["h6", BoxBuilders.headingThunk(6)],
    ["b", BoxBuilders.emphasisThunk("**")],
    ["strong", BoxBuilders.emphasisThunk("**")],
    ["i", BoxBuilders.emphasisThunk("*")],
    ["em", BoxBuilders.emphasisThunk("*")],
    ["u", BoxBuilders.emphasisThunk("_")],
    ["a", BoxBuilders.link],
    ["hr", BoxBuilders.hr],
    ["br", BoxBuilders.br],
    ["pre", BoxBuilders.pre],
    ["code", BoxBuilders.code]
  ])
  let builder = builders.get(elementName)
  if (!builder) {
    const display = getElementDisplay(elementName)
    if (display === CssDisplayValue.block) {
      builder = BoxBuilders.genericBlock
    } else if (display === CssDisplayValue.inline) {
      builder = BoxBuilders.genericInline
    } else if (display === CssDisplayValue.listItem) {
      builder = BoxBuilders.listItem
    } else {
      throw new Error("unexpected element and unexpected display")
    }
  }
  return builder
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
  // See https://www.w3.org/TR/CSS22/sample.html for how we identify block elements in HTML:
  let display = elementToDisplayMap.get(elementTypeName)
  if (display === undefined) {
    // default to inline:
    display = CssDisplayValue.inline
  }
  return display
}
