import { HtmlNode } from "../../HtmlNode"
import { BoxType, CssBox, LayoutContext, LayoutPlugin } from "../../"
import { LayoutContextImp } from "./LayoutContextImp"
import { CssBoxImp } from "../CssBoxImp"
import { CssBoxFactory } from "./CssBoxFactory"
import { LayoutManagerImp } from "./LayoutManagerImp"
import LayoutGeneratorManager from "./LayoutGeneratorManager"

/**
 * Implements the CSS Visual Formatting model's box generation algorithm. It turns HTML elements into a set of CSS Boxes.
 * See https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro
 */
export function layout(document: HtmlNode[], plugins: LayoutPlugin[]): CssBox {
  const context: LayoutContext = new LayoutContextImp()
  const boxFactory = new CssBoxFactory()
  const LayoutGenerator = new LayoutGeneratorManager(plugins, boxFactory)
  const manager = new LayoutManagerImp(boxFactory, LayoutGenerator)
  // NOTE: we want a single root box so that the if the incoming HTML is a fragment (e.g. <span>a</span> <span>b</span>) it will still figure out it's own formatting context.
  const body = new CssBoxImp(BoxType.block, "", [], "body")
  manager.layout(context, document).forEach(box => box && body.addChild(box))
  return body
}
