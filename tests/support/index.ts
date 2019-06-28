import { HypertextMarkdown } from "../../src"
export { MockHtmlNode } from "./MockHtmlNode"

export async function toMarkdown(html: string): Promise<string> {
  const out = await HypertextMarkdown.produce(html)

  if (process.env.DEBUG) {
    console.log("----- HTML -----")
    console.log(html)
    console.log("-----  MD  -----")
    console.log(out)
    console.log("----------------")
  }
  return out
}
