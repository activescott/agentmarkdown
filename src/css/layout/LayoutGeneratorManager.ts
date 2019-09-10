import {
  LayoutPlugin,
  CssBox,
  LayoutContext,
  HtmlNode,
  BoxType,
  LayoutGenerator
} from "../.."
import { DefaultLayoutGenerators } from "./DefaultLayoutGenerators"
import { normalizeWhitespace } from ".."
import { StyleState } from "./StyleState"
import { LayoutManager } from "../../LayoutManager"

/**
 * Given a list of plugins, manages the list of @see LayoutGenerator plugins to build boxes for an element.
 */
export default class LayoutGeneratorManager {
  private readonly layoutGeneratorMap: Map<string, LayoutGenerator>

  public constructor(plugins: LayoutPlugin[]) {
    this.layoutGeneratorMap = LayoutGeneratorManager.createLayoutGeneratorMap(
      plugins
    )
  }

  private static createLayoutGeneratorMap(
    plugins: LayoutPlugin[]
  ): Map<string, LayoutGenerator> {
    const generators = new Map<string, LayoutGenerator>()
    for (const plugin of plugins) {
      generators.set(plugin.elementName, plugin.layout)
    }
    return generators
  }

  /**
   * Generates zero or more CSS boxes for the specified element.
   * See https://www.w3.org/TR/CSS22/visuren.html#propdef-display
   * @param element The element to generate a box for
   */
  public generateBox(
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null {
    let box: CssBox = null
    if (element.type === "text") {
      const text = normalizeWhitespace(
        element.data,
        new StyleState(context).whitespaceHandling
      )
      if (text) {
        // only create a box if normalizeWhitespace left something over
        box = manager.createBox(BoxType.inline, text, [], "textNode")
      }
    } else if (element.type === "tag") {
      const layoutGeneratorFunc = this.getLayoutGeneratorForElement(
        element.tagName
      )
      try {
        box = layoutGeneratorFunc(context, manager, element)
      } catch (e) {
        throw new Error(
          `LayoutGenerator (${JSON.stringify(
            layoutGeneratorFunc
          )}) error for element ${JSON.stringify(element.tagName)}: ${e}`
        )
      }
    } else if (element.type === "comment") {
      // deliberately ignored
    } else {
      box = null
    }
    return box
  }

  public generateBoxes(
    context: LayoutContext,
    manager: LayoutManager,
    elements: HtmlNode[]
  ): CssBox[] {
    const boxes = elements
      ? elements
          .map(el => this.generateBox(context, manager, el))
          .filter(childBox => childBox !== null)
      : []
    return boxes
  }

  /**
   * Returns @see LayoutGenerator for specified element.
   * @param elementName name/tag of element
   */
  private getLayoutGeneratorForElement(elementName: string): LayoutGenerator {
    let generator = this.layoutGeneratorMap.get(elementName)
    if (!generator) {
      const display = getElementDisplay(elementName)
      if (display === CssDisplayValue.block) {
        generator = DefaultLayoutGenerators.genericBlock
      } else if (display === CssDisplayValue.inline) {
        generator = DefaultLayoutGenerators.genericInline
      } else if (display === CssDisplayValue.listItem) {
        generator = DefaultLayoutGenerators.listItem
      } else if (display === CssDisplayValue.none) {
        generator = DefaultLayoutGenerators.noOp
      } else {
        throw new Error(
          `unexpected element '${elementName}' and unexpected display '${display}'.`
        )
      }
    }
    return generator
  }
}

/**
 * https://www.w3.org/TR/CSS22/visuren.html#propdef-display
 */
enum CssDisplayValue {
  block,
  inline,
  listItem,
  none
}

const elementToDisplayMap: Map<string, CssDisplayValue> = new Map<
  string,
  CssDisplayValue
>([
  ["html", CssDisplayValue.block],
  ["address", CssDisplayValue.block],
  ["blockquote", CssDisplayValue.block],
  ["body", CssDisplayValue.block],
  ["dd", CssDisplayValue.block],
  ["div", CssDisplayValue.block],
  ["dl", CssDisplayValue.block],
  ["dt", CssDisplayValue.block],
  ["fieldset", CssDisplayValue.block],
  ["form", CssDisplayValue.block],
  ["frame", CssDisplayValue.block],
  ["frameset", CssDisplayValue.block],
  ["h1", CssDisplayValue.block],
  ["h2", CssDisplayValue.block],
  ["h3", CssDisplayValue.block],
  ["h4", CssDisplayValue.block],
  ["h5", CssDisplayValue.block],
  ["h6", CssDisplayValue.block],
  ["noframes", CssDisplayValue.block],
  ["ol", CssDisplayValue.block],
  ["p", CssDisplayValue.block],
  ["ul", CssDisplayValue.block],
  ["center", CssDisplayValue.block],
  ["dir", CssDisplayValue.block],
  ["hr", CssDisplayValue.block],
  ["menu", CssDisplayValue.block],
  ["pre", CssDisplayValue.block],
  ["li", CssDisplayValue.listItem],
  ["head", CssDisplayValue.none]
])

/**
 * Returns the CSS Display type for the specified element
 * @param elementTypeName The name of a document language element type (e.g. div, span, etc.).
 */
function getElementDisplay(elementTypeName: string): CssDisplayValue {
  /**
   * See https://www.w3.org/TR/CSS22/sample.html for how we identify block elements in HTML.
   * A less concise but more current reference for HTML5 is at https://html.spec.whatwg.org/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints
   */
  let display = elementToDisplayMap.get(elementTypeName)
  if (display === undefined) {
    // default to inline:
    display = CssDisplayValue.inline
  }
  return display
}
