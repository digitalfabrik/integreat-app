![Integreat](build-configs/integreat/assets/app-logo.svg)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)
[![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)](version.json)
[![CircleCI Status](https://circleci.com/gh/digitalfabrik/integreat-app.svg?style=shield)](https://circleci.com/gh/digitalfabrik/integreat-app)
[![CodeScene Code Health](https://codescene.io/projects/53058/status-badges/code-health)](https://codescene.io/projects/53058)

# integreat-app

React JS and React Native App for [Integreat](https://integreat-app.de), [Malte](https://www.malteser-werke.de/malte-app.html) and [Aschaffenburg](https://aschaffenburg.app).

## Contents

- [Contributing](#contributing)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
- [Further Reading](#further-reading)

## Contributing

First, make sure you have a look at our [conventions](docs/conventions.md).

You can contribute by:

- [Reporting bugs](docs/contributing.md#reporting-issues-and-bugs)
- [Creating pull requests](docs/contributing.md#pull-requests)
- [Reviewing pull requests](docs/contributing.md#reviews)

If you want to know more about Integreat or if you want to join us, contact [Leandra](mailto:leandra.hahn@tuerantuer.org),
[Steffen](mailto:steffen.kleinle@tuerantuer.org) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).

## Project Structure

This is a monorepo and contains the following projects:

- **[web](web/README.md)**: React JS webapp
- **[native](native/README.md)**: React Native Android and iOS apps

Both projects are whitelabelled with different [build configs](build-configs/README.md).

There are also separate sub-projects used by both projects:

- **[translations](translations/README.md)**: Translated texts and utilities to manage them
- **[shared](shared/README.md)**: Contains common shared utilities, for example related to implementation of the endpoints (v3) of the integreat cms
- **[build-configs](build-configs/README.md)**: Configuration files to build different versions of the apps

## Getting Started

### Prerequisites

_We recommend to use either a Linux distribution or MacOS for development.
If you want to develop on Windows anyway, we recommend to use the `Windows Subsystem for Linux (WSL)`
and follow the docs [here](./docs/wsl-setup.md) first._

- Rate our apps in the [PlayStore](https://play.google.com/store/apps/developer?id=T%C3%BCr+an+T%C3%BCr+-+Digitalfabrik+gGmbH)
  and the [Apple App Store](https://apps.apple.com/ae/developer/tur-an-tur-digitalfabrik-ggmbh/id1309363258).
- Install [nodejs v20 LTS](https://nodejs.org/).
- Install [classic yarn](https://classic.yarnpkg.com).

### Project setup

We suggest **[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)** as IDE. JetBrains provides free licences for students.
If you are using a different IDE like Visual Studio Code the steps might [differ](./docs/vscode.md).

- Import this project (VCS > Get from Version Control).
- **Open either the [web](web) or [native](native) directory separately in IntelliJ (File > Open).**
- Follow the steps mentioned in the [web README](web/README.md) or the [native README](native/README.md).
- [optional]: Enable `Languages & Frameworks > JavaScript > Prettier > On Save` to enable prettier autoformatting.

## Further Reading

More information on both the webapp and the native app can be found in the [web documentation](web/docs)
and the [native documentation](native/docs). Documentation on [CI/CD](docs/cicd.md),
[contributing](docs/contributing.md) and our [conventions](docs/conventions.md) can be found [here](docs).
And we have a file with some small [tricks](docs/development-tips.md) that at least some developers have found
useful in working on this repo.
