import { HtmlNode } from "../HtmlNode"
import { BoxType, CssBox } from "./CssBox"
import { normalizeWhitespace, WhitespaceHandling } from "."

/**
 * Implements the CSS Visual Formatting model's box generation algorithm. It turns HTML elements into a set of CSS Boxes.
 * See https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro
 */
export function layout(document: Iterable<HtmlNode>): Iterable<CssBox> {
  const boxes = new Array<CssBox>()
  for (let node of document) {
    const box = generateElementBox(node)
    box && boxes.push(box)
  }
  return boxes
}

/**
 * Generates zero or more CSS boxes for the specified element.
 * See https://www.w3.org/TR/CSS22/visuren.html#propdef-display
 * @param element The element to generate a box for
 */
function generateElementBox(element: HtmlNode): CssBox | null {
  let box: CssBox = null
  if (element.type === "text") {
    const text = normalizeWhitespace(element.data, WhitespaceHandling.normal)
    if (text) {
      // only create a box if normalizeWhitespace left something over
      box = new CssBox(BoxType.inline, text)
    }
  } else if (element.type === "tag") {
    const display = getElementDisplay(element.name)
    const boxBuilder = getBoxBuilder(display)
    box = boxBuilder(element)
  } else {
    console.error(`Ignoring element with type ${element.type}`)
    box = null
  }
  return box
}

function getBoxBuilder(
  display: CssDisplayValue
): (element: HtmlNode) => CssBox | null {
  const builders = new Map<CssDisplayValue, (element: HtmlNode) => CssBox>([
    [
      CssDisplayValue.block,
      element => {
        const kids = element.children
          ? element.children
              .map(el => generateElementBox(el))
              .filter(childBox => childBox !== null)
          : []
        return new CssBox(BoxType.block, "", kids)
      }
    ],
    [
      CssDisplayValue.inline,
      element => {
        const kids = element.children
          ? element.children
              .map(el => generateElementBox(el))
              .filter(childBox => childBox !== null)
          : []
        const text = element.data ? element.data : ""
        return new CssBox(BoxType.inline, text, kids)
      }
    ],
    [
      CssDisplayValue.listItem,
      element => {
        const principleBox = new CssBox(BoxType.block)
        const markerBox = new CssBox(BoxType.inline, "* ")
        const childBoxes: CssBox[] = element.children.map(el => {
          const builder = getBoxBuilder(getElementDisplay(el.name))
          return builder(el)
        })
        principleBox.addChild(markerBox)
        childBoxes.forEach(cb => cb && principleBox.addChild(cb))
        return principleBox
      }
    ],
    [CssDisplayValue.none, element => null]
  ])
  return builders.get(display)
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
