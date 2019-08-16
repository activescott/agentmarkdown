import { LayoutPlugin, BoxType, CssBox, LayoutTransformer } from "../.."
import { CssBoxImp } from "../CssBoxImp"
import { LayoutContext } from "../../LayoutContext"

export class CssBoxFactory {
  public createBox: CssBoxFactoryFunc

  public constructor(plugins: LayoutPlugin[]) {
    const transformers = plugins.filter(p => p.transform).map(p => p.transform)
    this.createBox = CssBoxFactory.createBoxFactoryFunc(transformers)
  }

  /**
   * Creates the function that creates @see CssBox objects. It will handle incorporating any transformers from plugins.
   * We use this to make sure that plugins can modify the boxes created by other plugins/transformers.
   */
  private static createBoxFactoryFunc(
    transformers: LayoutTransformer[]
  ): CssBoxFactoryFunc {
    const transform = CssBoxFactory.createTransformFunc(transformers)
    return (
      context: LayoutContext,
      boxType: BoxType,
      textContent: string = "",
      children: Iterable<CssBox> = [],
      debugNote: string = ""
    ) => {
      let box: CssBox = new CssBoxImp(boxType, textContent, children, debugNote)
      box = transform(context, box)
      return box
    }
  }

  private static createTransformFunc(
    transformers: LayoutTransformer[]
  ): (context: LayoutContext, box: CssBox) => CssBox {
    return (context: LayoutContext, box: CssBox) => {
      transformers.forEach((transform, index) => {
        // create a box factory that includes all the prior transformers, but not the current one (because it could also create a box and cause a infinite loop)
        const boxFactory = CssBoxFactory.createBoxFactoryFunc(
          transformers.slice(0, index)
        )
        box = transform(context, boxFactory, box)
      })
      return box
    }
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
