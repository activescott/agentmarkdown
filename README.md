[![Build Status](https://travis-ci.org/activescott/agentmarkdown.svg)](https://travis-ci.org/activescott/agentmarkdown)
[![Coverage Status](https://coveralls.io/repos/github/activescott/agentmarkdown/badge.svg)](https://coveralls.io/github/activescott/agentmarkdown)
[![License](https://img.shields.io/github/license/activescott/agentmarkdown.svg)](https://github.com/activescott/agentmarkdown/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/activescott/agentmarkdown.svg?style=social)](https://github.com/activescott/agentmarkdown)

# AgentMarkdown

An accurate, extensible, and fast HTML-to-markdown converter.

AgentMarkdown is a [HTML user agent](https://en.wikipedia.org/wiki/User_agent) that parses HTML, performs a document layout according to the [CSS stylesheet for HTML](https://html.spec.whatwg.org/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints) and then "renders" the laid out document to Markdown. This results in markdown that looks very similar to the way the HTML document looked when parsed and rendered in a browser (user agent).

# Features

- Accurately converts HTML to [CommonMark-compliant](https://commonmark.org/) markdown
  - uses [GitHub-Flavored Markdown's Strikethrough extention](https://github.github.com/gfm/#strikethrough-extension-) for &lt;strike&gt; and &lt;del&gt;.
- Supports even wonky technically incorrect HTML
- Supports nested lists
- Extensible to allow extended or customized output?
- Fast?

# Status

Unstable. All interfaces/classes subject to change.

# Usage / Example

```
import { AgentMarkdown } from "../../src"
const markdown = await AgentMarkdown.produce(html)
```

## CLI Example

TODO

## Web Example

TODO

# Todo / Roadmap

see [/docs/todo.md](docs/todo.md)

# Building

The package is written in TypeScript. To build the package run the following from the root of the repo:

    yarn build # It will be built in /dist

# Release Process

TODO:

To release a new version, merge everything to master and let the travis build run succesfully. Then tag the succesfully built commit with a semver tag beginning with `v` like `v0.1.3`. Push the tag to GitHub and Travis will build the package using the version from the tag and make the npm release automatically.

# Alternatives

- http://domchristie.github.io/turndown/
