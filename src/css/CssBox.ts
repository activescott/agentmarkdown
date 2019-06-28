import { HtmlNode } from "../HtmlNode"

export class CssBox {
  private readonly kids = new Array<CssBox>()
  private _type: BoxType

  constructor(readonly element: HtmlNode, type: BoxType) {
    this.type = type
  }

  get type(): BoxType {
    return this._type
  }

  set type(value: BoxType) {
    this._type = value
  }

  get formattingContext(): FormattingContext {
    // todo: cache, dirty upon adding new child
    let hasBlock = false
    let hasInline = false
    for (let child of this.children) {
      hasBlock = hasBlock || child.type === BoxType.block
      hasInline = hasInline || child.type == BoxType.inline
    }
    if (hasBlock && hasInline) {
      // if any child is a block element, this element becomes elevated to block formatting context - https://www.w3.org/TR/CSS22/visuren.html#block-boxes
      // create anonymous box for any inlines: https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level
      for (let child of this.children) {
        child.type = BoxType.block
      }
    }
    return hasBlock ? FormattingContext.block : FormattingContext.inline
  }

  get children(): Iterable<CssBox> {
    return this.kids
  }

  addChild(box: CssBox): void {
    this.kids.push(box)
  }
}

export enum BoxType {
  block,
  inline
}

export enum FormattingContext {
  block,
  inline
}
