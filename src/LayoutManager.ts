import { CssBox, HtmlNode, LayoutContext, BoxType } from "."

export interface LayoutManager {
  /**
   * Creates a new @see CssBox instance.
   * @param textContent Returns any text content if this box has text to render.
   * @param children Returns any child boxes of this box.
   * @param debugNote A string to add to the box to help with debugging.
   * @param topMargin @see CssBox.topMargin
   * @param bottomMargin @see CssBox.bottomMargin
   */
  createBox(
    boxType: BoxType,
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string,
    topMargin: boolean,
    bottomMargin: boolean,
  ): CssBox

  /**
   * Creates a new @see CssBox instance.
   */
  createBox(
    boxType: BoxType,
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string,
  ): CssBox
  /**
   * Creates a new @see CssBox instance.
   */
  createBox(
    boxType: BoxType,
    textContent: string,
    children: Iterable<CssBox>,
  ): CssBox
  /**
   * Creates a new @see CssBox instance.
   */
  createBox(boxType: BoxType, textContent: string): CssBox
  /**
   * Lays out a set of @see CssBox objects for the specified HTML elements.
   */
  layout(context: LayoutContext, elements: HtmlNode[]): CssBox[]
}
