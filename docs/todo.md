# todo

+ Add all of their Tests: https://github.com/integrations/html-to-mrkdwn/blob/master/test/index.test.js
- Add to readme as an "Alternative": https://github.com/integrations/html-to-mrkdwn

- tests:
  + block elements followed by inlines and vice versa
  - elements without any child nodes (e.g. <div></div>)
  - <div><br></div>
  - multi-paragraph list items
  
- Feat: Extensibility
  - Allow customizing the conversion. Should the caller be able to provide custom `BoxBuilder`?
  - We're using uinst (inadvertantly) so maybe allow different uinst frontends and extensibility in uinst as well as the CssBox BoxBuilder backend: https://unified.js.org/create-a-plugin.html

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

- this is relevant but i'm not sure how yet: https://unified.js.org/

- Do we want to encode &lt; and &gt; like that or \< \> ?
- document how to extend/customize
- make it fast (see TextWriter and the default/lame implementation)
  - benchmarks (some other lib had benchmarks)

# code smells #
- the css layout code started off pure based on the css specification only generating three general types of boxes: inline, block, and list-item - as defined in the CSS spec. The only determination on the type of box generated was a lookup to the CSS-defined `display` value for the corresponding HTML element name. Interestingly, this very simplistic layout algorithm actually produced pretty descent markdown from almost any HTML! It didn't have inline formatting but the general layout, line breaking, and list generation was perfect as far as I recall.
All that smelled fine, but it started growing beyond pure CSS and introducing "special" non-standard boxes to handle markdown-specific formatting for certain elements (e.g. headings, emphasis, link, br, hr, etc.). This is perfectly fine as long as the only target is markdown but does start coupling the otherwise pure CSS box-generation/layout algorithm to markdown. It would be better to maybe make that CSS layout/box-generation code slightly extensible by allowing the caller to pass in a map of `BoxBuilder`s that could customize the box generation.
