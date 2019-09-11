import { HtmlNode } from "../../HtmlNode"
import { normalizeWhitespace, WhitespaceHandling } from "../"
import { ListState } from "./ListState"
import { CssBox, LayoutContext, BoxType, LayoutGenerator } from "../.."
import { decodeHtmlEntities } from "../../util"
import { StyleState } from "./StyleState"
import { LayoutManager } from "../../LayoutManager"

export class DefaultLayoutGenerators {
  /**
   * A @see LayoutGenerator suitable for generic block elements.
   */
  public static genericBlock(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    return manager.createBox(
      BoxType.block,
      "",
      manager.layout(context, element.children),
      "genericBlock"
    )
  }
  /**
   * Same as using @see genericBlock, but allows specifying a debug note to be added to each box.
   * @param debugNote the note to be added to each box created.
   */
  public static blockThunk(debugNote: string = ""): LayoutGenerator {
    return (
      context: LayoutContext,
      manager: LayoutManager,
      element: HtmlNode
    ): CssBox | null => {
      const kids = manager.layout(context, element.children)
      return manager.createBox(BoxType.block, "", kids, debugNote)
    }
  }
  /**
   * A @see LayoutGenerator suitable for generic inline elements.
   */
  public static genericInline(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const text = element.data
      ? normalizeWhitespace(element.data, WhitespaceHandling.normal)
      : ""
    const kids = manager.layout(context, element.children)
    // if it has no text and no kids it doesn't affect layout so, don't create a box to affect layout:
    if ((!text || text.length === 0) && kids.length === 0) {
      return null
    } else return manager.createBox(BoxType.inline, text, kids, "genericInline")
  }
  public static noOp(): CssBox | null {
    return null
  }

  public static paragraph(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const content = manager.createBox(
      BoxType.block,
      "",
      manager.layout(context, element.children),
      "p",
      true,
      true
    )
    return content
  }
  /**
   * A @see LayoutGenerator suitable for list item elements.
   */
  public static listItem(
    context: LayoutContext,
    manager: LayoutManager,
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
      markerBox = manager.createBox(
        BoxType.inline,
        indentSpaces + "* ",
        null,
        "li-marker-ul"
      )
    } else if (listState.getListType() === "ol") {
      markerBox = manager.createBox(
        BoxType.inline,
        indentSpaces + `${listState.getListItemCount()}. `,
        null,
        "li-marker-ol"
      )
    } else {
      throw new Error("unexpected list type")
    }
    // add boxes for list item child elements
    const contentChildBoxes: CssBox[] = manager.layout(
      context,
      element.children
    )
    // prepare a single parent box for the list item's content (to keep it from breaking between the marker & content)
    const contentBox = manager.createBox(
      BoxType.inline,
      "",
      contentChildBoxes,
      "li-content"
    )
    const principalBox = manager.createBox(
      BoxType.block,
      "",
      [markerBox, contentBox],
      "li-principal"
    )
    return principalBox
  }
  public static list(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    if (!["ul", "ol"].includes(element.tagName)) {
      throw new Error(`Unexpected list type "${element.tagName}"`)
    }
    const listState = new ListState(context)
    const listBox = manager.createBox(BoxType.block, "", [], element.tagName)
    listState.beginList(element.tagName as "ul" | "ol")
    const kids = manager.layout(context, element.children)
    listState.endList()
    kids.forEach(kid => listBox.addChild(kid))
    return listBox
  }

  public static headingThunk(headingLevel: number): LayoutGenerator {
    return (
      context: LayoutContext,
      manager: LayoutManager,
      element: HtmlNode
    ): CssBox | null => {
      const kids = manager.layout(context, element.children)
      const headingSequence = "#".repeat(headingLevel)
      kids.unshift(manager.createBox(BoxType.inline, headingSequence + " "))
      kids.push(manager.createBox(BoxType.inline, " " + headingSequence))
      const headingLine = manager.createBox(
        BoxType.block,
        "",
        kids,
        "h" + headingLevel,
        true,
        true
      )
      return headingLine
    }
  }
  public static emphasisThunk(sequence: string): LayoutGenerator {
    return (
      context: LayoutContext,
      manager: LayoutManager,
      element: HtmlNode
    ): CssBox | null => {
      const kids = manager.layout(context, element.children)
      kids.unshift(manager.createBox(BoxType.inline, sequence))
      kids.push(manager.createBox(BoxType.inline, sequence))
      return manager.createBox(BoxType.inline, "", kids, "em-principal")
    }
  }
  public static link(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const childContentBoxes = manager.layout(context, element.children)
    // wrap the text in square brackets:
    childContentBoxes.unshift(
      manager.createBox(BoxType.inline, "[", [], "link-helper-open-text")
    )
    childContentBoxes.push(
      manager.createBox(BoxType.inline, "]", [], "link-helper-close-text")
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
      manager.createBox(
        BoxType.inline,
        destinationMarkup,
        [],
        "link-helper-close-text"
      )
    )
    // add the child boxes:
    const linkPrincipal = manager.createBox(
      BoxType.inline,
      "",
      childContentBoxes,
      "link-principal"
    )
    return linkPrincipal
  }
  public static hr(
    context: LayoutContext,
    manager: LayoutManager
  ): CssBox | null {
    return manager.createBox(BoxType.block, "* * *")
  }

  public static br(
    context: LayoutContext,
    manager: LayoutManager
  ): CssBox | null {
    return manager.createBox(BoxType.inline, "\n")
  }
  public static pre(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    const styleState = new StyleState(context)
    styleState.pushWhitespaceHandling(WhitespaceHandling.pre)
    // kids is likely a single text element
    const kids = manager.layout(context, element.children)
    const decode = (box: CssBox): void => {
      box.textContent = decodeHtmlEntities(box.textContent)
      for (const child of box.children) {
        decode(child)
      }
    }
    kids.forEach(kid => decode(kid))
    kids.unshift(manager.createBox(BoxType.block, "```"))
    kids.push(manager.createBox(BoxType.block, "```"))
    styleState.popWhitespaceHandling()
    return manager.createBox(BoxType.block, "", kids)
  }
  public static code(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    // kids is likely a single text element
    const kids = manager.layout(context, element.children)
    // If we're already nested inside of a <pre> element, don't output the inline code formatting (using the "whitespaceHandling" mode here is a bit of a risky assumption used to make this conclusion)
    if (new StyleState(context).whitespaceHandling != WhitespaceHandling.pre) {
      kids.unshift(manager.createBox(BoxType.inline, "`"))
      kids.push(manager.createBox(BoxType.inline, "`"))
    }
    return manager.createBox(BoxType.block, "", kids)
  }
}
