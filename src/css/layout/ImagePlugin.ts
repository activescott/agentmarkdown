import { LayoutPlugin, LayoutContext, HtmlNode, CssBox, BoxType } from "../.."
import { LayoutManager } from "../../LayoutManager"

export class ImagePlugin implements LayoutPlugin {
  public elementName: string = "img"

  public layout(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode,
  ): CssBox | null {
    const src = element.attribs["src"]
    const alt = element.attribs["alt"] || ""
    const title = element.attribs["title"] || ""
    const result = title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`
    const box = manager.createBox(BoxType.inline, result)
    return box
  }
}
