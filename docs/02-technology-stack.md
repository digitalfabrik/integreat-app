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

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lint:fix**

### Type checking
[Flow](https://flow.org/) is used for static type checking.

You can run flow using **yarn flow**. 
