import { toMarkdown } from "../support"

// https://spec.commonmark.org/0.29/#fenced-code-blocks
// https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
describe("pre", () => {
  it("simple", async () => {
    // https://spec.commonmark.org/0.29/#example-91
    const html = `<pre>foo</pre>`
    const expected = "```\nfoo\n```"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("html entities are decoded", async () => {
    const html = `<pre>&lt;
 &gt;
</pre>`
    const expected = "```\n<\n >\n\n```"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("html entities are decoded deeply", async () => {
    const html = `<pre><code>&lt;
 &gt;
</code></pre>`
    const expected = "```\n<\n >\n\n```"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("inner <code> blocks are allowed", async () => {
    // this is called out specifically in https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
    const html = `<pre><code>foo</code></pre>`
    const expected = "```\nfoo\n```"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("inner <samp> blocks are allowed", async () => {
    // this is called out specifically in https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
    const html = `<pre><samp>foo</samp></pre>`
    const expected = "```\nfoo\n```"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("empty <pre> locks work", async () => {
    const html = `<pre></pre>`
    const expected = "```\n```"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })

  it("inline code block 1", async () => {
    // https://daringfireball.net/projects/markdown/syntax#code
    // similar to https://spec.commonmark.org/0.29/#example-91 (which generates an inline <code> element but not a block <pre> element)
    const html = "<code>foo</code>"
    const expected = "`foo`"
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })
})
