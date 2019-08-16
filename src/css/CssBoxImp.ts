import { CssBox, BoxType } from ".."

/**
 * Represents a (simplified) a CSS box as described at https://www.w3.org/TR/CSS22/visuren.html#box-gen.
 */
export class CssBoxImp implements CssBox {
  private readonly _children: CssBox[]

  /**
   * Initializes a new @see CssBox.
   * @param type The type of this box.
   * @param textContent Returns any text content if this box has text to render.
   * @param children Returns any child boxes of this box.
   * @param debugNote A string to add to the box to help with debugging.
   */
  public constructor(
    public type: BoxType,
    public textContent: string = "",
    children: Iterable<CssBox> = [],
    public readonly debugNote: string = ""
  ) {
    this._children = children ? Array.from(children) : []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public static traceBoxTree(box: CssBox, indent = 0): string {
    const typeStr = (type: BoxType): string =>
      type === BoxType.inline ? "inline" : "block"
    const boxStr = (b: CssBox): string =>
      "CssBox " +
      (b == null
        ? "<null>"
        : JSON.stringify({
            type: typeStr(b.type),
            text: b.textContent,
            debug: b.debugNote
          })) +
      "\n"
    let output = "  ".repeat(indent) + boxStr(box)
    if (box) {
      for (const child of box.children) {
        output += CssBoxImp.traceBoxTree(child, indent + 1)
      }
    }
    return output
  }

  public addChild(box: CssBox): void {
    if (!box) throw new Error("box must be provided")
    this._children.push(box)
  }

  public get children(): IterableIterator<CssBox> {
    return this.childrenBoxGenerator()
  }

  private get containsInlineAndBlockBoxes(): boolean {
    //TODO: PERF: Cache this value.
    let hasBlock = false
    let hasInline = false
    for (const child of this._children) {
      hasBlock = hasBlock || child.type === BoxType.block
      hasInline = hasInline || child.type == BoxType.inline
    }
    return hasBlock && hasInline
  }

  private *childrenBoxGenerator(): IterableIterator<CssBox> {
    // The logic here is generating anonymous block boxes per https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level
    const areAnonymousBoxesNeeded: boolean =
      this._children.length > 0 && this.containsInlineAndBlockBoxes
    if (areAnonymousBoxesNeeded) {
      let anonymousBox: CssBox
      const kids: Iterator<CssBox> = this._children[Symbol.iterator]()
      let nextKid = kids.next()
      while (!nextKid.done) {
        const child: CssBox = nextKid.value
        if (child.type === BoxType.inline) {
          anonymousBox = anonymousBox
            ? anonymousBox
            : new CssBoxImp(BoxType.block, null, null, "Anonymous-Block-Box")
          anonymousBox.addChild(child)
        } else {
          if (anonymousBox) {
            yield anonymousBox
            anonymousBox = null
          }
          yield child
        }
        nextKid = kids.next()
      }
      if (anonymousBox) yield anonymousBox
    } else {
      for (const child of this._children) {
        yield child
      }
    }
  }
}
