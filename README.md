[![Dependency Status](https://gemnasium.com/badges/github.com/Integreat/integreat-webapp.svg)](https://gemnasium.com/github.com/Integreat/integreat-webapp)
develop: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=develop)
master: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=master)
versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)

# integreat-webapp
## Contents
* [Contributing](#contributing)
* [Getting Started](#getting-started)
* [Bug reporting](#bug-reporting)
* [Pull requests](#pull-requests)
* [Conventions](docs/01-conventions.md)
* [Technology Stack](docs/02-technology-stack.md)
* [Deployment](docs/03-deployment.md)
* [I18N](docs/14-i18n.md)

## Contributing
If you want to know more about Integreat or if you want to join us, contact [Max](mailto:ammann@integreat-app.de), 
[Steffen](mailto:kleinle@integreat-app.de) or [our info mail](mailto:info@integreat-app.de) and visit our [website](https://integreat-app.de).
[Pull requests](#pull-requests) and [bug reports](#bug-reporting) are also very much appreciated.
 
## Getting Started
### Prerequisites
* Install [nodejs](https://nodejs.org/). At least v6 is required, but we recommend the v12 LTS.
Using the latest version (v13) may lead to errors.
* Install [yarn](https://yarnpkg.com/)

### IDE
We suggest [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) as IDE. JetBrains provides free licences for students.

#### Project setup
* Import this project (VCS > Get from Version Control).
* Run `yarn` in the terminal to install all dependencies.
* Take a look at package.json to show all available npm scripts.
* Run `yarn start` to start a local webpack dev server.
* Start coding :)

#### Additional Configuration
* Mark the *src* and *www* folder as *Source directory*.
* Run > Edit Configurations > Defaults > Jest  
   to set *Configuration file* to *jest.config.json*
   
* Settings > Languages & Frameworks > JavaScript and
    * choose *Flow* as Language version
    * set *Flow package or executable* to *<project_dir>/node_modules/flow-bin*
   
* [optional] Associate the *\*.snap* files with the file type *JavaScript*.
* [optional] Install the following plugins: *Styled Components*, *EJS*.

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
