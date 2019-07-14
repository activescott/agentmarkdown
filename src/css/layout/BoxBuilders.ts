import { HtmlNode } from "../../HtmlNode"
import { BoxType, CssBox } from "../CssBox"
import { normalizeWhitespace, WhitespaceHandling } from "../"
import { ListState } from "./ListState"
import { LayoutContext } from "./LayoutContext"
import { decodeHtmlEntities } from "../../util"
import { StyleState } from "./StyleState"
import { generateElementBox } from "./layout"

export interface BoxBuilder {
  (context: LayoutContext, element: HtmlNode): CssBox | null
}

export class BoxBuilders {
  public static buildBoxes(
    context: LayoutContext,
    children: HtmlNode[]
  ): CssBox[] {
    const kids = children
      ? children
          .map(el => generateElementBox(context, el))
          .filter(childBox => childBox !== null)
      : []
    return kids
  }
  /**
   * A @see BoxBuilder suitable for generic block elements.
   */
  public static genericBlock(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    return new CssBox(
      BoxType.block,
      "",
      BoxBuilders.buildBoxes(context, element.children),
      "genericBlock"
    )
  }
  /**
   * A @see BoxBuilder suitable for generic inline elements.
   */
  public static genericInline(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    const text = element.data
      ? normalizeWhitespace(element.data, WhitespaceHandling.normal)
      : ""
    const kids = BoxBuilders.buildBoxes(context, element.children)
    // if it has no text and no kids it doesnt affect layout so, don't create a box to affect layout:
    if ((!text || text.length === 0) && kids.length === 0) {
      return null
    } else return new CssBox(BoxType.inline, text, kids, "genericInline")
  }
  /**
   * A @see BoxBuilder suitable for generic list item elements.
   */
  public static listItem(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    const listState = new ListState(context)
    listState.newListItem()
    // prepare marker box (see following for "marker box" "principal box", etc. https://www.w3.org/TR/CSS22/generate.html#lists)
    let indentSpaces = ""
    const depth = listState.getListNestingDepth()
    if (depth > 1) {
      indentSpaces = "  ".repeat(depth - 1)
    }
    let markerBox: CssBox
    if (listState.getListType() === "ul") {
      markerBox = new CssBox(
        BoxType.inline,
        indentSpaces + "* ",
        null,
        "li-marker-ul"
      )
    } else if (listState.getListType() === "ol") {
      markerBox = new CssBox(
        BoxType.inline,
        indentSpaces + `${listState.getListItemCount()}. `,
        null,
        "li-marker-ol"
      )
    } else {
      throw new Error("unexpected list type")
    }
    // add boxes for list item child elements
    const contentChildBoxes: CssBox[] = BoxBuilders.buildBoxes(
      context,
      element.children
    )
    // prepare a single parent box for the list item's content (to keep it from breaking between the marker & content)
    const contentBox = new CssBox(
      BoxType.inline,
      "",
      contentChildBoxes,
      "li-content"
    )
    const principalBox = new CssBox(
      BoxType.block,
      "",
      [markerBox, contentBox],
      "li-principal"
    )
    return principalBox
  }
  public static list(context: LayoutContext, element: HtmlNode): CssBox | null {
    if (!["ul", "ol"].includes(element.name)) {
      throw new Error(`Unexpected list type "${element.name}"`)
    }
    const listState = new ListState(context)
    const listBox = new CssBox(BoxType.block, "", [], element.name)
    listState.beginList(element.name as "ul" | "ol")
    const kids = BoxBuilders.buildBoxes(context, element.children)
    listState.endList()
    kids.forEach(kid => listBox.addChild(kid))
    return listBox
  }
  public static headingThunk(headingLevel: number): BoxBuilder {
    return (context: LayoutContext, element: HtmlNode): CssBox | null => {
      const kids = BoxBuilders.buildBoxes(context, element.children)
      const headingSequence = "#".repeat(headingLevel)
      kids.unshift(new CssBox(BoxType.inline, headingSequence + " "))
      kids.push(new CssBox(BoxType.inline, " " + headingSequence))
      return new CssBox(BoxType.block, "", kids)
    }
  }
  public static emphasisThunk(sequence: string): BoxBuilder {
    return (context: LayoutContext, element: HtmlNode): CssBox | null => {
      const kids = BoxBuilders.buildBoxes(context, element.children)
      kids.unshift(new CssBox(BoxType.inline, sequence))
      kids.push(new CssBox(BoxType.inline, sequence))
      return new CssBox(BoxType.inline, "", kids)
    }
  }
  public static link(context: LayoutContext, element: HtmlNode): CssBox | null {
    const linkBox = new CssBox(BoxType.inline, "", [])
    const childContentBoxes = BoxBuilders.buildBoxes(context, element.children)
    // wrap the text in square brackets:
    childContentBoxes.unshift(
      new CssBox(BoxType.inline, "[", [], "link-helper-open-text")
    )
    childContentBoxes.push(
      new CssBox(BoxType.inline, "]", [], "link-helper-close-text")
    )
    // add destination/title syntax:
    const href =
      element.attribs && element.attribs["href"] ? element.attribs["href"] : ""
    const title =
      element.attribs && element.attribs["title"]
        ? '"' + element.attribs["title"] + '"'
        : ""
    let destinationMarkup = "(" + href
    if (title) {
      destinationMarkup += href ? " " + title : title
    }
    destinationMarkup += ")"
    childContentBoxes.push(
      new CssBox(
        BoxType.inline,
        destinationMarkup,
        [],
        "link-helper-close-text"
      )
    )
    // add the child boxes:
    childContentBoxes.forEach(kid => linkBox.addChild(kid))
    return linkBox
  }
  public static hr(): CssBox | null {
    return new CssBox(BoxType.block, "* * *")
  }
  public static br(): CssBox | null {
    return new CssBox(BoxType.inline, "\n")
  }
  public static pre(context: LayoutContext, element: HtmlNode): CssBox | null {
    const styleState = new StyleState(context)
    styleState.pushWhitespaceHandling(WhitespaceHandling.pre)
    // kids is likely a single text element
    const kids = BoxBuilders.buildBoxes(context, element.children)
    const decode = (box: CssBox): void => {
      box.textContent = decodeHtmlEntities(box.textContent)
      for (const child of box.children) {
        decode(child)
      }
    }
    kids.forEach(kid => decode(kid))
    kids.unshift(new CssBox(BoxType.block, "```"))
    kids.push(new CssBox(BoxType.block, "```"))
    styleState.popWhitespaceHandling()
    return new CssBox(BoxType.block, "", kids)
  }
  public static code(context: LayoutContext, element: HtmlNode): CssBox | null {
    // kids is likely a single text element
    const kids = BoxBuilders.buildBoxes(context, element.children)
    // If we're already nested inside of a <pre> element, don't output the inline code formatting (using the "whitespaceHandling" mode here is a bit of a risky assumption used to make this conclusion)
    if (new StyleState(context).whitespaceHandling != WhitespaceHandling.pre) {
      kids.unshift(new CssBox(BoxType.inline, "`"))
      kids.push(new CssBox(BoxType.inline, "`"))
    }
    return new CssBox(BoxType.block, "", kids)
  }
}
