import { LayoutPlugin, HtmlNode, LayoutContext, CssBox, BoxType } from "../.."
import { LayoutManager } from "../../LayoutManager"
import { CssBoxFactoryFunc } from "./CssBoxFactory"

class BlockquotePlugin implements LayoutPlugin {
  public elementName: string = "blockquote"

  public layout(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const state = new BlockquoteState(context)
    state.beginBlockquote()
    const kids = manager.layout(context, element.children)
    state.endBlockquote()
    return manager.createBox(context, BoxType.block, "", kids)
  }

  // for any block box (i.e. those that create a new line), insert blockquote styling:
  public transform(
    context: LayoutContext,
    boxFactory: CssBoxFactoryFunc,
    box: CssBox
  ): CssBox {
    if (box.type === BoxType.inline) return box
    let finalBox = box
    const state = new BlockquoteState(context)
    const depth = state.blockquoteNestingDepth
    if (depth > 0) {
      //console.debug("DEPTH:", depth)
      // we're within at least one level of blockquote:
      const stylingPrefix = "> ".repeat(depth)
      const styleBox: CssBox = boxFactory(
        context,
        BoxType.block,
        stylingPrefix,
        [box],
        "blockQuoteAnon"
      )
      finalBox = styleBox
    }
    return finalBox
  }
}

export default BlockquotePlugin

class BlockquoteState {
  private static readonly BlockquoteNestingDepthKey: string =
    "blockquote-nesting-depth-key"

  public constructor(readonly context: LayoutContext) {}

  public endBlockquote(): void {
    this.context.popState(BlockquoteState.BlockquoteNestingDepthKey)
  }

  public beginBlockquote(): void {
    this.context.pushState(BlockquoteState.BlockquoteNestingDepthKey, 0)
  }

  public get blockquoteNestingDepth(): number {
    const stack = this.context.getStateStack(
      BlockquoteState.BlockquoteNestingDepthKey
    )
    return stack.length
  }
}
