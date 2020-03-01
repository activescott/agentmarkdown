[![npm version](https://badge.fury.io/js/agentmarkdown.svg)](https://www.npmjs.com/package/agentmarkdown)
[![npm downloads](https://img.shields.io/npm/dt/agentmarkdown.svg?logo=npm)](https://www.npmjs.com/package/agentmarkdown)
[![Build Status](https://github.com/activescott/agentmarkdown/workflows/main/badge.svg)](https://github.com/activescott/agentmarkdown/actions)
[![Coverage Status](https://coveralls.io/repos/github/activescott/agentmarkdown/badge.svg?branch=master)](https://coveralls.io/github/activescott/agentmarkdown?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/activescott/agentmarkdown.svg)](https://greenkeeper.io/)
[![Code Quality](https://api.codacy.com/project/badge/Grade/1b9057ec20bb473295303334bfd2ccd8)](https://app.codacy.com/app/activescott/agentmarkdown?utm_source=github.com&utm_medium=referral&utm_content=activescott/agentmarkdown&utm_campaign=Badge_Grade_Dashboard)
[![Minified Size](https://badgen.net/bundlephobia/min/agentmarkdown)](https://bundlephobia.com/result?p=agentmarkdown)
[![License](https://img.shields.io/github/license/activescott/agentmarkdown.svg)](https://github.com/activescott/agentmarkdown/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/activescott/agentmarkdown.svg?style=social)](https://github.com/activescott/agentmarkdown)

# Agent Markdown

An accurate, extensible, and fast HTML-to-markdown converter.

Agent Markdown is a [HTML user agent](https://en.wikipedia.org/wiki/User_agent) that parses HTML, performs a document layout according to the [CSS stylesheet for HTML](https://html.spec.whatwg.org/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints) and then "renders" the laid out document to Markdown. This results in markdown that looks very similar to the way the HTML document looked when parsed and rendered in a browser (user agent).

<!-- TOC -->

- [Usage / Quick Start](#usage--quick-start)
- [Install](#install)
- [Features](#features)
- [CLI Example](#cli-example)
- [Live Example](#live-example)
- [Customize & Extend with Plugins](#customize--extend-with-plugins)
- [Show your support](#show-your-support)
- [Contributing 🤝](#contributing-🤝)
- [Release Process (Deploying to NPM) 🚀](#release-process-deploying-to-npm-🚀)
- [License 📝](#license-📝)

<!-- /TOC -->

## Usage / Quick Start

```
import { AgentMarkdown } from "agentmarkdown"
const markdownString = await AgentMarkdown.produce(htmlString)
```

## Install

yarn (`yarn add agentmarkdown`) or npm (`npm install agentmarkdown`)

## Features

- Accurately converts HTML to [CommonMark-compliant](https://commonmark.org/) markdown
  - uses [GitHub-Flavored Markdown's Strikethrough extention](https://github.github.com/gfm/#strikethrough-extension-) for &lt;strike&gt; and &lt;del&gt;.
- Supports even wonky technically incorrect HTML
- Supports nested lists
- Supports [implied paragraphs](https://html.spec.whatwg.org/#paragraphs) / [CSS anonymous bock box layout](https://www.w3.org/TR/CSS22/visuren.html#anonymous-block-level)
- Can be used client side (in the browser) or server side (with Node.js)
- Add support for new elements [with plugins](#customize--extend-with-plugins)
- Fast?

## CLI Example

You can convert any HTML file to Markdown at the command line using the following command, and the markdown output will be printed to stdout:

    agentmarkdown <filename.html>

It also responds to stdin, if you pipe html to it. So you can do things like:

    echo "<b>bold</bold>" | agentmarkdown > myfile.md

The above commands assume you installed agentmarkdown with `yarn global add agentmarkdown`, `npm install --global agentmarkdown` but it also works with `npx` so you can run it without installing like:

    npx agentmarkdown <filename.html>

## Live Example

You can view the live online web example at [https://agentmarkdown.now.sh](https://agentmarkdown.now.sh).

You can build and the web example locally with the following commands:

```
cd example/
yarn
yarn start
```

*NOTE: If you have trouble starting the example on macOS related to `fsevents` errors, it may require running `xcode-select --install`. If that doesn't work, then possibly a `sudo rm -rf $(xcode-select -print-path)` followed by `xcode-select --install` will be necessary.*

## Customize & Extend with Plugins

To customize how the markdown is generated or add support for new elements, implement the `LayoutPlugin` interface to handle a particular HTML element. The `LayoutPlugin` interface is defined as follows:

```TypeScript
export interface LayoutPlugin {
  /**
   * Specifies the name of the HTML element that this plugin renders markdown for.
   * NOTE: Must be all lowercase
   */
  elementName: string
  /**
   * This is the core of the implementation that will be called for each instance of the HTML element that this plugin is registered for.
   */
  layout: LayoutGenerator
}
```

The `LayoutGenerator` is a single function that performs a [CSS2 box generation layout algorithm](https://www.w3.org/TR/CSS22/visuren.html#box-gen) on the an HTML element. Essentially it creates zero or more boxes for the given element that AgentMarkdown will render to text. A box can contain text content and/or other boxes, and each box has a type of `inline` or `block`. Inline blocks are laid out horizontally. Block boxes are laid out vertically (i.e. they have new line characters before and after their contents). The `LayoutGenerator` function definition is as follows:

```TypeScript
export interface LayoutGenerator {
  (
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null
}
```

An example of how the HTML `<b>` element could be implemented as a plugin like the following:

```TypeScript
class BoldPlugin {
  elementName: "b"

  layout: LayoutGenerator = (
    context: LayoutContext,
    manager: LayoutManager,
    element: HtmlNode
  ): CssBox | null => {
    // let the manager use other plugins to layout any child elements:
    const kids = manager.layout(context, element.children)
    // wrap the child elements in the markdown ** syntax for bold/strong:
    kids.unshift(manager.createBox(BoxType.inline, "**"))
    kids.push(manager.createBox(BoxType.inline, "**"))
    // return a new box containing everything:
    return manager.createBox(BoxType.inline, "", kids)
  }
}
```

To initialize AgentMarkdown with plugins pass them in as an array value for the `layoutPlugins` option as follows. To customize the rendering an element you can just specify a plugin for the elementName and your plugin will override the built-in plugin.

```TypeScript
const result = await AgentMarkdown.render({
    html: myHtmlString,
    layoutPlugins: [
      new BoldPlugin()
    ]
  })
```

## Show your support

Please give a ⭐️ if this project helped you!

## Contributing 🤝

This is a community project. We invite your participation through issues and pull requests! You can peruse the [contributing guidelines](.github/CONTRIBUTING.md).

# Building

The package is written in TypeScript. To build the package run the following from the root of the repo:

    yarn build # It will be built in /dist

## Release Process (Deploying to NPM) 🚀

We use [semantic-release](https://github.com/semantic-release/semantic-release) to consistently release [semver](https://semver.org/)-compatible versions. This project deploys to multiple [npm distribution tags](https://docs.npmjs.com/cli/dist-tag). Each of the below branches correspond to the following npm distribution tags:

| branch | npm distribution tag |
| ------ | -------------------- |
| master | latest               |
| beta   | beta                 |

To trigger a release use a Conventional Commit following [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) on one of the above branches.

# Todo / Roadmap

see [/docs/todo.md](docs/todo.md)

# Alternatives

- http://domchristie.github.io/turndown/
- https://github.com/rehypejs/rehype-remark

## License 📝

Copyright © 2019 [Scott Willeke](https://github.com/activescott).

This project is licensed via [Mozilla Public License 2.0](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE).
