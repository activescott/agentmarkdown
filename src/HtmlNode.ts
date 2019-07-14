/**
 * Represents an HTML DOM node.
 */
export interface HtmlNode {
  /**
   * The raw text for "text" nodes
   */
  data?: string
  /**
   * The type of node.
   */
  type: HtmlNodeType
  /**
   * The name of the node when @see type is "tag"
   */
  name: string
  attribs?: AttribsType
  children?: HtmlNode[]
}

export interface AttribsType {
  [s: string]: string
}

export type HtmlNodeType =
  | "element"
  | "text"
  | "cdata"
  | "comment"
  | "tag"
  | "directive"
  | "script"
  | "style"
  | "doctype"
