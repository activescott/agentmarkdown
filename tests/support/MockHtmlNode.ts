import { HtmlNode, HtmlNodeType, AttribsType } from "../../src/HtmlNode"

export class MockHtmlNode implements HtmlNode {
  public constructor(
    readonly type: HtmlNodeType,
    readonly name: string,
    readonly data?: string,
    readonly attribs?: AttribsType,
    readonly children: HtmlNode[] = []
  ) {}
}
