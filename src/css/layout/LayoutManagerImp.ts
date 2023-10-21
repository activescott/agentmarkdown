import { CssBox, HtmlNode, LayoutContext, BoxType } from "../.."
import LayoutGeneratorManager from "./LayoutGeneratorManager"
import { LayoutManager } from "../../LayoutManager"
import { CssBoxImp } from "../CssBoxImp"

export class LayoutManagerImp implements LayoutManager {
  public constructor(private readonly generator: LayoutGeneratorManager) {}

  public layout(context: LayoutContext, elements: HtmlNode[]): CssBox[] {
    return this.generator.generateBoxes(context, this, elements)
  }

  public createBox(
    boxType: BoxType,
    textContent: string = "",
    children: Iterable<CssBox> = [],
    debugNote: string = "",
    topMargin: boolean = false,
    bottomMargin: boolean = false,
  ): CssBox {
    return new CssBoxImp(
      boxType,
      textContent,
      children,
      debugNote,
      topMargin,
      bottomMargin,
    )
  }
}
