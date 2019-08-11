import { HtmlNode } from "../../HtmlNode"
import { normalizeWhitespace, WhitespaceHandling } from "../"
import { ListState } from "./ListState"
import { CssBox, BoxBuilder, LayoutContext } from "../.."
import { decodeHtmlEntities } from "../../util"
import { StyleState } from "./StyleState"

export class DefaultBoxBuilderFuncs {
  /**
   * A @see BoxBuilder suitable for generic block elements.
   */
  public static genericBlock(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    return context.createBlockBox(
      "",
      context.buildBoxes(context, element.children),
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
    const kids = context.buildBoxes(context, element.children)
    // if it has no text and no kids it doesn't affect layout so, don't create a box to affect layout:
    if ((!text || text.length === 0) && kids.length === 0) {
      return null
    } else return context.createInlineBox(text, kids, "genericInline")
  }
  /**
   * A @see BoxBuilder suitable for list item elements.
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
      markerBox = context.createInlineBox(
        indentSpaces + "* ",
        null,
        "li-marker-ul"
      )
    } else if (listState.getListType() === "ol") {
      markerBox = context.createInlineBox(
        indentSpaces + `${listState.getListItemCount()}. `,
        null,
        "li-marker-ol"
      )
    } else {
      throw new Error("unexpected list type")
    }
    // add boxes for list item child elements
    const contentChildBoxes: CssBox[] = context.buildBoxes(
      context,
      element.children
    )
    // prepare a single parent box for the list item's content (to keep it from breaking between the marker & content)
    const contentBox = context.createInlineBox(
      "",
      contentChildBoxes,
      "li-content"
    )
    const principalBox = context.createBlockBox(
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
    const listBox = context.createBlockBox("", [], element.name)
    listState.beginList(element.name as "ul" | "ol")
    const kids = context.buildBoxes(context, element.children)
    listState.endList()
    kids.forEach(kid => listBox.addChild(kid))
    return listBox
  }

  public static blockquote(
    context: LayoutContext,
    element: HtmlNode
  ): CssBox | null {
    const blockquoteBox = context.createBlockBox("", [], element.name)
    const kids = context.buildBoxes(context, element.children)
    kids.forEach(kid => blockquoteBox.addChild(kid))
    return blockquoteBox
  }

  public static headingThunk(headingLevel: number): BoxBuilder {
    return (context: LayoutContext, element: HtmlNode): CssBox | null => {
      const kids = context.buildBoxes(context, element.children)
      const headingSequence = "#".repeat(headingLevel)
      kids.unshift(context.createInlineBox(headingSequence + " "))
      kids.push(context.createInlineBox(" " + headingSequence))
      return context.createBlockBox("", kids)
    }
  }
  public static emphasisThunk(sequence: string): BoxBuilder {
    return (context: LayoutContext, element: HtmlNode): CssBox | null => {
      const kids = context.buildBoxes(context, element.children)
      kids.unshift(context.createInlineBox(sequence))
      kids.push(context.createInlineBox(sequence))
      return context.createInlineBox("", kids)
    }
  }
  public static link(context: LayoutContext, element: HtmlNode): CssBox | null {
    const linkBox = context.createInlineBox("")
    const childContentBoxes = context.buildBoxes(context, element.children)
    // wrap the text in square brackets:
    childContentBoxes.unshift(
      context.createInlineBox("[", [], "link-helper-open-text")
    )
    childContentBoxes.push(
      context.createInlineBox("]", [], "link-helper-close-text")
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
      context.createInlineBox(destinationMarkup, [], "link-helper-close-text")
    )
    // add the child boxes:
    childContentBoxes.forEach(kid => linkBox.addChild(kid))
    return linkBox
  }
  public static hr(context: LayoutContext): CssBox | null {
    return context.createBlockBox("* * *")
  }
  public static br(context: LayoutContext): CssBox | null {
    return context.createInlineBox("\n")
  }
  public static pre(context: LayoutContext, element: HtmlNode): CssBox | null {
    const styleState = new StyleState(context)
    styleState.pushWhitespaceHandling(WhitespaceHandling.pre)
    // kids is likely a single text element
    const kids = context.buildBoxes(context, element.children)
    const decode = (box: CssBox): void => {
      box.textContent = decodeHtmlEntities(box.textContent)
      for (const child of box.children) {
        decode(child)
      }
    }
    kids.forEach(kid => decode(kid))
    kids.unshift(context.createBlockBox("```"))
    kids.push(context.createBlockBox("```"))
    styleState.popWhitespaceHandling()
    return context.createBlockBox("", kids)
  }
  public static code(context: LayoutContext, element: HtmlNode): CssBox | null {
    // kids is likely a single text element
    const kids = context.buildBoxes(context, element.children)
    // If we're already nested inside of a <pre> element, don't output the inline code formatting (using the "whitespaceHandling" mode here is a bit of a risky assumption used to make this conclusion)
    if (new StyleState(context).whitespaceHandling != WhitespaceHandling.pre) {
      kids.unshift(context.createInlineBox("`"))
      kids.push(context.createInlineBox("`"))
    }
    return context.createBlockBox("", kids)
  }
}
