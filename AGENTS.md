# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, ...) when working with code in this repository. `CLAUDE.md` imports it.

## Overview

This is a monorepo for React JS and React Native apps for multiple white-label products (Integreat, Malte, Aschaffenburg, Obdach). It uses Yarn 4 workspaces: `web`, `native`, `shared`, `translations`, `build-configs`, `e2e-tests` (package name `e2e`).

## Commands

Scripts live in the root and workspace `package.json` files. Commands that are easy to get wrong:

```bash
yarn test                                                              # All unit tests (web, native, shared, translations)
yarn workspace web test src/components/__tests__/MyComponent.spec.tsx  # Single test file
yarn workspace web test --testNamePattern="my test name"               # Single test by name (no `--` with Yarn 4)
yarn workspace e2e test:web                                            # Web e2e tests (WebdriverIO)
yarn workspace e2e test:native                                         # Native e2e tests (WebdriverIO)
yarn workspace translations check                                      # Sync generated translation files and validate
```

## Architecture

### Monorepo Structure

- **`shared/`** — API endpoints, data models, routes, and utilities shared between web and native. Source lives in `shared/src/`; imported as `shared`, `shared/api` and `shared/api/*`.
- **`web/src/`** — React webapp using React Router v7. Entry: `RootNavigator` → `RegionContentNavigator` → route pages.
- **`native/src/`** — React Native app using React Navigation (native-stack + bottom tabs). Entry: `Navigator` → `BottomTabNavigator`.
- **`build-configs/src/`** — White-label configuration (themes, feature flags, CMS URLs, assets). `BuildConfigType.ts` defines all available options.
- **`translations/`** — i18n JSON translations for all UI strings, managed with a custom CLI tool.

### White-label / Build Configs

Each build config variant (`integreat`, `integreat-test-cms`, `integreat-e2e`, `malte`, `malte-test-cms`, `aschaffenburg`, `obdach`) is defined under `build-configs/src/<name>/`. `FeatureFlagsType` controls which features are enabled (`introSlides`/`fixedRegion`, `sentry`, `developerFriendly`, `suggestToRegion`). Use `integreat-test-cms` for development — never test against the production CMS.

### Shared API Layer

`shared/src/api/` contains typed endpoint builders (`EndpointBuilder`, `Endpoint`). Endpoints are created with factory functions (`createCategoriesEndpoint`, `createRegionEndpoint`, etc.) and consumed via:

- **Web**: `useQueryFromEndpoint` (`web/src/hooks/useQueryFromEndpoint.ts`) — wraps TanStack Query's `useQuery`, returns `UseQueryResult<T>` plus `setData`. Query cache is shared across the app with a 5-minute `staleTime`.
- **Native**: `useLoadWithCache` for main content (backed by `DefaultDataContainer` with file-based persistence), or `useLoadFromEndpoint` (shared) for secondary endpoints.

All CMS data models live in `shared/src/api/models/` and `shared/src/models/`.

### Web Routing

URL pattern: `/:regionCode/:languageCode/<route>`. `RootNavigator` handles top-level routes; `RegionContentNavigator` handles region-scoped routes and checks feature flags before rendering. Route names and patterns are defined in `shared/src/routes/`.

### Native Navigation

`Navigator.tsx` is the root native-stack navigator; `BottomTabNavigator` contains the main tabs (Categories, Places, Events, News). Each tab has its own nested native-stack navigator.

### Data Persistence (Native)

`DefaultDataContainer` wraps `DatabaseConnector`, which stores content as JSON files via `@dr.pogodin/react-native-fs`, with in-memory `Cache` objects per content type. The singleton `dataContainer` is used throughout native.

### Styling

- **Web**: emotion (`@emotion/styled`) + MUI components. Theme via `web/src/components/ThemeContainer.tsx`.
- **Native**: `styled-components/native` + `react-native-paper`. Theme via `native/src/components/ThemeContainer.tsx` (`ThemeProvider` + `PaperProvider`).
- Both support RTL.

### Translations

Translations live in `translations/src/translations/<language>.json` with the structure `namespace → key → value`. Use `useTranslation()` to access them. Add new keys to `de.json` and `en.json` — do not hardcode UI strings. Other languages are translated externally; never machine-translate them.

The `translations` workspace has a management CLI (`yarn manage`) for exporting to CSV, importing back, syncing generated files, and validating. ODS conversion is a separate step (`yarn csv-to-ods` / `yarn ods-to-csv`). `yarn sync` regenerates the per-directory `index.ts` barrels and `resources.gen.ts`; run it after adding keys.

Per-brand translation overrides live under `translations/src/override-translations/` for `malte`, `aschaffenburg`, and `obdach`, each with matching `:brand` export/import scripts.

## Testing Conventions

