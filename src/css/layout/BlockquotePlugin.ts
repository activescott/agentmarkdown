import { LayoutPlugin, HtmlNode, LayoutContext, CssBox, BoxType } from "../.."
import { LayoutManager } from "../../LayoutManager"

class BlockquotePlugin implements LayoutPlugin {
  public elementName: string = "blockquote"

  private static insertBlockquotePrefixes(
    box: CssBox,
    context: LayoutContext,
    manager: LayoutManager
  ): void {
    /* insert the blockquote "> " prefix at the beginning of each block box that contains inlines (i.e. does /not/ start a block formatting context).
     * This approach handles things like one block box containing another (which without this check would put two prefixes in the same rendered line) by putting the prefix only on a single block that will actually create an inline
     */
    const needChecked: CssBox[] = []
    needChecked.push(box)
    const needPrefix: CssBox[] = []
    while (needChecked.length > 0) {
      const parent: CssBox = needChecked.pop()
      for (const box of parent.children) {
        if (parent.doesEstablishBlockFormattingContext) {
          // go one level deeper, as his children (or grandchildren) each will create a new line
          needChecked.push(box)
        } else {
          // then this guy and all of his siblings need prefixes; they are the deepest nodes in the tree that are inlines
          // this should /really/ never happen unless there is a bug here so leaving the console
          // eslint-disable-next-line no-console
          console.assert(
            !parent.doesEstablishBlockFormattingContext,
            `Expected the parent '${parent.debugNote}' to be establishing a new block formatting context`
          )
          //Array.prototype.forEach.call(parent.children, b => needPrefix.push(b))
          needPrefix.push(parent)
          break // we only need one prefix per line - don't add another for each child.
        }
      }
    }
    needPrefix.forEach(b => {
      b.prependChild(
        manager.createBox(
          context,
          BoxType.inline,
          "> ",
          [],
          "blockquote-prefix"
        )
      )
    })
  }

  public layout(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const kids = manager.layout(context, element.children)
    const box = manager.createBox(
      context,
      BoxType.block,
      "",
      kids,
      "blockquote"
    )
    BlockquotePlugin.insertBlockquotePrefixes(box, context, manager)
    return box
  }
}

export default BlockquotePlugin
