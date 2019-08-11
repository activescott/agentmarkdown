import { MockHtmlNode } from "../../../tests/support"
import { HtmlNode } from "../../HtmlNode"
import { layout } from "./layout"
import { BoxType } from "../.."

it("should recognize block element", () => {
  const doc: HtmlNode[] = [new MockHtmlNode("tag", "div")]
  const actual = Array.from(layout(doc).children)
  expect(actual).toHaveLength(1)
  expect(actual[0]).toHaveProperty("type", BoxType.block)
})

it("should recognize inline element", () => {
  const doc: HtmlNode[] = [new MockHtmlNode("tag", "span", "hello")]
  const actual = Array.from(layout(doc).children)
  expect(actual).toHaveLength(1)
  expect(actual[0]).toHaveProperty("type", BoxType.inline)
})

it("should create children", () => {
  const childNodes: HtmlNode[] = [
    new MockHtmlNode("tag", "b", "bold", null),
    new MockHtmlNode("tag", "i", "italic", null)
  ]
  const doc: HtmlNode[] = [
    new MockHtmlNode("tag", "span", null, null, childNodes)
  ]

  const actual = Array.from(layout(doc).children)
  expect(actual).toHaveLength(1)
  expect(actual[0]).toHaveProperty("children")
  expect(Array.from(actual[0].children)).toHaveLength(2)
})
