/**
 * Represents an HTML DOM node.
 */
export interface HtmlNode {
  /**
   * The raw text for "text" nodes
   */
  data?: any
  /**
   * The type of node.
   */
  type:
    | "element"
    | "text"
    | "cdata"
    | "comment"
    | "tag"
    | "directive"
    | "script"
    | "style"
    | "doctype"
  /**
   * The name of the node when @see type is "tag"
   */
  name: string
  attribs?: {
    [s: string]: string
  }
  children?: HtmlNode[]
}
