import { toMarkdown } from "../support"

describe("emphasis", () => {
  // https://spec.commonmark.org/0.29/#emphasis-and-strong-emphasis
  it("should render bold", async () => {
    const html = `<b>foo</b>`
    const expected = `**foo**`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("should render strong", async () => {
    const html = `<strong>foo</strong>`
    const expected = `**foo**`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("should render italic", async () => {
    const html = `<i>foo</i>`
    const expected = `*foo*`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("should render em", async () => {
    const html = `<em>foo</em>`
    const expected = `*foo*`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("should render underline (as _emphasis_)", async () => {
    const html = `<u>foo</u>`
    const expected = `_foo_`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("should not introduce newlines", async () => {
    const html = `<b>bold</b> <strong>strong</strong> <i>italic</i> <em>em</em> <u>foo</u>`
    const expected = `**bold** **strong** *italic* *em* _foo_`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })
})
