import { AgentMarkdown } from "../../src"
export { MockHtmlNode } from "./MockHtmlNode"

export async function toMarkdown(html: string): Promise<string> {
  const out = await AgentMarkdown.produce(html)

  if (process.env.DEBUG) {
    /* eslint-disable no-console */
    console.log("----- HTML -----")
    console.log(html)
    console.log("-----  MD  -----")
    console.log(out)
    console.log("----------------")
  }
  return out
}
