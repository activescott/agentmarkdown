import { toMarkdown } from "../support"

describe("https://spec.commonmark.org/0.29/#atx-heading", () => {
  it("https://spec.commonmark.org/0.29/#example-32", async () => {
    const html = `<h1>foo</h1>
<h2>foo</h2>
<h3>foo</h3>
<h4>foo</h4>
<h5>foo</h5>
<h6>foo</h6>`
    const expected = `# foo #
## foo ##
### foo ###
#### foo ####
##### foo #####
###### foo ######`
    const md = await toMarkdown(html)
    expect(md).toEqual(expected)
  })
})
