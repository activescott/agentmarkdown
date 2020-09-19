import {
  AgentMarkdown,
  CssBox,
  LayoutContext,
  HtmlNode,
  LayoutGenerator,
  BoxType,
} from "../../src"
import { LayoutManager } from "../../src/LayoutManager"

const customEmphasisLayout: LayoutGenerator = (
  context: LayoutContext,
  manager: LayoutManager,
  element: HtmlNode
): CssBox | null => {
  const kids = manager.layout(context, element.children)
  kids.unshift(manager.createBox(BoxType.inline, "_"))
  kids.push(manager.createBox(BoxType.inline, "_"))
  return manager.createBox(BoxType.inline, "", kids)
}

it("should allow overriding existing elements with custom LayoutPlugin", async () => {
  const result = await AgentMarkdown.render({
    html: "<b>my bold</b>",
    layoutPlugins: [
      {
        elementName: "b",
        layout: customEmphasisLayout,
      },
    ],
  })
  expect(result.markdown).toEqual("_my bold_")
})

it("should allow rendering new elements with custom LayoutPlugin", async () => {
  const result = await AgentMarkdown.render({
    html: "<mycustomelement>custom content</mycustomelement>",
    layoutPlugins: [
      {
        elementName: "mycustomelement",
        layout: customEmphasisLayout,
      },
    ],
  })
  expect(result.markdown).toEqual("_custom content_")
})
