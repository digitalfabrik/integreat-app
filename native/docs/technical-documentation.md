# Technical documentation

## Content

* [Glossary](https://wiki.integreat-app.de/glossary)
* [Technology stack](#technology-stack)
* [Persistence](docs/persistence.md)
* [UI/UX](docs/ui-ux.md)
* [I18n](docs/i18n.md)
* [Error reporting](docs/error-reporting.md)
* [React Native Upgrades](docs/react-native-upgrades.md)

## Technology Stack

### Bundler

[Metro](https://facebook.github.io/metro/) is used to compile and bundle the app.

### Frontend framework

[React](https://facebook.github.io/react/) is used as frontend framework.

### JavaScript compiler

[Babel](https://babeljs.io/) is used to make the app available to a broader audience while 
allowing the developers to use many new language features. We use flow for type safety.

### Application state

[Redux](http://redux.js.org/) is used for the global application state. 
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

### Testing

* [Unit/Integration Testing](docs/testing.md)
* [E2E Testing](docs/e2e-testing.md)

#### Test CMS

**Testing with the live cms instance should be avoided.**
In debug builds the test cms is used as default, so it is **only required for release builds**, i.e. the versions in the stores.

To switch between test and live cms, click the location image on the landing page 10 times.
On iOS it may be required to close and reopen the app after changing the cms instance.

### Hidden cities

Hidden cities can be viewed on the landing page by entering the search query `wirschaffendas`.

### Linting

* The linter for JavaScript is [eslint](http://eslint.org/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lint:fix**

### Type checking

[Flow](https://flow.org/) is used for static type checking.

You can run flow using **yarn flow**. 

### Backend

The endpoints for the webapp and this project are defined in the [api-client](https://github.com/Integreat/integreat-api-client).

* The current backend uses WordPress and can be found [here](https://github.com/Integreat/cms).
* [API Documentation](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation)
* We are working on replacing it with a [python/django project](https://github.com/Integreat/cms-django).
