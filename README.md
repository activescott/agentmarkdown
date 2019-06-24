# hypertextmarkdown

An accurate, extensible, and fast HTML-to-markdown converter.

# Features

- Accurately converts HTML to [CommonMark-compliant](https://commonmark.org/) markdown
- Supports even wonky technically incorrect HTML
- Supports nested lists
- Extensible to allow extened or customized output

# Status

Unstable. All interfaces/classes subject to change.

# Usage / Example

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
