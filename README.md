[![npm version](https://badge.fury.io/js/agentmarkdown.svg)](https://www.npmjs.com/package/agentmarkdown)
[![npm downloads](https://img.shields.io/npm/dt/agentmarkdown.svg?logo=npm)](https://www.npmjs.com/package/agentmarkdown)
[![Build Status](https://travis-ci.org/activescott/agentmarkdown.svg?branch=master)](https://travis-ci.org/activescott/agentmarkdown)
[![Coverage Status](https://coveralls.io/repos/github/activescott/agentmarkdown/badge.svg?branch=master)](https://coveralls.io/github/activescott/agentmarkdown?branch=master)
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
- Can be used client side (in the browser) or server side (with Node.js)
- Extensible to allow extended or customized output?
- Fast?

## CLI Example

You can convert any HTML file to Markdown at the command line using the following command, and the markdown output will be printed to stdout:

    agentmarkdown <filename.html>

It also responds to stdin, if you pipe html to it. So you can do things like:

    echo "<b>bold</bold>" | agentmarkdown > myfile.md

The above commands assume you installed agentmarkdown with `yarn global add agentmarkdown`, `npm install --global agentmarkdown` but it also works with `npx` so you can run it without installing like:

    npx agentmarkdown <filename.html>

## Live Example

You can view the live online web example at [https://activescott.github.io/agentmarkdown/](https://activescott.github.io/agentmarkdown/).

You can build and the web example locally with the following commands:

```
cd example/
yarn
yarn start
```

## Show your support

Give a ⭐️ if this project helped you!

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

## License 📝

Copyright © 2019 [Scott Willeke](https://github.com/activescott).

This project is licensed via [Mozilla Public License 2.0](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE).
