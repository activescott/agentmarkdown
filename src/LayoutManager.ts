import { CssBox, HtmlNode, LayoutContext } from "."
import { CssBoxFactoryFunc } from "./css/layout/CssBoxFactory"

export interface LayoutManager {
  /**
   * Creates a new @see CssBox instance.
   */
  createBox: CssBoxFactoryFunc
  /**
   * Lays out a set of @see CssBox objects for the specified HTML elements.
   */
  layout(context: LayoutContext, elements: HtmlNode[]): CssBox[]
}
