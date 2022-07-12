# Conventions

## Contents

- [Naming](#naming)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Commit Messages and Pull Requests](#commit-messages-and-pull-request)
- [Versioning](#versioning)
- [Folder Structure](#folder-structure)

## Naming

We follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react) for naming.

## Testing

### Unit Tests

Please always test new and changed code using [Jest](https://jestjs.io/).
For unit testing of React components use the [Testing Library](https://testing-library.com) and follow its [guiding principles](https://testing-library.com/docs/guiding-principles).

Run tests:

> yarn test

### E2E Tests

Refer to the corresponding [documentation](e2e-tests.md).
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

Show only linting errors:

> yarn lint --quiet

### IntelliJ Code Snippets

For gaining a more convenient code styling and a smoother development experience you can use our React TypeScript code
snippets which support you by developing proper React, React Native components and also support our Testing-Library and
StyledComponents.

- find them here: `/.idea/templates/React.xml`
- copy to your
  template [directory](https://www.jetbrains.com/help/idea/directories-used-by-the-ide-to-store-settings-caches-plugins-and-logs.html#config-directory)
- You can check for all the shortcuts here: `IntelliJ -> preferences -> search for "live templates"`

**Some Shortcuts:**

| Shortcut | Description                                               |
| :------- | :-------------------------------------------------------- |
| _rfc_    | React Functional Component                                |
| _rnfc_   | React Native Functional Component                         |
| _rccc_   | React class component with constructor                    |
| _rrdc_   | React class connect to redux                              |
| _rtc_    | Standard Component test with react testing-library        |
| _rntc_   | Standard Component test with react native testing-library |
| _scnv_   | styled view native component                              |

## Commit Messages and Pull Request

See [this guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for a general reference on how to
write good commit messages. Commit messages should have the following schema:
**`<Issue key>: Your commit message`**, e.g. `IGAPP-612: Add commit message documentation`

The same applies for PR names.

## Versioning

Versions consist of a version name and a version code.

### Version name

The following [schema](https://calver.org/) ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg)
is used for versioning.
`PATCH` is a counter for the number of releases in the corresponding month starting with 0.

Examples:

- First versions of 2020: `2020.1.0`, `2020.1.1`, `2020.1.2`.
- First version of February 2020: `2020.2.0`.

### Version code

An additional consecutive version code is used for unique identification in the app stores. The version code is
incremented for every build uploaded to the stores. The first version code was `100000`.

## Folder Structure

The `src` folders are structured according to its technical character, for example into assets, hooks, components and
routes. File naming should be PascalCase, inside the routes folder file names should be prefixed by the route name.
Router entry points should have `Page` as a suffix.

```
src
└───routes
│   └───someRoute
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
└───utils
    │   DatabaseConnector.ts
    │   LanguageDetector.ts
    |   indext.ts
```
