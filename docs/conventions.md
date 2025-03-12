# Conventions

## Contents

- [Naming](#naming)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Commit Messages and Pull Requests Names](#commit-messages-and-pull-request-names)
- [Branch Names](#commit-messages-and-pull-request)
- [Reviews](#reviews)
- [Versioning](#versioning)
- [Folder Structure](#folder-structure)
- [Assets and Icons](#assets-and-icons)

## Naming

We follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react) for naming.

## Testing

### Unit Tests

Please always test new and changed code using [Jest](https://jestjs.io/).
For unit testing of React components use the [Testing Library](https://testing-library.com) and follow
its [guiding principles](https://testing-library.com/docs/guiding-principles).

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

We use [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for TypeScript
and [stylelint](https://stylelint.io/) for CSS.

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
| _rtc_    | Standard Component test with react testing-library        |
| _rntc_   | Standard Component test with react native testing-library |
| _scnv_   | styled view native component                              |

## Commit Messages and Pull Request Names

Commit messages should have the following schema:
`<issue number>: Your commit message`, e.g. `1234: Add commit message documentation`

Commit messages and PR names should be short but concise and explain what was done.
Always use present tense (`Add` instead of `Added`).

See [this guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for a general reference on how to
write good commit messages and pull request names.

## Branch Names

Branch names should use lower-kebab-case and be prefixed with the issue number:
`<issue number>-branch-name`, e.g. `1234-commit-message-documentation`

_Note: Branch names (and PR names) do NOT have to match the issue title. Instead, try to be short and concise to focus
on the actual work done._

## Reviews

We use the following emoji code for reviewing:

- :+1: or `:+1:` This is great! It always feels good when somebody likes your work. Show them!
- :question: or `:question:` I have a question / can you clarify?
- :x: or `:x:` This has to change. It’s possibly an error or strongly violates existing conventions.
- :wrench: or `:wrench:` This is a well-meant suggestion. Take it or leave it.
- :upside_down_face: or `:upside_down_face:` This is a nitpick. Normally related to a small formatting or stylizing detail that shouldn’t block moving forward.
- :thought_balloon: or `:thought_balloon:` I’m just thinking out loud here. Something doesn’t necessarily have to change, but I want to make sure to share my thoughts.
- :clown_face: or `:clown_face:` This is a complaint about something with no obvious answer, not necessarily a problem originating from changes.

## Versioning

Versions consist of a version name and a version code and are set in [version.json](../version.json).

### Version Name

We use the [calver schema](https://calver.org) `YYYY.MM.PATCH` for versioning.
`PATCH` is a counter for the number of releases in the corresponding month starting with 0.

Examples:

- First versions of 2024: `2024.1.0`, `2024.1.1`, `2024.1.2`.
- First version of February 2024: `2024.2.0`.

### Version Code

An additional consecutive version code is used for unique identification in the app stores.
The version code has to be incremented for every new release uploaded to the stores.

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

## Assets and Icons

We place our build-config and platform independent assets and icons in the [assets](../assets) in the root directory.
See more information in the corresponding [README](../assets/README.md).
