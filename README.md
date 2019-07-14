[![npm version](https://badge.fury.io/js/agentmarkdown.svg)](https://www.npmjs.com/package/agentmarkdown)
[![npm downloads](https://img.shields.io/npm/dt/agentmarkdown.svg?logo=npm)](https://www.npmjs.com/package/agentmarkdown)
[![Build Status](https://travis-ci.org/activescott/agentmarkdown.svg)](https://travis-ci.org/activescott/agentmarkdown)
[![Code Coverage](https://api.codacy.com/project/badge/Coverage/6469e8003872412296b5b87a672240d4)](https://www.codacy.com/app/activescott/agentmarkdown?utm_source=github.com&utm_medium=referral&utm_content=activescott/agentmarkdown&utm_campaign=Badge_Coverage)
[![Code Quality](https://api.codacy.com/project/badge/Grade/1b9057ec20bb473295303334bfd2ccd8)](https://app.codacy.com/app/activescott/agentmarkdown?utm_source=github.com&utm_medium=referral&utm_content=activescott/agentmarkdown&utm_campaign=Badge_Grade_Dashboard)
[![License](https://img.shields.io/github/license/activescott/agentmarkdown.svg)](https://github.com/activescott/agentmarkdown/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/activescott/agentmarkdown.svg?style=social)](https://github.com/activescott/agentmarkdown)

# AgentMarkdown

An accurate, extensible, and fast HTML-to-markdown converter.

AgentMarkdown is a [HTML user agent](https://en.wikipedia.org/wiki/User_agent) that parses HTML, performs a document layout according to the [CSS stylesheet for HTML](https://html.spec.whatwg.org/multipage/rendering.html#the-css-user-agent-style-sheet-and-presentational-hints) and then "renders" the laid out document to Markdown. This results in markdown that looks very similar to the way the HTML document looked when parsed and rendered in a browser (user agent).

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
- Extensible to allow extended or customized output?
- Fast?

## CLI Example

Coming Soon! :construction_worker:

## Web Example

Coming Soon! :construction_worker:

## Contributing 🤝

This is a community project. We invite your participation through issues and pull requests! You can peruse the [contributing guidelines](.github/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

# Building

The package is written in TypeScript. To build the package run the following from the root of the repo:

    yarn build # It will be built in /dist

## Release Process (Deploying to NPM) 🚀

To deploy a **pre-release version** to NPM, tag a commit in master branch with a semver-compatible git tag and **postfixed with** an NPM distribution tag of `beta`. For example:

    git tag 1.0.1-beta

To deploy a **production** version to NPM, tag a commit in master branch with a semver-compatible git tag **WITHOUT** a NPM distribution tag. For example:

    git tag 1.0.1

In this case, since no NPM distribution tag is provided the `latest` tag will be used making it a normal production release.

NOTE: To get the tag to GitHub push it with `git push --tags`.

NOTE: If you want to move the git tag that was already pushed to the remote (GitHub) to a different commit you must delete it on the remote like `git push --delete origin 0.8.7-beta` and then push it with `git push --tags`. Or do the abbreviated from by force-pushing it like `git push --tags -f`.

# Todo / Roadmap

see [/docs/todo.md](docs/todo.md)

# Alternatives

- http://domchristie.github.io/turndown/

## License 📝

Copyright © 2019 [Scott Willeke](https://github.com/activescott).

This project is licensed via [Mozilla Public License 2.0](https://github.com/activescott/serverless-http-invoker/blob/master/LICENSE).
