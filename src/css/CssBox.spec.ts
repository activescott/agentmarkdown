import { CssBox, BoxType } from "./CssBox"

describe("CSS 9.2.1.1 Anonymous block boxes", () => {
  /**
   * We handle the implicit anonymous block box generation explained at https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level
   * By generating the anonymous boxes when the caller calls CssBlock.children()
   */
  it("should not insert boxes with only inline children", () => {
    const children = [
      new CssBox(BoxType.inline),
      new CssBox(BoxType.inline),
      new CssBox(BoxType.inline)
    ]
    const rootBox = new CssBox(BoxType.block, "", children)
    for (const child of children) {
      expect(rootBox.children).toContainEqual(child)
    }
  })

  it("should not insert boxes with only block children", () => {
    const children = [
      new CssBox(BoxType.block),
      new CssBox(BoxType.block),
      new CssBox(BoxType.block)
    ]
    const rootBox = new CssBox(BoxType.block, "", children)
    for (const child of children) {
      expect(rootBox.children).toContainEqual(child)
    }
  })

  it("should insert anonymous block box with block & inline children", () => {
    const children = [
      new CssBox(BoxType.block),
      new CssBox(BoxType.inline),
      new CssBox(BoxType.block)
    ]
    const rootBox = new CssBox(BoxType.block, "", children)
    const actual: CssBox[] = Array.from(rootBox.children)
    expect(actual).toHaveLength(3)
    // should have the first and last:
    expect(actual).toContainEqual(children[0])
    expect(actual).toContainEqual(children[2])
    expect(actual[1]).toHaveProperty("type", BoxType.block)
    expect(Array.from(actual[1].children)).toHaveLength(1)
  })

  it("anonymous block box should collect sequences of adjacent inlines with block & inline children", () => {
    const children = [
      new CssBox(BoxType.block),
      new CssBox(BoxType.inline),
      new CssBox(BoxType.inline),
      new CssBox(BoxType.block)
    ]
    const rootBox = new CssBox(BoxType.block, "", children)
    const actual: CssBox[] = Array.from(rootBox.children)
    expect(actual).toHaveLength(3)
    // should have the first and last:
    expect(actual).toContainEqual(children[0])
    expect(actual).toContainEqual(children[3])
    // the middle one should contain the two inlines (collapsed into a single anonymous box)
    expect(actual[1]).toHaveProperty("type", BoxType.block)
    expect(Array.from(actual[1].children)).toHaveLength(2)
  })

  it("anonymous block box should not collect sequences of non-adjacent inlines with block & inline children", () => {
    const children = [
      new CssBox(BoxType.block),
      new CssBox(BoxType.inline),
      new CssBox(BoxType.block),
      new CssBox(BoxType.inline)
    ]
    const rootBox = new CssBox(BoxType.block, "", children)
    const actual: CssBox[] = Array.from(rootBox.children)
    expect(actual).toHaveLength(4)
    // should have the blocks (first and third):
    expect(actual).toContainEqual(children[0])
    expect(actual).toContainEqual(children[2])
    // check the anonymous boxes were generated:
    expect(actual[1]).toHaveProperty("type", BoxType.block)
    expect(Array.from(actual[1].children)).toHaveLength(1)
    expect(actual[3]).toHaveProperty("type", BoxType.block)
    expect(Array.from(actual[3].children)).toHaveLength(1)
  })
})
