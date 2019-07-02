import { toMarkdown } from "../support"

// https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-br-element
// https://spec.commonmark.org/0.29/#hard-line-breaks
describe("br", () => {
  it("simple", async () => {
    const html = `foo<br />bar`
    const expected = "foo\nbar"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("open tag only", async () => {
    const html = `foo<br>bar`
    const expected = "foo\nbar"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })
})
