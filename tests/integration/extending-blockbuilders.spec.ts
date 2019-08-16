import {
  AgentMarkdown,
  CssBox,
  LayoutContext,
  HtmlNode,
  LayoutGenerator,
  BoxType
} from "../../src"
import { LayoutManager } from "../../src/LayoutManager"
import { CssBoxFactoryFunc } from "../../src/css/layout/CssBoxFactory"

const customEmphasisLayout: LayoutGenerator = (
  context: LayoutContext,
  manager: LayoutManager,
  element: HtmlNode
): CssBox | null => {
  const kids = manager.layout(context, element.children)
  kids.unshift(manager.createBox(context, BoxType.inline, "_"))
  kids.push(manager.createBox(context, BoxType.inline, "_"))
  return manager.createBox(context, BoxType.inline, "", kids)
}

it("should allow overriding existing elements with custom BoxBuilder", async () => {
  const result = await AgentMarkdown.render({
    html: "<b>my bold</b>",
    layoutPlugins: [
      {
        elementName: "b",
        layout: customEmphasisLayout
      }
    ]
  })
  expect(result.markdown).toEqual("_my bold_")
})

it("should allow rendering new elements with custom BoxBuilder", async () => {
  const result = await AgentMarkdown.render({
    html: "<mycustomelement>custom content</mycustomelement>",
    layoutPlugins: [
      {
        elementName: "mycustomelement",
        layout: customEmphasisLayout
      }
    ]
  })
  expect(result.markdown).toEqual("_custom content_")
})

it("should allow customizing created boxes with transform", async () => {
  const result = await AgentMarkdown.render({
    html: "<customblockquote><b>my bold</b></customblockquote>",
    layoutPlugins: [
      {
        elementName: "customblockquote",
        layout: (
          context: LayoutContext,
          manager: LayoutManager,
          element: HtmlNode
        ): CssBox | null => {
          return manager.createBox(
            context,
            BoxType.block,
            "",
            manager.layout(context, element.children)
          )
        },
        transform: (
          context: LayoutContext,
          boxFactory: CssBoxFactoryFunc,
          box: CssBox
        ): CssBox => {
          if (box.type === BoxType.block) {
            return boxFactory(context, BoxType.block, "> ", [box])
          } else {
            return box
          }
        }
      }
    ]
  })
  expect(result.markdown).toEqual("> **my bold**")
})
