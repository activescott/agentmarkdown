import { CssBox, BoxType, FormattingContext } from "./CssBox"

describe("formattingContext", () => {
  it("should be inline with only inlines", () => {
    let rootBox = new CssBox(BoxType.block, "", [
      new CssBox(BoxType.inline),
      new CssBox(BoxType.inline),
      new CssBox(BoxType.inline)
    ])
    expect(rootBox.formattingContext).toBe(FormattingContext.inline)
  })

  it("should be block with only blocks", () => {
    let rootBox = new CssBox(BoxType.block, "", [
      new CssBox(BoxType.block),
      new CssBox(BoxType.block),
      new CssBox(BoxType.block)
    ])
    expect(rootBox.formattingContext).toBe(FormattingContext.block)
  })

  it("should be block with inlines & blocks", () => {
    let rootBox = new CssBox(BoxType.block, "", [
      new CssBox(BoxType.inline),
      new CssBox(BoxType.block),
      new CssBox(BoxType.inline)
    ])
    expect(rootBox.formattingContext).toBe(FormattingContext.block)
  })
})
