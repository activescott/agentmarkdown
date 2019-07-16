# todo

+ rename AgentMarkdown - A HTML user agent that renders HTML to markdown.

+ build
  + run tests in travis
  + travis README badge

+ coverage in travis
  + try codacy coverage https://github.com/codacy/node+codacy-coverage#installation
  + coverage README badge

+ npm package
  + deploy npm (beta?) via travis
  + README badge

+ Commitizen
  + https://github.com/commitizen/cz-cli

+ semantic-release
  + https://github.com/semantic-release/semantic-release
  + readme updates about release process

- Web Example
  - publish to github pages
  - link in readme

- CLI support
  - npx / yarn dlx support
  - example in readme

+ The "Report coverage" stage takes too long. Can we just combine it as part of one of the test scripts?
  - Moved it to last step so it doesn't matter as much
  - Still should combine it to test stage

- Add all of their Tests: https://github.com/integrations/html-to-mrkdwn/blob/master/test/index.test.js
- Add to readme as an "Alternative": https://github.com/integrations/html-to-mrkdwn

- tests:
  + block elements followed by inlines and vice versa
  - elements without any child nodes (e.g. <div></div>)
  - <div><br></div>
  - multi-paragraph list items
  
- support elements (WITH TESTS):
  + links
  + br
  + b, strong
  + p (this is handled only by it's `display`==block style property, but I *think* that is sufficient?)
  + headings h1-h6
  + i, em
  + u (treat like em?)
  + code
  + pre
  + hr
  + a href
    + support a title attribute
  - images: https://daringfireball.net/projects/markdown/syntax#img

- Do we want to encode &lt; and &gt; like that or \< \> ?
- document how to extend/customize
- make it fast (see TextWriter and the default/lame implementation)
  - benchmarks (some other lib had benchmarks)

# code smells #
- the css layout code started off pure based on the css specification only generating three general types of boxes: inline, block, and list-item - as defined in the CSS spec. The only determination on the type of box generated was a lookup to the CSS-defined `display` value for the corresponding HTML element name. Interestingly, this very simplistic layout algorithm actually produced pretty descent markdown from almost any HTML! It didn't have inline formatting but the general layout, line breaking, and list generation was perfect as far as I recall.
All that smelled fine, but it started growing beyond pure CSS and introducing "special" non-standard boxes to handle markdown-specific formatting for certain elements (e.g. headings, emphasis, link, br, hr, etc.). This is perfectly fine as long as the only target is markdown but does start coupling the otherwise pure CSS box-generation/layout algorithm to markdown. It would be better to maybe make that CSS layout/box-generation code slightly extensible by allowing the caller to pass in a map of `BoxBuilder`s that could customize the box generation.
