import { parseHtml } from "../src/parseHtml"

it("simple", async () => {
  const html = `<div>hi</div>`
  const dom = await parseHtml(html)
  const actual = JSON.stringify(dom, domStringifyReplacer)
  const expected =
    '[{"type":"tag","name":"div","attribs":{},"children":[{"data":"hi","type":"text","next":null,"prev":null,"parent":null}],"next":null,"prev":null,"parent":null}]'
  //console.log({actual})
  expect(actual).toMatch(expected)
})

it("two", async () => {
  const html =
    "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->"
  const dom = await parseHtml(html)
  const actual = JSON.stringify(dom, domStringifyReplacer)
  //console.log({actual})
  const expected =
    '[{"data":"Xyz ' +
    '","type":"text","next":null,"prev":null,"parent":null},{"type":"script","name":"script","attribs":{"language":"javascript"},"children":[{"data":"var ' +
    "foo = '<<bar>>';< / script><!--<!-- Waah! -- " +
    '-->","type":"text","next":null,"prev":null,"parent":null}],"next":null,"prev":null,"parent":null}]'
  expect(actual).toMatch(expected)
})

function domStringifyReplacer(key: string, value: any) {
  const ignoredProperties = ["prev", "next", "parent"]
  return ignoredProperties.includes(key) ? null : value
}
