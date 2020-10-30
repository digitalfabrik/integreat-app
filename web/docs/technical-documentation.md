# Technology stack
## Build tools
[Webpack](https://webpack.github.io/) is used to compile and bundle the app.

## Frontend framework
[React](https://facebook.github.io/react/) is used as frontend framework.
This allows us to build a single-page-application easily.

## JavaScript compiler
[Babel](https://babeljs.io/) is used to make the app available to a broader audience while 
allowing the developers to use many new language features.
Currently we do not use TypeScript but plan to look into Flow.

## CSS processor
[PostCSS](http://postcss.org/) allows to extend the current CSS3 feature set by using several plugins (see package.json).

## Application state
[Redux](http://redux.js.org/) is used for the global application state. 
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

## Testing
* [Jest](https://facebook.github.io/jest/) is used for testing.
* [<img src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/static/header/header-logo.svg" width="150">](https://www.browserstack.com) is used for testing cross-browser compatibility

### Test CMS
**Testing with the live cms instance should be avoided.**
In debug builds (`yarn start`, `yarn build:debug` and `webnext.integreat-app.de`) the test cms is used as default, so it is **only required for release builds**, i.e. on `integreat.app`.

To use the test cms:
* Enter `window.localStorage.setItem('api-url', 'https://cms-test.integreat-app.de')` 
in the console of your web browser.
* Reload the page.
This is not required when testing locally on localhost since the test cms is used as default here.

### Hidden cities
Hidden cities can be viewed on the landing page by entering the search query `wirschaffendas`.

## Linting
* The linter for JavaScript is [eslint](http://eslint.org/)
* The linter for CSS is [stylelint](https://stylelint.io/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lint:fix**

## Type checking
[Flow](https://flow.org/) is used for static type checking.

You can run flow using **yarn flow**. 

## Backend
The endpoints for the webapp and this project are defined in the [api-client](https://github.com/Integreat/integreat-api-client).

* The current backend uses WordPress and can be found [here](https://github.com/Integreat/cms).
* [API Documentation](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation)
* We are working on replacing it with a [python/django project](https://github.com/Integreat/cms-django).
