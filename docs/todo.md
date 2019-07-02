# todo

- rename AgentMarkdown - A HTML user agent that renders HTML to markdown.

- build
  - run tests in travis
  - README badge

- npm package
  - release via travis

- CLI support
  - npx / yarn dlx support
  - example in readme

- README badge

- coverage in travis
  - README badge

- support elements (WITH TESTS):
  + links
  + br
  + b, strong
  - p
  - font (color?)
  + headings h1-h6
  + i, em
  + u (treat like em?)
  + code
  + pre
  + hr
  + a href
    + support a title attribute
  - img src
- tests:
  + block elements followed by inlines and vice versa
  - elements without any child nodes (e.g. <div></div>)
  - <div><br></div>
  - multi-paragraph list items

- online example
  - demo in this repo that is published to github pages

- Do we want to encode &lt; and &gt; like that or \< \> ?
- document how to extend/customize
- full commonmark test suite and find out what else to support
- make it fast (see TextWriter and the default/lame implementation)
  - benchmarks (some other lib had benchmarks)
