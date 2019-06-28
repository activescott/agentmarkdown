import { CssBox, BoxType, FormattingContext } from "./CssBox"
import { HtmlNode } from "../HtmlNode"
import { MockHtmlNode } from "../../tests/support"

describe("formattingContext", () => {
  it("should be inline with only inlines", () => {
    let rootNode: HtmlNode = new MockHtmlNode("element", "div")
    let childNodes: HtmlNode[] = [
      new MockHtmlNode("element", "b"),
      new MockHtmlNode("element", "i"),
      new MockHtmlNode("text", "", "hello world")
    ]
    const childBoxes: CssBox[] = childNodes.map(
      n => new CssBox(n, BoxType.inline)
    )
    let rootBox = new CssBox(rootNode, BoxType.block)
    childBoxes.forEach(b => rootBox.addChild(b))
    expect(rootBox.formattingContext).toBe(FormattingContext.inline)
  })

  it("should be block with only blocks", () => {
    let rootNode: HtmlNode = new MockHtmlNode("element", "div")
    let childNodes: HtmlNode[] = [
      new MockHtmlNode("element", "div"),
      new MockHtmlNode("element", "h1")
    ]
    const childBoxes: CssBox[] = childNodes.map(
      n => new CssBox(n, BoxType.block)
    )
    let rootBox = new CssBox(rootNode, BoxType.block)
    childBoxes.forEach(b => rootBox.addChild(b))
    expect(rootBox.formattingContext).toBe(FormattingContext.block)
  })

  it("should be block with inlines & blocks", () => {
    let rootNode: HtmlNode = new MockHtmlNode("element", "div")
    let childNodes: HtmlNode[] = [
      new MockHtmlNode("element", "b"),
      new MockHtmlNode("element", "div"),
      new MockHtmlNode("text", "", "hello world")
    ]
    const childBoxes: CssBox[] = [
      new CssBox(childNodes[0], BoxType.inline),
      new CssBox(childNodes[1], BoxType.block),
      new CssBox(childNodes[2], BoxType.inline)
    ]
    let rootBox = new CssBox(rootNode, BoxType.block)
    childBoxes.forEach(b => rootBox.addChild(b))
    expect(rootBox.formattingContext).toBe(FormattingContext.block)
  })
})
