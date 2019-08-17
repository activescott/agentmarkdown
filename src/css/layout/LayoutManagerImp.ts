import { CssBox, HtmlNode, LayoutContext, BoxType } from "../.."
import { CssBoxFactory } from "./CssBoxFactory"
import BoxBuilderManager from "./BoxBuilderManager"
import { LayoutManager } from "../../LayoutManager"
import { CssBoxImp } from "../CssBoxImp"

export class LayoutManagerImp implements LayoutManager {
  public constructor(
    private readonly boxFactory: CssBoxFactory,
    private readonly builder: BoxBuilderManager
  ) {}

  public layout(context: LayoutContext, elements: HtmlNode[]): CssBox[] {
    return this.builder.buildBoxes(context, this, elements)
  }

  public createBox(
    state: LayoutContext,
    boxType: BoxType,
    textContent: string = "",
    children: Iterable<CssBox> = [],
    debugNote: string = ""
  ): CssBox {
    return new CssBoxImp(boxType, textContent, children, debugNote)
  }
}
