import { toMarkdown } from "../support"

// https://spec.commonmark.org/0.29/#thematic-breaks
describe("Thematic breaks", () => {
  it("simple", async () => {
    const html = `<hr />`
    const expected = `* * *` // note Daring Fireball's default is three space-separated asterisks: https://daringfireball.net/projects/markdown/syntax#hr
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })
})
