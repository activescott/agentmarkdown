import { toMarkdown } from "../support"

// https://spec.commonmark.org/0.29/#links
describe("links", () => {
  it("link text, title, destination", async () => {
    // https://spec.commonmark.org/0.29/#example-481
    const html = `<p><a href="/uri" title="title">link</a></p>`
    const expected = `[link](/uri "title")`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("https://spec.commonmark.org/0.29/#example-482", async () => {
    const html = `<p><a href="/uri">link</a></p>`
    const expected = `[link](/uri)`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("https://spec.commonmark.org/0.29/#example-483", async () => {
    const html = `<p><a href="">link</a></p>`
    const expected = `[link]()`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })
})
