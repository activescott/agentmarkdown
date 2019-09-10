import { LayoutPlugin, HtmlNode, LayoutContext, CssBox, BoxType } from "../.."
import { LayoutManager } from "../../LayoutManager"
import { isEmpty } from "../../util"

class BlockquotePlugin implements LayoutPlugin {
  public elementName: string = "blockquote"

  private static insertBlockquotePrefixes(
    bq: CssBox,
    context: LayoutContext,
    manager: LayoutManager
  ): void {
    /* insert the blockquote "> " prefix at the beginning of each block box that contains inlines (i.e. does /not/ start a block formatting context).
     * This approach handles things like one block box containing another (which without this check would put two prefixes in the same rendered line) by putting the prefix only on a single block that will actually create an inline
     */
    const needChecked: CssBox[] = []
    for (const ch of bq.children) {
      needChecked.push(ch)
    }
    const needPrefix: CssBox[] = []
    while (needChecked.length > 0) {
      const parent: CssBox = needChecked.pop()
      for (const box of parent.children) {
        if (box.doesEstablishBlockFormattingContext) {
          if (!isEmpty(box.children)) {
            // go one level deeper, as his children (or grandchildren) each will create a new line:
            needChecked.push(box)
          } else {
            // but if he has no children he will still create a new line in output, so we use him:
            needPrefix.push(box)
          }
        } else {
          // then this guy and all of his siblings need prefixes; they are the deepest nodes in the tree that are inlines
          // this should /really/ never happen unless there is a bug here so leaving the console
          // eslint-disable-next-line no-console
          console.assert(
            parent.doesEstablishBlockFormattingContext,
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
        manager.createBox(BoxType.inline, "> ", [], "blockquote-prefix")
      )
    })
    // if there are only inlines as children (e.g. `<blockquote>blockquote</blockquote>`), we need to add one prefix:
    if (needPrefix.length === 0) {
      if (
        !isEmpty(bq.children) &&
        BlockquotePlugin.hasOnlyInlines(bq.children)
      ) {
        bq.prependChild(
          manager.createBox(BoxType.inline, "> ", [], "blockquote-prefix")
        )
      }
    }
  }

  private static hasOnlyInlines(boxes: IterableIterator<CssBox>): boolean {
    let onlyInlines = true
    for (const box of boxes) {
      onlyInlines = onlyInlines && box.type === BoxType.inline
    }
    return onlyInlines
  }

  public layout(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const kids = manager.layout(context, element.children)
    const box = manager.createBox(BoxType.block, "", kids, "blockquote")
    //console.log("BEFORE PREFIXES:", CssBoxImp.traceBoxTree(box))
    BlockquotePlugin.insertBlockquotePrefixes(box, context, manager)
    //console.log("AFTER PREFIXES:", CssBoxImp.traceBoxTree(box))
    return box
  }
}

export default BlockquotePlugin
