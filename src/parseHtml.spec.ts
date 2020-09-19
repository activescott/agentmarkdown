import { parseHtml } from "../src/parseHtml"

it("simple", async () => {
  const html = `<div>hi</div>`
  const dom = await parseHtml(html)
  const actual = dom
  const expected = [
    {
      type: "tag",
      name: "div",
      attribs: {},
      children: [{ data: "hi", type: "text" }],
    },
  ]
  expect(actual).toMatchObject(expected)
})

it("two", async () => {
  const html =
    "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->"
  const dom = await parseHtml(html)
  const actual = dom
  //console.log({actual})
  const expected = [
    {
      data: "Xyz ",
      type: "text",
    },
    {
      type: "script",
      name: "script",
      attribs: { language: "javascript" },
      children: [
        {
          data: "var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->",
          type: "text",
        },
      ],
    },
  ]
  expect(actual).toMatchObject(expected)
})
