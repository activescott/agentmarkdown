import { toMarkdown } from "../../tests/support"

describe("CSS Visual Formatting Model", () => {
  // https://www.w3.org/TR/CSS22/visuren.html
  describe("9.4 Normal flow", () => {
    /** https://www.w3.org/TR/CSS22/visuren.html#normal-flow
     * - Block-level boxes participate in a block formatting context.
     *   - In a block formatting context, boxes are laid out one after the other, vertically,
     *     beginning at the top of a containing block.
     * - Inline-level boxes participate in an inline formatting context.
     *   - An inline formatting context is established by a block container box that contains no
     *     block-level boxes. In an inline formatting context, boxes are laid out horizontally,
     *     one after the other, beginning at the top of a containing block.
     */
    describe("9.4.1 Block formatting contexts", () => {
      /** https://www.w3.org/TR/CSS22/visuren.html#block-formatting
       * Notable excerpts:
       * - Block-level boxes are boxes that participate in a block formatting context.
       * - A block container box either contains only block-level boxes or establishes an inline
       *   formatting context and thus contains only inline-level boxes.
       */

      it("should switch from block formatting context to inline formatting context", async () => {
        const html = `<div>block</div><span>inline</span>`
        const expected = `block\ninline`
        const md = await toMarkdown(html)
        //console.log({ ex: expected })
        //console.log({ md })
        expect(md).toEqual(expected)
      })
    })
    describe("9.4.2 Inline formatting contexts", () => {
      /** https://www.w3.org/TR/CSS22/visuren.html#inline-formatting */
      it("simple", async () => {
        const html = `<span>span1</span> <span>span2</span>`
        const expected = `span1 span2`
        const md = await toMarkdown(html)
        //console.log({ ex: expected })
        //console.log({ md })
        expect(md).toEqual(expected)
      })

      it("simple w/ anonymous blocks", async () => {
        /**
         * The principle of this test is this (from 9.2.1.1 Anonymous block boxes at https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level):
         * "if a block container box (such as that generated for the DIV above) has a block-level box inside it (such as the P above),
         * then we force it to have only block-level boxes inside it."
         * ...by creating an "anonymous" block box for "Some text", eventhough it would normally be an inline box.
         */
        const html = `<div>Some text<p>More text</p></div>`
        const expected = `Some text\nMore text`
        const md = await toMarkdown(html)
        //console.log({ ex: expected })
        //console.log({ md })
        expect(md).toEqual(expected)
      })
    })
  })
})
