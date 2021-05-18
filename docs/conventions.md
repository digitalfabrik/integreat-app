# Conventions

## Naming

We follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react) for naming.

## Code style

We use [prettier](https://prettier.io) to format code. Run `yarn workspace <workspace> prettier --check .` to show formatting problems or `yarn workspace <workspace> prettier --write .` to fix them.
We use [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for TypeScript linting. Run `yarn lint` to show linting problems.

## Git commit messages and Pull request names

See [this guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for a general reference on how to write
good commit messages.
Commit messages should have the following schema:
**`<Issue key>: Your commit message`**, e.g. `IGAPP-612: Add commit message documentation`

The same applies for PR names.

## Versioning

Versions consist of a version name and a version code.

### Version name

The following [schema](https://calver.org/) ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg) is used for versioning.
`PATCH` is a counter for the number of releases in the corresponding month starting with 0.

Examples:

- First versions of 2020: `2020.1.0`, `2020.1.1`, `2020.1.2`.
- First version of February 2020: `2020.2.0`.

### Version code

An additional consecutive version code is used for unique identification in the app stores.
The version code is incremented for every build uploaded to the stores.
The first version code was `100000`.

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
    └── <route-name>
│       ├── assets
│       ├── components
│       ├── containers
│       │   └── RouteNamePage.js
│       ├── actions
│       ├── hocs
│       └── reducers
```

Tests should always be positioned in a `__tests__` directory on the same level as the file which is tested.

```
├── __tests__
│   └── Caption.spec.js
└── Caption.js
```
