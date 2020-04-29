# Technical documentation
## Content
* [Technology stack](#technology-stack)
* [Persistence](11-persistence.md)
* [Design changes](12-design-changes.md)
* [UI/UX](13-ui-ux.md)
* [I18n](14-i18n.md)
* [Error reporting](05-error-reporting.md)
* [React Native Upgrades](15-react-native-upgrades.md)

## Technology Stack
### Bundler
[Metro](https://facebook.github.io/metro/) is used to compile and bundle the app.

### Frontend framework
[React](https://facebook.github.io/react/) is used as frontend framework.
This allows us to build a single-page-application easily.

### JavaScript compiler
[Babel](https://babeljs.io/) is used to make the app available to a broader audience while 
allowing the developers to use many new language features. We use flow for type safety.

### Application state
[Redux](http://redux.js.org/) is used for the global application state. 
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

### Testing
* [Unit/Integration Testing](07-testing.md)
* [E2E Testing](08-e2e-testing.md)

#### Test CMS
**Testing with the live cms instance should be avoided.**
To switch between test and live cms, click the location image on the landing page 10 times.
On iOS it may be required to close and reopen the app after changing the cms instance.
This is not required when testing locally since the test cms is used as default here.

### Linting
* The linter for JavaScript is [eslint](http://eslint.org/)

You can run the linter by calling **yarn run lint**. Some issues can be fixed automatically by running **yarn run lint:fix**

### Type checking
[Flow](https://flow.org/) is used for static type checking.

You can run flow using **yarn flow**. 

### Backend
The endpoints for the webapp and this project are defined in the [api-client](https://github.com/Integreat/api-client).

* The current backend uses WordPress and can be found [here](https://github.com/Integreat/cms).
* [API Documentation](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation)
* We are working on replacing it with a [python/django project](https://github.com/Integreat/cms-django).
