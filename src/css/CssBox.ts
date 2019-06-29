/**
 * Represents a (simplified) a CSS box as described at https://www.w3.org/TR/CSS22/visuren.html#box-gen.
 */
export class CssBox {
  private readonly _children: Array<CssBox>

  /**
   * Initializes a new @see CssBox.
   * @param type The type of this box.
   * @param textContent Returns any text content if this box has text to render.
   * @param children Returns any child boxes of this box.
   */
  constructor(
    public type: BoxType,
    public textContent: string = "",
    children: Iterable<CssBox> = []
  ) {
    this._children = Array.from(children)
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
    return this._children
  }

  addChild(box: CssBox): void {
    if (!box) throw new Error("box must be provided")
    this._children.push(box)
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