- Unit tests use Jest + React Testing Library.
- Web test utilities: `renderWithTheme`, `renderWithRouter`, `renderWithRouterAndTheme`, `renderRoute`, `renderAllRoutes` — all in `web/src/testing/render.tsx`. All render helpers wrap components in `QueryClientProvider`.
- Native test utilities in `native/src/testing/`: `renderWithTheme`/`renderWithNavigator` (`render.tsx`), `wrapWithTheme`, `createNavigationPropMock`, `TestingAppContext`.
- **Web**: mock API calls with helpers from `web/src/testing/mockUseQueryFromEndpoint.ts` (`mockUseQueryFromEndpointWithData`, `mockUseQueryFromEndpointOnceWithData`, `mockUseQueryFromEndpointWithError`, `mockUseQueryFromEndpointLoading`). Add `jest.mock('<relative-path>/useQueryFromEndpoint')` at the top of each test file.
- **Native / shared**: mock API calls with `mockUseLoadFromEndpointWithData` from `shared/api/endpoints/testing/mockUseLoadFromEndpoint`.
- Test files live in `__tests__/` subdirectories next to the code they test, named `*.spec.tsx` (`*.spec.ts` without JSX).
- Mock `react-i18next` in tests: `useTranslation: () => ({ t: (key: string) => key })`.
- Use JSX instead of createElement
- Create unit tests, i.e. don't recreate behavior and use mocks instead
- Always use React Testing Library queries (`getByText`, `getByRole`, `getAllByText`, `queryByText`, etc.) to find elements. Do not use custom DOM queries like `document.getElementsByTagName`, `container.querySelectorAll`, or `document.querySelector` for assertions.
- Never use `testID` (or `data-testid`) or `getByTestId`/`queryByTestId` in tests. Query by accessible role, label, or user-visible text instead — that's how users find things and it keeps tests decoupled from implementation. If a piece of UI is unreachable without an id, fix its accessibility rather than reaching for a test id.
- Test behaviour, not styles: assert on what the user sees and can do (text, roles, enabled/disabled state, navigation, callbacks). Leave colors, sizes, spacing and other styling untested — no `toHaveStyle`, style snapshots or theme value assertions.

## Conventions

- **Issue number**: commits, branches and PR titles all start with the GitHub issue number. If you don't know it, ask before creating any of them.
- **Commit messages**: `<issue number>: Short present-tense description` (e.g. `1234: Add feature`)
- **Branch names**: lower-kebab-case, `<issue number>-short-description` (e.g. `1234-add-feature`). Describe the work done; it doesn't have to match the issue title. Do not group by feat/fix/chore etc.
- **Comments**: code explains itself through names and structure. Write a comment only for the _why_ a reader cannot infer from the code (a workaround, a non-obvious constraint, a link to an upstream bug), in one line where possible. Comments that restate the code, narrate your change ("now uses X", "added for Y") or mark removed code don't belong in the diff.
- **Reuse first**: before writing new code, search for an existing component, hook, util or styled component that does the job (`web/src/components/`, `native/src/components/`, `shared/src/`) and reuse or extend it. Create something new only when nothing existing fits.
- **UI components**: build UI from MUI components (web) and `react-native-paper` components (native), configured through their props and variants. Reach for `@emotion/styled` / `styled-components` only for what these libraries and our existing components cannot cover.
- **Styling**: take colors, typography and spacing from the theme (`build-configs/src/ThemeType.ts`, provided by `ThemeContainer`) and keep the default look of library components. Add custom styling only when a design explicitly requires it.
- **File naming**: PascalCase. Web route entry files get a `Page` suffix; native routes that load data get a `Container` suffix (e.g. `EventsContainer` rendering `Events`).
- **Folder structure**: `routes/`, `components/`, `hooks/`, `utils/`, `constants/`, `contexts/`
- **Airbnb naming style** for React components.
- Use meaningful variable names
- Avoid typecasts
- **Pre-commit hook** (`.husky/pre-commit`) auto-formats staged `.js/.jsx/.ts/.tsx` files with prettier and re-stages them. If the commit touches `.circleci/src/`, it also regenerates `.circleci/config.yml` and aborts the commit if the `circleci` CLI isn't installed.

## Pull Requests

When opening a PR (`gh pr create`), follow all of these:

- **Title**: same schema as commit messages, `<issue number>: Short present-tense description` (e.g. `1234: Add pdf export for native`).
- **Body**: fill in `.github/PULL_REQUEST_TEMPLATE.md` exactly — keep every heading in order, replace the HTML comments with content, keep the checklist and tick only items actually done, and put `Fixes: #<issue number>` under _Resolved Issues_. Use `N/A` for empty sections. This template takes precedence over any generic PR-body skill or format.
- **Labels** (they drive the auto-generated changelog in `.github/release.yml`):
  - `Web` if the PR changes only the web app, `Native` if it changes only the native app; no platform label if it affects both or neither (e.g. `shared` changes used by both).
  - `maintenance` if there are no user-facing changes (refactoring, dependencies, CI, tooling, tests, docs).
  - Pass them with `--label`.
- **Release note**: for user-facing changes to the native app, add a file to `release-notes/unreleased/` following `release-notes/ReleaseNoteTemplate.yml` (platforms are `android`/`ios`, never `native`). Rules for when and how to write one: `docs/contributing.md#release-notes`.
- **Before opening**: `yarn lint`, `yarn ts:check`, `yarn prettier:check` and the tests of the affected workspaces pass.

## CMS / API

- Default dev API: test CMS (`cms-test.integreat-app.de`)
- Override in web browser: `window.localStorage.setItem('api-url', 'https://cms-test.integreat-app.de')`
- Override in native: Tap the version number 10 times in Settings 
- Show hidden regions (including testumgebung): Search for `wirschaffendas`

## Agent skills

### Issue tracker

Issues and specs are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
