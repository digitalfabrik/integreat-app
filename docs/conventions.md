# Conventions

## Naming

We follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react) for naming.

## Code style

We mainly follow the [standard style](https://standardjs.com/rules) for JavaScript, although there may be smaller deviations.
Run the linter (`yarn lint`) to show problems. Our eslint config can be found [here](https://github.com/Integreat/eslint-config-integreat).
We use prettier to format code. Run (`yarn workspace <workspace> prettier --check .`) to show formatting problems.

## Git commit messages and Pull request names

See [this guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for a general reference on how to write
good commit messages.
Commit messages should have the following schema:
**`<Issue key>: Your commit message`**, e.g. `WEBAPP-612: Add commit message documentation`

The same applies for PR names.

## Versioning

Versions consist of a version name and a version code.

### Version name

The following [schema](https://calver.org/) ![versioning](https://img.shields.io/badge/calver-YYYY.M.PATCH-22bfda.svg) is used for versioning.
`PATCH` is a counter for the number of releases in the corresponding month starting with 0.

Examples:

- First versions of 2020: `2020.1.0`, `2020.1.1`, `2020.1.2`.
- First version of February 2020: `2020.2.0`.

### Version code

An additional consecutive version code is used for unique identification in the app stores.
The version code is incremented for every build uploaded to the stores.
The first version code was `100000`.

## Folder structure

### Native

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
    └── route-name
│       ├── assets
│       ├── components
│       ├── containers
│       │   └── RouteNamePage.js
│       ├── actions
│       ├── hocs
│       └── reducers
```

A component always follows the following structure (Uppercase files always contain a single class):

```
├── __tests__
│   └── Caption.js
├── Caption.css (Web only)
└── Caption.js
```

### Assets

Assets like icons for the native platform (e.g. Android or iOS) are managed by yo and generator-rn-toolbox. See [here](https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md) for more information.
