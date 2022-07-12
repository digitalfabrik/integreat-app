# Technical Documentation

## Contents

- [Testing](#testing)
- [Code Quality](#code-quality)
- [CMS](#cms)
- [Hidden Cities](#hidden-cities)

## Testing

### Unit Tests

For unit testing of React components use the [Testing Library](https://testing-library.com) and follow its [guiding principles](https://testing-library.com/docs/guiding-principles).

Commands:
> yarn test

### E2E Tests

Refer to the corresponding [documentation](../../docs/e2e-tests.md).
You can use [Browserstack](https://www.browserstack.com) for testing cross-platform compatibility.

## Code Quality

### TypeScript

We use [TypeScript](https://www.typescriptlang.org/).

Show TypeScript errors:
> yarn ts:check

### Formatting

We use [prettier](https://prettier.io) to format code.

Apply prettier code formatting:
> yarn prettier:write

### Linting

We use [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for TypeScript and [stylelint](https://stylelint.io/) for CSS.

Show linting errors and warnings:
> yarn lint

Only show linting errors:
> yarn lint --quiet

## CMS

**Testing with the production cms should be avoided!**

In development builds, i.e. `yarn start` and the [development environments](delivery-environments.md#development), the test cms is used as default.

To change the cms, enter the following command in the console of your web browser:
> window.localStorage.setItem('api-url', <cms_url>)

The cms can be found [here](https://github.com/digitalfabrik/integreat-cms).
There is no up-to-date api documentation but an outdated one can be found [here](https://github.com/Integreat/cms/wiki/REST-APIv3-Documentation).

### Testing CMS Content

To test with content from the cms the **testumgebung** can be used. If you don't know how to do that, reach out to us.

### Hidden Cities

Hidden cities, especially the testumgebung, can be shown by entering the search query `wirschaffendas` in the city selection.
