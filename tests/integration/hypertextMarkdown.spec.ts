import { toMarkdown } from "../support"

it("div simple", async () => {
  const html = "<div>hi</div>"
  const md = await toMarkdown(html)
  expect(md).toEqual("hi")
})

it("div 2 simple", async () => {
  const html = "<div>hello</div><div>world</div>"
  const md = await toMarkdown(html)
  expect(md).toEqual("hello\nworld")
})
