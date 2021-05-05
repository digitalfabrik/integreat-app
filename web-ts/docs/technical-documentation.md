# Technical Documentation

## Contents

- [Technology Stack](#technology-stack)
- [Testing](#testing)
- [Hidden Cities](#hidden-cities)
- [Code Quality](#code-quality)
- [Backend](#backend)

## Technology Stack

### Bundler

[Webpack](https://webpack.github.io/) is used to compile and bundle the app.

### Application state

[Redux](http://redux.js.org/) is used for the global application state.
The data which is received through the restful api of the CMS is "cached" and stored in this state container.

## Testing

### Unit Tests

[Jest](https://facebook.github.io/jest/) is used for testing.

**For testing of React components the [testing-library](https://testing-library.com) should be used whenever possible.**
Testing the application components should be done in the way the user would use it as stated in its [guiding principles](https://testing-library.com/docs/guiding-principles).

### E2E Tests

Refer to the corresponding [documentation](../../docs/e2e-tests.md).
You can use [Browserstack](https://www.browserstack.com) for testing cross-browser compatibility.

## Code Quality

### Formatting

We use [prettier](https://prettier.io) to format code.
Run `yarn workspace <workspace> prettier --check .` to show formatting problems or `yarn workspace <workspace> prettier --write .` to fix them.

### Linting

Linting is responsible to embrace best practice coding style.
We use [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for TypeScript and [stylelint](https://stylelint.io/) for CSS.

You can run the linter by calling `yarn lint`.

### Folder Structure

First level structure of the `src-Folder` is technical specific and includes routes, reusable components, hooks, contexts and services.
Inside the `routes-Folder`, subfolders are domain specific and can have - if necessary - also technical separation.
File naming should be PascalCase, inside routes-Folder file names should be prefixed by the route name.
Router entry points should have `Page` as a suffix, services should have `Service` suffix.

```
src
└───routes
│   └───SomeRoute
│       │   SomeRoutePage.tsx
│       └───component
│       │   │ SomeRouteItem.tsx
│       │   │ SomeRouteList.tsx
│       └───service
│           │ SomeRouteSpecificService.ts
└───components
│   │   Button.tsx
│   │   Icon.tsx
└───hooks
└───context
└───services
    └───Format
        │   DateFormatterService.ts
```

## Backend

**Testing with the live cms instance should be avoided:**

- In debug builds (`yarn start`, `yarn build:debug` and `webnext.integreat-app.de`) the test cms is used as default, so it is **only required for release builds**, i.e. on `integreat.app`.
- To switch the used cms instance:
  - Enter `window.localStorage.setItem('api-url', <cms url>)` in the console of your web browser.
  - Reload the page.

The endpoints are defined in the [api-client](../../api-client).

- The current backend uses WordPress and can be found [here](https://github.com/Integreat/cms).
- [API Documentation](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation)
- We are working on replacing it with a [python/django project](https://github.com/Integreat/cms-django).

### Hidden cities

Hidden (i.e. non live) cities can be viewed on the landing page by entering the search query `wirschaffendas`.
