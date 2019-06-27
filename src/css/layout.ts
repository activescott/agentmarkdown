import { HtmlNode } from "../HtmlNode";
import { BoxType, CssBox } from "./CssBox";
import { filterNullChars } from "../util";

/**
 * Processes the specified document and returns a CSS-style "formatting structure".
 * The format
 * See https://www.w3.org/TR/CSS22/intro.html#processing-model
 */
export function layout(document: Iterable<HtmlNode>): Iterable<CssBox> {
  const boxes = new Array<CssBox>()
  for (let node of document) {
    const box = new CssBox(node, getBoxType(node))
    buildBoxChildren(box)
    boxes.push(box)
  }
  return boxes
}

function buildBoxChildren(box: CssBox): void {
  for (let childNode of box.element.children) {
    const childBox = new CssBox(childNode, getBoxType(childNode))
    buildBoxChildren(childBox)
    box.addChild(childBox)
  }
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
  if (!result) {
    console.warn(`No block type for node key ${JSON.stringify({key})}.`)
    result = BoxType.inline
  }
  return result
}
