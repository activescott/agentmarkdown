import { toMarkdown } from "./support"

it.skip("commonmark all", async () => {
  const commonMark = require("../test-data/spec.commonmark.v0.29.json")
  for (let test of commonMark) {
    const md = toMarkdown(test.html)
    expect(md).resolves.toEqual(test.markdown)
  }
})
