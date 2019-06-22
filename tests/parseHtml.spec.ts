import { parseHtml } from "../src/parseHtml"

it("one", async () => {
  var rawHtml =
    "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->"
  const html = `
  <div>hi</div>
  `
  console.log(await parseHtml(html))
})

it("two", async () => {
  var html =
    "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->"
  console.log(await parseHtml(html))
})
