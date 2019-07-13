import * as htmlparser from "htmlparser2"
import { HtmlNode } from "./HtmlNode"

export function parseHtml(html: string): Promise<HtmlNode[]> {
  return new Promise<HtmlNode[]>((resolve, reject) => {
    const handler = new htmlparser.DomHandler(
      function(error, dom) {
        if (error) reject(new Error("Error parsing html into DOM"))
        else resolve(<HtmlNode[]>dom)
      },
      { normalizeWhitespace: false }
    )
    const parser = new htmlparser.Parser(handler)
    parser.write(html)
    parser.end()
  })
}

export function traceHtmlNodes(nodes: HtmlNode[], indent: number = 0): string {
  let output = ""
  for (const child of nodes) {
    output += traceHtmlNode(child, indent)
  }
  return output
}

function traceHtmlNode(node: HtmlNode, indent: number = 0): string {
  const nameStr = node => (node.name ? node.name : "")
  const dataStr = node => (node.data ? node.data : "")
  let output =
    "  ".repeat(indent) +
    "HtmlNode " +
    JSON.stringify({
      type: node.type,
      name: nameStr(node),
      data: dataStr(node)
    }) +
    "\n"
  if (node && node.children) {
    output += traceHtmlNodes(node.children, indent + 1)
  }
  return output
}
