# todo

- Refactoring in progress...
  - TEST CssBox & layout builder
  - See css.spec.ts: IN order to honor CSS Visual Formatting Model, suspect we have to do two passes on DOM:
    1. Build a tree with rendering/layout "boxes" that we assign a block formatting model to
       In theory you'd need to build a new tree because one element/node could result "zero or more boxes" (see "principal box"), but our render output is pretty simplistic so maybe we can get away with 1:1 element:box? Sounds hacky though. Some boxes 
       - NOTE: Each box should really ask it's parent whether it is in *block formatting context* or a *inline formatting context* (the parent elevates to block formatting context if _any_ child is a block box).
    2. With formatting contexts assigned, render the boxes to the TextWriter.
    ```
    class Box {
      type: "inline" | "block"
      formattingContext: "inline" | "block"
      element: HtmlNode
      children(): IterableIterator<Box>
      addChild(box: Box): void
    }
    ```

- rename AgentMarkdown - A HTML user agent that renders HTML to markdown.
- whitespace:
  - Normalizing whitespace is easier but leaves trailing whitespace at the end of newlines (https://github.com/fb55/DomHandler#option-normalizewhitespace).
    The trailing whitepsace is ugly.
    How to resolve? Don't normalize and then manually remove any type=text nodes where the only values are newline & tab chars?
    This fails for a sequence of inline text separated by only newlines (I think).
    So requirements:
    - Normalize text nodes with newlines+tabs to a single space when surrounded by two inlines
    - Normalize text nodes with newlines+tabs to zero space when surrounded by a block element (or a newline) on either side
    - Tests:
      ```
      1:
      <h1>foo</h1>
      <h2>foo</h2>
      2:
      <span>no
      newline</span>
      3:
      <span>one  space</span>
      4:
      <span>one
      space</span>
      ```
    - Whitespace collapsing processing is defined in CSS core: https://www.w3.org/TR/CSS2/text.html#white-space-model
- build
  - run tests in travis
  - README badge
- support elements (WITH TESTS):
  - br
  - b, strong
  - p
  - font (color)
  - headings h1-h6
  - i, em
  - u (treat like em?)
  - code
  - pre
  - hr
  - a href
    - support a title attribute
  - img src
- tests:
  - block elements followed by inlines and vice versa
  - elements without any child nodes (e.g. <div></div>)
  - <div><br></div>
  - multi-paragraph list items
- Do we want to encode &lt; and &gt; like that or \< \> ?
- coverage in travis
  - README badge
- CLI support
  - example in readme
  - npx / yarn dlx support
- online example
  - demo in this repo that is published to github pages
- npm package
  - release via travis
  - README badge
- document how to extend/customize
- full commonmark test suite and find out what else to support.
- make it fast (see TextWriter and the default/lame implementation)
  - benchmarks
