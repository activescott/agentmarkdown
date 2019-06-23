import { HyperMarkdown } from "../../src"

export async function toMarkdown(html: string): Promise<string> {
  const out = await HyperMarkdown.produce(html)

  if (process.env.DEBUG) {
    console.log("----- HTML -----")
    console.log(html)
    console.log("-----  MD  -----")
    console.log(out)
    console.log("----------------")
  }
  return out
}
