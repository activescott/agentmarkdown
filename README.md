[![npm version](https://badge.fury.io/js/agent-markdown.svg)](https://www.npmjs.com/package/agent-markdown)
[![npm downloads](https://img.shields.io/npm/dt/agent-markdown.svg?logo=npm)](https://www.npmjs.com/package/agent-markdown)
[![Build Status](https://travis-ci.org/activescott/agent-markdown.svg)](https://travis-ci.org/activescott/agent-markdown)
[![Code Coverage](https://api.codacy.com/project/badge/Coverage/6469e8003872412296b5b87a672240d4)](https://www.codacy.com/app/activescott/agent-markdown?utm_source=github.com&utm_medium=referral&utm_content=activescott/agent-markdown&utm_campaign=Badge_Coverage)
[![Code Quality](https://api.codacy.com/project/badge/Grade/1b9057ec20bb473295303334bfd2ccd8)](https://app.codacy.com/app/activescott/agent-markdown?utm_source=github.com&utm_medium=referral&utm_content=activescott/agent-markdown&utm_campaign=Badge_Grade_Dashboard)
[![License](https://img.shields.io/github/license/activescott/agent-markdown.svg)](https://github.com/activescott/agent-markdown/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/activescott/agent-markdown.svg?style=social)](https://github.com/activescott/agent-markdown)

# Agent Markdown

An accurate, extensible, and fast HTML-to-markdown converter.

Agent-Markdown is a [HTML user agent](https://en.wikipedia.org/wiki/User_agent) that parses HTML, performs a document layout according to the [CSS stylesheet for HTML](https://html.spec.whatwg.org/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints) and then "renders" the laid out document to Markdown. This results in markdown that looks very similar to the way the HTML document looked when parsed and rendered in a browser (user agent).

<!-- TOC -->

- [Usage / Quick Start](#usage--quick-start)
- [Install](#install)
- [Features](#features)
- [CLI Example](#cli-example)
- [Web Example](#web-example)
- [Contributing 🤝](#contributing-🤝)
- [Show your support](#show-your-support)
- [Release Process (Deploying to NPM) 🚀](#release-process-deploying-to-npm-🚀)
- [License 📝](#license-📝)

<!-- /TOC -->

## Usage / Quick Start

```
import { AgentMarkdown } from "agent-markdown"
const markdownString = await AgentMarkdown.produce(htmlString)
```

## Install

yarn (`yarn add agent-markdown`) or npm (`npm install agent-markdown`)

## Features

- Accurately converts HTML to [CommonMark-compliant](https://commonmark.org/) markdown
  - uses [GitHub-Flavored Markdown's Strikethrough extention](https://github.github.com/gfm/#strikethrough-extension-) for &lt;strike&gt; and &lt;del&gt;.
- Supports even wonky technically incorrect HTML
- Supports nested lists
- Extensible to allow extended or customized output?
- Fast?

## CLI Example

You can convert HTML to Markdown at the command line using the following command (npx will automatically download and execute the `agent-markdown` package):

    npx agent-markdown

Or if you have

## Web Example

You can view the online web example at [https://activescott.github.io/agent-markdown/](https://activescott.github.io/agent-markdown/).

You can build and the web example locally with the following commands:

```
cd example/
yarn
yarn start
```

## Contributing 🤝

This is a community project. We invite your participation through issues and pull requests! You can peruse the [contributing guidelines](.github/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

# Building

The package is written in TypeScript. To build the package run the following from the root of the repo:

    yarn build # It will be built in /dist

## Release Process (Deploying to NPM) 🚀

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automates the whole package release workflow including: determining the next version number, generating the release notes and publishing the package. For each new commits added to the release branch (i.e. `master`) with `git push` or by merging a pull request or merging from another branch, a CI build is triggered and runs the `semantic-release` command to make a release if there are codebase changes since the last release that affect the package functionalities.

# Todo / Roadmap

see [/docs/todo.md](docs/todo.md)

# Alternatives

- http://domchristie.github.io/turndown/

## License 📝

Copyright © 2019 [Scott Willeke](https://github.com/activescott).

This project is licensed via [Mozilla Public License 2.0](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE).
