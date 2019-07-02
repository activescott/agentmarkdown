import { HtmlNode } from "../HtmlNode"
import { BoxType, CssBox, FormattingContext } from "./CssBox"
import { normalizeWhitespace, WhitespaceHandling } from "."
import { ListState } from "./ListState"
import { LayoutContext } from "./LayoutContext"
import { decodeHtmlEntities } from "../util"
import { StyleState } from "./StyleState"

/**
 * Implements the CSS Visual Formatting model's box generation algorithm. It turns HTML elements into a set of CSS Boxes.
 * See https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro
 */
export function layout(document: Iterable<HtmlNode>): CssBox {
  const context = new LayoutContext()
  // NOTE: we want a single root box so that the if the incoming HTML is a fragment (e.g. <span>a</span> <span>b</span>) it will still figure out it's own formatting context.
  const body = new CssBox(BoxType.block, "", [], "body")
  for (let node of document) {
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
    for (let child of box.children) {
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
function generateElementBox(
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

interface BoxBuilder {
  (context: LayoutContext, element: HtmlNode): CssBox | null
}

class BoxBuilders {
  public static buildBoxes(context: LayoutContext, children: HtmlNode[]) {
    const kids = children
      ? children
          .map(el => generateElementBox(context, el))
          .filter(childBox => childBox !== null)
      : []
    return kids
  }

  /**
   * A @see BoxBuilder suitable for generic block elements.
   */
  public static genericBlock(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    return new CssBox(
      BoxType.block,
      "",
      BoxBuilders.buildBoxes(context, element.children),
      "genericBlock"
    )
  }

  /**
   * A @see BoxBuilder suitable for generic inline elements.
   */
  public static genericInline(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    const text = element.data
      ? normalizeWhitespace(element.data, WhitespaceHandling.normal)
      : ""
    const kids = BoxBuilders.buildBoxes(context, element.children)
    // if it has no text and no kids it doesnt affect layout so, don't create a box to affect layout:
    if ((!text || text.length === 0) && kids.length === 0) {
      return null
    } else return new CssBox(BoxType.inline, text, kids, "genericInline")
  }

  /**
   * A @see BoxBuilder suitable for generic list item elements.
   */
  public static listItem(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    ListState.newListItem(context)
    // prepare marker box (see following for "marker box" "principal box", etc. https://www.w3.org/TR/CSS22/generate.html#lists)
    let indentSpaces = ""
    const depth = ListState.getListNestingDepth(context)
    if (depth > 1) {
      indentSpaces = "  ".repeat(depth - 1)
    }
    let markerBox: CssBox
    if (ListState.getListType(context) === "ul") {
      markerBox = new CssBox(
        BoxType.inline,
        indentSpaces + "* ",
        null,
        "li-marker-ul"
      )
    } else if (ListState.getListType(context) === "ol") {
      markerBox = new CssBox(
        BoxType.inline,
        indentSpaces + `${ListState.getListItemCount(context)}. `,
        null,
        "li-marker-ol"
      )
    } else {
      throw new Error("unexpected list type")
    }
    // add boxes for list item child elements
    const contentChildBoxes: CssBox[] = BoxBuilders.buildBoxes(
      context,
      element.children
    )
    // prepare a single parent box for the list item's content (to keep it from breaking between the marker & content)
    const contentBox = new CssBox(
      BoxType.inline,
      "",
      contentChildBoxes,
      "li-content"
    )
    const principalBox = new CssBox(
      BoxType.block,
      "",
      [markerBox, contentBox],
      "li-principal"
    )
    return principalBox
  }

  public static list(context: LayoutContext, element: HtmlNode): CssBox | null {
    if (!["ul", "ol"].includes(element.name)) {
      throw new Error(`Unexpected list type "${element.name}"`)
    }
    const listBox = new CssBox(BoxType.block, "", [], element.name)
    ListState.beginList(element.name as "ul" | "ol", context)
    const kids = BoxBuilders.buildBoxes(context, element.children)
    ListState.endList(context)
    kids.forEach(kid => listBox.addChild(kid))
    return listBox
  }

  public static headingThunk(headingLevel: number): BoxBuilder {
    return (context: LayoutContext, element: HtmlNode): CssBox | null => {
      const kids = BoxBuilders.buildBoxes(context, element.children)
      const headingSequence = "#".repeat(headingLevel)
      kids.unshift(new CssBox(BoxType.inline, headingSequence + " "))
      kids.push(new CssBox(BoxType.inline, " " + headingSequence))
      return new CssBox(BoxType.block, "", kids)
    }
  }

  public static emphasisThunk(sequence: string): BoxBuilder {
    return (context: LayoutContext, element: HtmlNode): CssBox | null => {
      const kids = BoxBuilders.buildBoxes(context, element.children)
      kids.unshift(new CssBox(BoxType.inline, sequence))
      kids.push(new CssBox(BoxType.inline, sequence))
      return new CssBox(BoxType.block, "", kids)
    }
  }

  public static link(context: LayoutContext, element: HtmlNode): CssBox | null {
    const linkBox = new CssBox(BoxType.inline, "", [])
    const childContentBoxes = BoxBuilders.buildBoxes(context, element.children)
    // wrap the text in square brackets:
    childContentBoxes.unshift(
      new CssBox(BoxType.inline, "[", [], "link-helper-open-text")
    )
    childContentBoxes.push(
      new CssBox(BoxType.inline, "]", [], "link-helper-close-text")
    )
    // add destination/title syntax:
    const href =
      element.attribs && element.attribs["href"] ? element.attribs["href"] : ""
    const title =
      element.attribs && element.attribs["title"]
        ? '"' + element.attribs["title"] + '"'
        : ""
    let destinationMarkup = "(" + href
    if (title) {
      destinationMarkup += href ? " " + title : title
    }
    destinationMarkup += ")"
    childContentBoxes.push(
      new CssBox(
        BoxType.inline,
        destinationMarkup,
        [],
        "link-helper-close-text"
      )
    )
    // add the child boxes:
    childContentBoxes.forEach(kid => linkBox.addChild(kid))
    return linkBox
  }

  public static hr(context: LayoutContext, element: HtmlNode): CssBox | null {
    return new CssBox(BoxType.block, "* * *")
  }

  public static br(context: LayoutContext, element: HtmlNode): CssBox | null {
    return new CssBox(BoxType.inline, "\n")
  }

  public static pre(context: LayoutContext, element: HtmlNode): CssBox | null {
    // kids is likely a single text element
    let styleState = new StyleState(context)
    styleState.pushWhitespaceHandling(WhitespaceHandling.pre)
    const kids = BoxBuilders.buildBoxes(context, element.children)
    const decode = (box: CssBox) => {
      box.textContent = decodeHtmlEntities(box.textContent)
      for (let child of box.children) {
        decode(child)
      }
    }
    kids.forEach(kid => decode(kid))
    kids.unshift(new CssBox(BoxType.block, "```"))
    kids.push(new CssBox(BoxType.block, "```"))
    styleState.popWhitespaceHandling()
    return new CssBox(BoxType.block, "", kids)
  }
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
    ["pre", BoxBuilders.pre]
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

/**
 * Returns the CSS Display type for the specified element
 * @param elementTypeName The name of a document language element type (e.g. div, span, etc.).
 */
function getElementDisplay(elementTypeName: string): CssDisplayValue {
  // See https://www.w3.org/TR/CSS22/sample.html for how we identify block elements in HTML:
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
  let display = elementToDisplayMap.get(elementTypeName)
  if (display === undefined) {
    // default to inline:
    display = CssDisplayValue.inline
  }
  return display
}
