[![Dependency Status](https://gemnasium.com/badges/github.com/Integreat/integreat-webapp.svg)](https://gemnasium.com/github.com/Integreat/integreat-webapp)
develop: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=develop)
master: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=master)
versioning: ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)
# integreat-webapp

## Conventions

For naming we follow the airbnb style: https://github.com/airbnb/javascript/tree/master/react
For the JavasScript code style we use the standard style: https://standardjs.com/
For git commit messages: https://github.com/erlang/otp/wiki/Writing-good-commit-messages

## Versioning
![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg) with:
* **`YYYY`** - Full year - 2006, 2016
* **`MM`** - Short month - 1, 2 ... 11, 12
* **`Minor`** - The third number in the version. For feature and bugfix releases.

## Folder structure
```
├── __mocks__
├── modules
│   └── app
│       ├── constants
│       ├── assets
│       ├── components
│       ├── containers
│       ├── actions
│       ├── hocs
│       └── reducers
└── routes
    └── route-name
│       ├── assets
│       ├── components
│       ├── containers
│       │   └── RouteNamePage.js
│       ├── actions
│       ├── hocs
│       └── reducers
```
A component always follows the following structure (Uppercase files always contain a single class):
```
├── __tests__
│   └── Caption.js
├── Caption.css
└── Caption.js
```

## Technology stack

### Build tools
[Webpack](https://webpack.github.io/) is used to compile and bundle the app.
You can find documentation about this in [tools](tools/README.md).

### Frontend framework
[React](https://facebook.github.io/react/) is used as frontend framework.
This allows us to build a single-page-application easily.

### JavaScript compiler
[Babel](https://babeljs.io/) is used to make the app available to a broader audience while 
allowing the developers to use many new language features.
Currently we do not use TypeScript but plan to look into Flow.

### CSS processor
[PostCSS](http://postcss.org/) allows to extend the current CSS3 feature set by using several plugins (see package.json).

### Application state
[Redux](http://redux.js.org/) is used for the global application state. 
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

Used Redux extensions:
* redux-actions - Makes the creation of actions easier
* reduce-reducers
* redux-thunk - Makes async state modification possible
* redux-logger - A neat debugging feature

### Testing
* [Jest](https://facebook.github.io/jest/) is used for testing.
* [<img src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/static/header/header-logo.svg" width="150">](https://www.browserstack.com) is used for testing cross-browser compatibility

### Linting
* The linter for JavaScript is [eslint](http://eslint.org/)
* The linter for CSS is [stylelint](https://stylelint.io/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lintfix**

## IDE
**Make sure you have at least [nodejs 6](https://nodejs.org/) installed**

We suggest IntellJ IDEA Ultimate as IDE. Just import this project (from existing sources).
Run **yarn** in Terminal and right-click on package.json to show the npm scripts. 
Also mark the *src* and *www* folder as *Source directory*.

Install the following plugins:
* PostCSS
* EJS
* ESLint
* React CSS Modules

Go to:
* Run > Edit Configurations > Defaults > Jest  
   to set **Configuration file** to **jest.config.json**

# Bug Tracker

You can [view our bugs](https://integreat.atlassian.net/) or [create new ones](https://integreat.atlassian.net/secure/CreateIssue!default.jspa) on our jira.

# Deployment

## Deployment to web.

See instructions [here](tools/deploy/README.md).

## Deployment to webnext.

1.  When pushing to any branch a [travis](https://travis-ci.org/Integreat/integreat-webapp) build ist triggered. When 
    pushing to **develop** the app also gets deployed to [Github Releases](https://help.github.com/articles/about-releases/).
2.  The deployment task creates a Git tag and creates a release. A **www.tar** tarball is attached to the release as asset.
3.  Github sends a release event to the Integreat servers where our [webhook server](https://github.com/Integreat/github-webhook-publish) is running.
4. The webhook server makes the www.tar available to a web server.

A live preview of this app is available [here](https://webnext.integreat-app.de/).
