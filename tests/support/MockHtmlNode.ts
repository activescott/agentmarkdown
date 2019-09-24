import { HtmlNode, HtmlNodeType, AttribsType } from "../../src/HtmlNode"

export class MockHtmlNode implements HtmlNode {
  public constructor(
    public readonly type: HtmlNodeType,
    public readonly tagName?: string,
    public readonly data?: string,
    public readonly attribs?: AttribsType,
    public readonly children: HtmlNode[] = []
  ) {}
}
