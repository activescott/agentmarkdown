import { BoxType, CssBox } from "../.."
import { CssBoxImp } from "../CssBoxImp"
import { LayoutContext } from "../../LayoutContext"

export class CssBoxFactory {
  public constructor() {}

  public createBox(
    state: LayoutContext,
    boxType: BoxType,
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string
  ): CssBox {
    return new CssBoxImp(boxType, textContent, children, debugNote)
  }
}

export interface CssBoxFactoryFunc {
  /**
   * Creates a new @see CssBox instance.
   * @param textContent Returns any text content if this box has text to render.
   * @param children Returns any child boxes of this box.
   * @param debugNote A string to add to the box to help with debugging.
   */
  (
    state: LayoutContext,
    boxType: BoxType,
    textContent: string,
    children: Iterable<CssBox>,
    debugNote: string
  ): CssBox

  (
    state: LayoutContext,
    boxType: BoxType,
    textContent: string,
    children: Iterable<CssBox>
  ): CssBox

  (state: LayoutContext, boxType: BoxType, textContent: string): CssBox
}
