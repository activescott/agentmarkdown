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
   * @param debugNote A string ot add to the box to help with debugging.
   */
  constructor(
    public type: BoxType,
    public textContent: string = "",
    children: Iterable<CssBox> = [],
    public readonly debugNote: string = ""
  ) {
    this._children = children ? Array.from(children) : []
  }

  get formattingContext(): FormattingContext {
    let hasBlock = false
    let hasInline = false
    for (let child of this.children) {
      hasBlock = hasBlock || child.type === BoxType.block
      hasInline = hasInline || child.type == BoxType.inline
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
