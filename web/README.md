[![Dependency Status](https://gemnasium.com/badges/github.com/Integreat/integreat-webapp.svg)](https://gemnasium.com/github.com/Integreat/integreat-webapp)
versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)

# integreat-webapp
## Contents
* [Contributing](#contributing)
* [Getting Started](#getting-started)
* [Conventions](docs/01-conventions.md)
* [Technology Stack](docs/technology-stack.md)
* [Browser Stack](docs/browser-stack.md)
* [Delivery](docs/delivery.md)
* [CI/CD](docs/deliverino.md)
* [I18N](docs/i18n.md)
* [Glossary](https://wiki.integreat-app.de/glossary)

## Contributing
You can contribute by:
* [Creating Pull requests](.github/CONTRIBUTING.md#pull-requests)
* [Reporting bugs](#bug-reporting)

**Testing with the live cms instance should be avoided. Instead, [please use the test cms](docs/technology-stack.md#test-cms).**

If you want to know more about Integreat or if you want to join us, contact [Max](mailto:ammann@integreat-app.de),
[Steffen](mailto:kleinle@integreat-app.de) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).

## Getting Started
### Prerequisites
* Rate our Integreat app in the [PlayStore](https://play.google.com/store/apps/details?id=tuerantuer.app.integreat)
and the [Apple App Store](https://apps.apple.com/ae/app/integreat/id1072353915).
* Install [nodejs](https://nodejs.org/). At least v6 is required, but we recommend the v12 LTS.
Using the latest version (v13) may lead to errors.
* Install [yarn](https://yarnpkg.com/)

### Project setup
We suggest **[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)** as IDE. JetBrains provides free licences for students.
If you are using a different IDE, the steps might differ.

* Import this project (VCS > Get from Version Control).
* Run `yarn` in the terminal to install all dependencies.
* Take a look at package.json to show all available npm scripts.
* Run `yarn start` to start a local webpack dev server.
* Start coding :)

#### Additional Configuration
* Mark the *src* and *www* folder as *Source directory*.
* Run > Edit Configurations > Defaults > Jest and set *Configuration file* to *jest.config.json*

* Settings > Languages & Frameworks > JavaScript and
    * Choose *Flow* as Language version
    * Set *Flow package or executable* to *<project_dir>/node_modules/flow-bin*
* [optional] Associate the *\*.snap* files with the file type *JavaScript*.
* [optional] Install the following plugins:
    * [Styled Components](https://plugins.jetbrains.com/plugin/9997-styled-components--styled-jsx/)
    * [EJS](https://plugins.jetbrains.com/plugin/index?xmlId=com.jetbrains.lang.ejs)
* [optional] Configure Linux environment on Windows: [WSL Setup](docs/wsl-setup.md)
### Trouble shooting
* Use nodejs 12 LTS instead of the latest version.

## Bug reporting
You can [view our issues](https://issues.integreat-app.de/projects/WEBAPP) or
 [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.

## Pull requests
Please take a look at our [conventions](docs/01-conventions.md).

To merge a pull request,
* at least two approvals are required.
* tests, linting and flow have to succeed.
