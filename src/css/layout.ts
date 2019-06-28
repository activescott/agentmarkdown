import { HtmlNode } from "../HtmlNode"
import { BoxType, CssBox } from "./CssBox"
import { filterNullChars } from "../util"

/**
 * Implements the CSS Visual Formatting model's box generation algorithm. It turns HTML elements into a set of CSS Boxes.
 * See https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro
 */
export function layout(document: Iterable<HtmlNode>): Iterable<CssBox> {
  const boxes = new Array<CssBox>()
  for (let node of document) {
    const box = generateElementBox(node)
    boxes.push(box)
  }
  return boxes
}

/**
 * Generates zero or more CSS boxes for the specified element.
 * See https://www.w3.org/TR/CSS22/visuren.html#propdef-display
 * @param element The element to generate a box for
 */
function generateElementBox(element: HtmlNode): CssBox | null {
  if (element.type === "text") {
    return new CssBox(BoxType.inline, element.data)
  } else if (element.type === "tag") {
    const display = getElementDisplay(element.name)
    const boxBuilder = getBoxBuilder(display)
    return boxBuilder(element)
  } else {
    console.error(`Ignoring element with type ${element.type}`)
    return null
  }
}

function getBoxBuilder(
  display: CssDisplayValue
): (element: HtmlNode) => CssBox | null {
  const builders = new Map<CssDisplayValue, (element: HtmlNode) => CssBox>([
    [
      CssDisplayValue.block,
      element => {
        const kids = element.children
          ? element.children.map(el => generateElementBox(el))
          : []
        return new CssBox(BoxType.block, "", kids)
      }
    ],
    [
      CssDisplayValue.inline,
      element => {
        const kids = element.children
          ? element.children.map(el => generateElementBox(el))
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

function getBoxType(node: HtmlNode): BoxType {
  const blockTypeMap = new Map<string, BoxType>([
    ["text", BoxType.inline],
    ["tag-div", BoxType.block],
    ["tag-p", BoxType.block],
    ["tag-ul", BoxType.inline],
    ["tag-ol", BoxType.inline],
    ["tag-li", BoxType.inline],
    ["tag-br", BoxType.inline],
    ["tag-em", BoxType.inline],
    ["tag-i", BoxType.inline],
    ["tag-b", BoxType.inline],
    ["tag-strong", BoxType.inline],
    ["tag-u", BoxType.inline],
    ["tag-strike", BoxType.inline],
    ["tag-del", BoxType.inline],
    ["tag-h1", BoxType.block],
    ["tag-h2", BoxType.block],
    ["tag-h3", BoxType.block],
    ["tag-h4", BoxType.block],
    ["tag-h5", BoxType.block],
    ["tag-h6", BoxType.block],
    ["tag-font", BoxType.inline],
    ["tag-span", BoxType.inline]
  ])
  const nodeName = filterNullChars(node.name)
  const nodeType = filterNullChars(node.type)
  let key: string = nodeName ? nodeType + "-" + nodeName : nodeType
  let result = blockTypeMap.get(key)
  if (result === undefined) {
    console.warn(`No block type for node key ${JSON.stringify({ key })}.`)
    result = BoxType.inline
  }
  return result
}
