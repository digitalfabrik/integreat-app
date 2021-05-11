# Technical documentation

## Content

- [Technology Stack](#technology-stack)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Backend](#backend)
- [Hidden Cities](#hidden-cities)
- [Persistence](persistence.md)
- [UI/UX](ui-ux.md)
- [I18n](i18n.md)
- [Error Reporting](error-reporting.md)
- [React Native Upgrades](react-native-upgrades.md)

## Technology Stack

### Bundler

[Metro](https://facebook.github.io/metro/) is used to compile and bundle the app.

### Frontend framework

[React](https://facebook.github.io/react/) is used as frontend framework.

### Application state

[Redux](http://redux.js.org/) is used for the global application state.
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

## Testing

- [Unit/Integration Testing](testing.md)
- [E2E Testing](e2e-testing.md)

The app supports opening deep links in the app. To test deep links manually, you can:

- Click on the link you want to test in any other app of your choice
- Use [url-scheme](https://www.npmjs.com/package/uri-scheme) as mentioned [here](https://reactnavigation.org/docs/deep-linking/#test-deep-linking-on-ios).

## Code Quality

### Formatting

We use [prettier](https://prettier.io) to format code.
Run `yarn workspace <workspace> prettier --check .` to show formatting problems or `yarn workspace <workspace> prettier --write .` to fix them.

### Linting

Linting is responsible to embrace best practice coding style.
We use [eslint](http://eslint.org/) for JavaScript.

You can run the linter by calling `yarn lint`.

### Type Checking

We use [Flow](https://flow.org/) for static type checking.

You can run flow using `yarn flow`.

## Backend

**Testing with the live cms instance should be avoided:**

- In debug builds the test cms is used as default, so it is **only required for release builds**, i.e. the versions in the stores.
- To switch between test and live cms, click the location image on the landing page 10 times.
  On iOS it may be required to close and reopen the app after changing the cms instance.

The endpoints for the webapp and this project are defined in the [api-client](../../api-client).

- The current backend uses WordPress and can be found [here](https://github.com/Integreat/cms).
- [API Documentation](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation)
- We are working on replacing it with a [python/django project](https://github.com/Integreat/cms-django).

### Hidden cities

Hidden (i.e. non live) cities can be viewed on the landing page by entering the search query `wirschaffendas`.
