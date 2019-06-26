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
