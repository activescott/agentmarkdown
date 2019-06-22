import { HyperMarkdown } from "../src"
import { toMarkdown } from "./support";

it("div simple", async () => {
  const html = "<div>hi</div>"
  const md = await toMarkdown(html)
  expect(md).toEqual("\nhi\n")
})
