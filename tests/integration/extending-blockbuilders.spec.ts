import { AgentMarkdown, CssBox, LayoutContext, HtmlNode } from "../../src"

function customEmphasisRenderer(
  context: LayoutContext,
  element: HtmlNode
): CssBox | null {
  const kids = context.buildBoxes(context, element.children)
  kids.unshift(context.createInlineBox("_"))
  kids.push(context.createInlineBox("_"))
  return context.createInlineBox("", kids)
}

it("should allow overriding existing elements with custom BoxBuilder", async () => {
  const result = await AgentMarkdown.render({
    html: "<b>my bold</b>",
    renderPlugins: [
      {
        elementName: "b",
        renderer: customEmphasisRenderer
      }
    ]
  })
  expect(result.markdown).toEqual("_my bold_")
})

it("should allow rendering new elements with custom BoxBuilder", async () => {
  const result = await AgentMarkdown.render({
    html: "<mycustomelement>custom content</mycustomelement>",
    renderPlugins: [
      {
        elementName: "mycustomelement",
        renderer: customEmphasisRenderer
      }
    ]
  })
  expect(result.markdown).toEqual("_custom content_")
})

it("should allow customizing created boxes with BoxMapper", async () => {
  const result = await AgentMarkdown.render({
    html: "<blockquote><b>my bold</b></blockquote>",
    renderPlugins: [
      {
        elementName: "b",
        renderer: customEmphasisRenderer,
        blockBoxMapper: (context: LayoutContext, box: CssBox): CssBox => {
          return context.createBlockBox("> ", [box])
        }
      }
    ]
  })
  expect(result.markdown).toEqual("> _my bold_")
})
