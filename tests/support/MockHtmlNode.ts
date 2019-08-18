import { HtmlNode, HtmlNodeType, AttribsType } from "../../src/HtmlNode"

export class MockHtmlNode implements HtmlNode {
  public constructor(
    readonly type: HtmlNodeType,
    readonly tagName?: string,
    readonly data?: string,
    readonly attribs?: AttribsType,
    readonly children: HtmlNode[] = []
  ) {}
}
