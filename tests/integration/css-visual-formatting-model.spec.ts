import { toMarkdown } from "../support"

it("9.2.1.1 Anonymous block boxes", async () => {
  /**
   * This demonstrates the implicit anonymous block box generation explained at https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level
   * Essentially there can be an inadvertent and incorrect break between "Some" & "text" without special handling for this in CSS
   */
  const html = "Some <b>text</b>\n<p>More text</p>"
  const md = await toMarkdown(html)
  expect(md).toEqual("Some **text**\n\nMore text")
})
