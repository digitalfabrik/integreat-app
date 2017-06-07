![dependencies](https://img.shields.io/librariesio/github/Integreat/integreat-webapp.svg)
develop: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=develop)
master: ![develop build state](https://api.travis-ci.org/Integreat/integreat-webapp.svg?branch=master)
# integreat-webapp

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
[PostCSS](http://postcss.org/) allows to extend the current CSS3 feature set by using several plugins:
* postcss-calc
* postcss-color-function - To calculate and modify colors
* postcss-custom-media
* postcss-custom-properties
* postcss-custom-selectors
* postcss-flexbugs-fixes
* postcss-import
* postcss-media-minmax
* postcss-nesting - To nest styles
* postcss-selector-matches
* postcss-selector-not

### Application state
[Redux](http://redux.js.org/) is used for the global application state. 
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

Used Redux extensions:
* redux-actions - Makes the creation of actions easier
* reduce-reducers
* redux-thunk - Makes async state modification possible
* redux-logger - A neat debugging feature

### Testing
[Mocha](https://mochajs.org/) is used for testing. Currently not actively though..

### Linting
* The linter for JavaScript is [eslint](http://eslint.org/)
* The linter for CSS is [stylelint](https://stylelint.io/)

You can run the linter by calling **npm run lint**.

## IDE
Just import this project (from existing sources). Run **yarn** and right-click on package.json to show the npm scripts. 
Also mark the *src* and *public* folder as *Source directory*. In IntelliJ no other plugins are needed. 


# Publishing

You can login though the firebase cli and then run **npm run publish**.
A live preview of this app is available [here](https://integreat-1173.firebaseapp.com/).
