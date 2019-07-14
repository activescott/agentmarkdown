# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to [propose changes to this document](https://github.com/activescott/agentmarkdown/edit/master/.github/CONTRIBUTING.md).

## How Can I Contribute?

Feel free to check [issues page](https://github.com/activescott/agentmarkdown/issues) to find an enhancement to implement or bug to fix. You could also **[Improve the documentation](https://github.com/activescott/agentmarkdown/edit/master/README.md)**, **Report a Bug**, or **Suggest an Enhancement**.

### Contribute Code

- Fork this repository and [submit a pull request](https://help.github.com/articles/creating-a-pull-request/).
- Write tests
- Ensure the linter passes with `yarn lint`
- Ensure the tests pass at [the CI Server](https://travis-ci.org/activescott/agentmarkdown) by [following the status](https://help.github.com/articles/about-statuses/) of your pull request.

#### Commit Message Guidelines

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

The [Conventional Commits specification](https://conventionalcommits.org) is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.

The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

The commit message formatting can be added using a typical git workflow or through the use of a CLI wizard ([Commitizen](https://github.com/commitizen/cz-cli)).

If you're unsure of how to get the messages right, let us know and just do your best and we'll clean them up in the merge!
