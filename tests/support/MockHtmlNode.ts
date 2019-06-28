import { HtmlNode, HtmlNodeType, AttribsType } from "../../src/HtmlNode"

export class MockHtmlNode implements HtmlNode {
  constructor(
    readonly type: HtmlNodeType,
    readonly name: string,
    readonly data?: any,
    readonly attribs?: AttribsType,
    readonly children?: HtmlNode[]
  ) {}
}
