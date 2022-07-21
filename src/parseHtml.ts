import * as htmlparser from "htmlparser2"
import { HtmlNode } from "./HtmlNode"

export function parseHtml(html: string): Promise<HtmlNode[]> {
  return new Promise<HtmlNode[]>((resolve, reject): void => {
    const handler = new htmlparser.DomHandler(
      function (error, dom): void {
        if (error) reject(new Error("Error parsing html into DOM"))
        else resolve(dom as HtmlNode[])
      }
    )
    const parser = new htmlparser.Parser(handler)
    parser.write(html)
    parser.end()
  })
}

export function traceHtmlNodes(nodes: HtmlNode[], indent: number = 0): string {
  // eslint-disable-line @typescript-eslint/no-unused-vars
  let output = ""
  for (const child of nodes) {
    output += traceHtmlNode(child, indent)
  }
  return output
}

function traceHtmlNode(node: HtmlNode, indent: number = 0): string {
  const nameStr = (node: HtmlNode): string => (node.tagName ? node.tagName : "")
  const dataStr = (node: HtmlNode): string => (node.data ? node.data : "")
  let output =
    "  ".repeat(indent) +
    "HtmlNode " +
    JSON.stringify({
      type: node.type,
      name: nameStr(node),
      data: dataStr(node),
    }) +
    "\n"
  if (node && node.children) {
    output += traceHtmlNodes(node.children, indent + 1)
  }
  return output
}
