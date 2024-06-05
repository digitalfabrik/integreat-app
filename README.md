![Integreat](build-configs/integreat/assets/app-logo.svg)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)
[![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)](version.json)
[![CircleCI Status](https://circleci.com/gh/digitalfabrik/integreat-app.svg?style=shield)](https://circleci.com/gh/digitalfabrik/integreat-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/5be95233a83e181d8a42/maintainability)](https://codeclimate.com/github/digitalfabrik/integreat-app/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5be95233a83e181d8a42/test_coverage)](https://codeclimate.com/github/digitalfabrik/integreat-app/test_coverage)

# integreat-app

React JS and React Native App for [Integreat](https://integreat-app.de), [Malte](https://www.malteser-werke.de/malte-app.html) and [Aschaffenburg](https://aschaffenburg.app).

## Contents

- [Contributing](#contributing)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Project setup](#project-setup)
- [Further Reading](#further-reading)

## Contributing

You can contribute by:

- [Creating Pull requests](docs/contributing.md#pull-requests)
- [Reporting bugs](docs/contributing.md#bug-reporting)

If you want to know more about Integreat or if you want to join us, contact [Leandra](mailto:leandra.hahn@tuerantuer.org),
[Steffen](mailto:steffen.kleinle@tuerantuer.org) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).

We use this emoji code for reviewing:

- :+1: or `:+1:` This is great! It always feels good when somebody likes your work. Show them!
- :question: or `:question:` I have a question / can you clarify?
- :x: or `:x:` This has to change. It’s possibly an error or strongly violates existing conventions.
- :wrench: or `:wrench:` This is a well-meant suggestion. Take it or leave it.
- :upside_down_face: or `:upside_down_face:` This is a nitpick. Normally related to a small formatting or stylizing detail that shouldn’t block moving forward.
- :thought_balloon: or `:thought_balloon:` I’m just thinking out loud here. Something doesn’t necessarily have to change, but I want to make sure to share my thoughts.
- :clown_face: or `:clown_face:` This is a complaint about something with no obvious answer, not necessarily a problem originating from changes.

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

_We are recommending to use either a Linux distribution or MacOS for development.
If you want to develop on Windows anyway, follow the steps [here](./docs/windows-setup.md)
or use the Windows Subsystem for Linux following the information [here](./docs/wsl-setup.md)._

## Further Reading

More information on both the webapp and the native app can be found in the [web documentation](web/docs)
and the [native documentation](native/docs). Documentation on [CI/CD](docs/cicd.md),
[contributing](docs/contributing.md) and our [conventions](docs/conventions.md) can be found [here](docs).
And we have a file with some small [tricks](docs/development-tips.md) that at least some developers have found
useful in working on this repo.
