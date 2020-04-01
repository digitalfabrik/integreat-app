[![Dependency Status](https://gemnasium.com/badges/github.com/Integreat/integreat-webapp.svg)](https://gemnasium.com/github.com/Integreat/integreat-webapp)
develop: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=develop)
master: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=master)
versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)
# integreat-webapp

## Getting Started

### Prerequisites
* **Make sure you have at least [nodejs 6](https://nodejs.org/) installed.**
We recommend the nodejs 12 LTS.

* Install [yarn](https://yarnpkg.com/)

### IDE
We suggest **IntelliJ IDEA Ultimate** as IDE. JetBrains provides free licences for students.

#### Plugins
* Styled Components
* EJS

#### Additional Configuration
* Mark the *src* and *www* folder as *Source directory*.
* Run > Edit Configurations > Defaults > Jest  
   to set **Configuration file** to **jest.config.json**
   
* Settings > Languages & Frameworks > JavaScript and
    * choose **Flow** as Language version
    * set *Flow package or executable* to **<project_dir>/node_modules/flow-bin**
   
If you want you can associate the *.snap files with the file type JavaScript.

### Getting Started
* Import this project (from existing sources).
* Run **git submodule init** and **git submodule update** to initialize the locales submodule.
* Run **yarn** in the terminal to install all dependencies.
* Take a look at package.json to show all available npm scripts.
* Run **yarn start** to start a local webpack dev server.
* Start coding :)

### Trouble shooting
* **Invalid VCS Root**: Initialize and update the locales submodule.
* Use nodejs 12 LTS instead of the latest version.

## Bug reporting

You can [view our issues](https://issues.integreat-app.de/projects/WEBAPP) or
 [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.


