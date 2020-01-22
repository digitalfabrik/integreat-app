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

### Testing
* [Jest](https://facebook.github.io/jest/) is used for testing.
* [<img src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/static/header/header-logo.svg" width="150">](https://www.browserstack.com) is used for testing cross-browser compatibility
* To test another api, you can set the new cms domain via Console of your web browser: Just type `window.localStorage.setItem('api-url', 'https://cms-test.integreat-app.de')` and reload the page.

### Linting
* The linter for JavaScript is [eslint](http://eslint.org/)
* The linter for CSS is [stylelint](https://stylelint.io/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lintfix**

### Type checking
[Flow](https://flow.org/) is used for static type checking.

Go to Settings > Languages & Frameworks > JavaScript and
* choose **Flow** as Language version
* set *Flow package or executable* to **<project_dir>/node_modules/flow-bin**

You can run flow using **yarn flow**. 

## IDE
**Make sure you have at least [nodejs 6](https://nodejs.org/) installed**

We suggest IntellJ IDEA Ultimate as IDE. Just import this project (from existing sources).
Run **yarn** in Terminal and right-click on package.json to show the npm scripts. 
Also mark the *src* and *www* folder as *Source directory*.

Install the following plugins:
* EJS
* ESLint
* React CSS Modules
* Styled Components

Go to:
* Run > Edit Configurations > Defaults > Jest  
   to set **Configuration file** to **jest.config.json**
   
If you want you can associate the *.snap files with the file type JavaScript.

# Issue Tracker

You can [view our issues](https://issues.integreat-app.de/projects/WEBAPP) or [create new ones](https://issues.integreat-app.de/secure/CreateIssue!default.jspa) on our jira.

# Deployment

## Deployment of shared content

Some components are used in [neuburg-frontend](https://github.com/Integreat/neuburg-frontend).
These are listed in [lib.js](src/lib.js) and are available through the npm package [@integreat-app/shared](https://www.npmjs.com/package/@integreat-app/shared).
To publish the npm package, use `yarn run build:lib`, move to `/dist` and run `npm publish --access=public` (after logging into your npm account registered to integreat-app).
You'll  also have to bump the version in [`lib.build.js`](tools/lib.build.js).
## Deployment to web.

1. Create new release on Jira (should be empty)
2. Update old issues to use the created release as Fix Version
   * Query to find issues which haven't been released: `project = "integreat-webapp" AND issuetype = Task AND Sprint IS NOT EMPTY AND fixVersion IS EMPTY AND resolution = Done`
3. Release the Jira release
4. Generate release notes in Jira

5. Create a branch and create a Pull Request to develop:
    * Update version number e.g. "2018.03.02" in package.json
6. Merge branch in develop

7. Create Pull Request to merge develop in master:
8. Merge develop in master

9. The app gets deployed automatically to  [integreat.app](https://integreat.app/) by our jenkins.


10. Tag the master HEAD as "2018.03.02". Add the release notes from Jira as description.
11. Send release notes to Slack channel #app-web

## Deployment to webnext.

When pushing to any branch a [jenkins](https://build.integreat-app.de/job/integreat-webapp/) build ist triggered. When 
pushing to **develop** the app also gets deployed to  [webnext.integreat-app.de](https://webnext.integreat-app.de/). 
