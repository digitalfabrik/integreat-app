# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo for React JS and React Native apps for multiple white-label products (Integreat, Malte, Aschaffenburg). It uses Yarn workspaces.

**Workspace packages:** `web`, `native`, `shared`, `translations`, `build-configs`, `e2e-tests`

## Commands

All commands are run from the repo root unless noted.

### Testing
```bash
yarn test                         # Run all tests (web + native + shared + translations)
yarn test:changed                 # Only changed files
yarn workspace web test           # Web tests only
yarn workspace native test        # Native tests only
yarn workspace shared test        # Shared tests only
yarn workspace translations test  # Translations tests only
# Run a specific test file
yarn workspace web test src/components/__tests__/MyComponent.spec.tsx
yarn workspace web test -- --testNamePattern="my test name"
```

### Linting & Type Checking
```bash
yarn lint                         # ESLint + stylelint for all packages
yarn ts:check                     # TypeScript type checking across all packages
yarn prettier:write               # Auto-format all files
yarn prettier:check               # Check formatting without writing
yarn check-circular-dependencies  # Detect circular imports
```

### E2E Tests
```bash
yarn workspace e2e test:web       # Web e2e tests (WebdriverIO)
yarn workspace e2e test:native    # Native e2e tests (WebdriverIO)
```

### Web Development
```bash
cd web
yarn start               # Dev server with integreat-test-cms build config
yarn start:malte         # Dev server with malte build config
yarn build               # Production build (integreat)
yarn build:integreat-test-cms  # Build with test CMS
```

### Native Development
```bash
cd native
yarn start               # Start Metro bundler (integreat-test-cms)
yarn android             # Run on Android (integreat-test-cms)
yarn android:integreat   # Run with production integreat config
yarn android:reload      # Hot reload (adb)
```

## Architecture

### Monorepo Structure

- **`shared/`** — API endpoints, data models, routes, and utilities shared between web and native. Imports as `shared` and `shared/api`.
- **`web/src/`** — React webapp using React Router v7. Entry: `RootNavigator` → `RegionContentNavigator` → route pages.
- **`native/src/`** — React Native app using React Navigation (stack + bottom tabs). Entry: `Navigator` → `BottomTabNavigator`.
- **`build-configs/`** — White-label configuration (themes, feature flags, CMS URLs, assets). The `BuildConfigType.ts` defines all available options.
- **`translations/`** — i18n JSON translations for all UI strings, managed with a custom CLI tool.

### White-label / Build Configs

Each build config variant (e.g. `integreat`, `malte`, `aschaffenburg`, `integreat-test-cms`) is defined under `build-configs/<name>/`. Feature flags in `FeatureFlagsType` control which features are enabled (e.g. `chat`, `introSlides`, `sentry`). Use `integreat-test-cms` for development — never test against the production CMS.

### Shared API Layer

`shared/api/` contains typed endpoint builders (`EndpointBuilder`, `Endpoint`). Endpoints are created with factory functions (`createCategoriesEndpoint`, `createRegionEndpoint`, etc.) and consumed via:
- **Web**: `useQueryFromEndpoint` (`web/src/hooks/useQueryFromEndpoint.ts`) — wraps TanStack Query's `useQuery`, returns `UseQueryResult<T>` plus `setData`. Query cache is shared across the app with a 5-minute `staleTime`.
- **Native**: `useLoadWithCache` for main content (backed by `DefaultDataContainer` with file-based persistence), or `useLoadFromEndpoint` (shared) for secondary endpoints.

All CMS data models live in `shared/api/models/` and `shared/models/`.

### Web Routing

URL pattern: `/:regionCode/:languageCode/<route>`. `RootNavigator` handles top-level routes; `RegionContentNavigator` handles region-scoped routes and checks feature flags before rendering. Route names and patterns are defined in `shared/routes/`.

### Native Navigation

Uses React Navigation stack navigator. `Navigator.tsx` is the root; `BottomTabNavigator` contains the main tabs (Categories, Events, News, PLACEs). Each tab has its own nested stack navigator.

### Data Persistence (Native)

`DefaultDataContainer` wraps `DatabaseConnector` (SQLite via react-native-fs) with in-memory `Cache` objects per content type. The singleton `dataContainer` is used throughout native.

### Styling

- **Web**: emotion (`@emotion/styled`) + MUI components
- **Native**: `styled-components/native`
- Both support RTL. Theme is provided via `ThemeContainer` (web) or `styled-components` `ThemeProvider` (native).

### Translations

Translations live in `translations/src/translations/<` with the structure `namespace → key → value`. Use `useTranslation()` to access them. Add new keys to `de.json` and `en.json` — do not hardcode UI strings.

The `translations` workspace has a management CLI for exporting to ODS, importing back, syncing generated files, and validating:
```bash
cd translations
yarn export      # Export base translations to ODS (also :malte, :aschaffenburg, :obdach)
yarn import      # Import translated ODS back (also :malte, :aschaffenburg, :obdach)
yarn sync        # Regenerate the per-directory index.ts barrels and resources.gen.ts
yarn validate    # Check for missing keys, empty values, and placeholder/tag mismatches
yarn check       # Run sync and validate; fails if sync produces a diff
```
Per-brand translation overrides live under `src/override-translations/` for `malte`, `aschaffenburg`, and `obdach`, each with matching `:brand` export/import scripts.

## Testing Conventions

- Unit tests use Jest + React Testing Library.
- Web test utilities: `renderWithTheme`, `renderWithRouterAndTheme`, `renderRoute` — all in `web/src/testing/render.tsx`. All render helpers wrap components in `QueryClientProvider`.
- **Web**: mock API calls with helpers from `web/src/testing/mockUseQueryFromEndpoint.ts` (`mockUseQueryFromEndpointWithData`, `mockUseQueryFromEndpointOnceWithData`, `mockUseQueryFromEndpointWithError`, `mockUseQueryFromEndpointLoading`). Add `jest.mock('<relative-path>/useQueryFromEndpoint')` at the top of each test file.
- **Native / shared**: mock API calls with `mockUseLoadFromEndpointWithData` from `shared/api/endpoints/testing/mockUseLoadFromEndpoint`.
- Test files live in `__tests__/` subdirectories next to the code they test, named `*.spec.tsx`.
- Mock `react-i18next` in tests: `useTranslation: () => ({ t: (key: string) => key })`.
- Use JSX instead of createElement
- Create unit tests, i.e. don't recreate behavior and use mocks instead
- Always use React Testing Library queries (`getByText`, `getByRole`, `getAllByText`, `queryByText`, etc.) to find elements. Do not use custom DOM queries like `document.getElementsByTagName`, `container.querySelectorAll`, or `document.querySelector` for assertions.
- Never use `testID` (or `data-testid`) or `getByTestId`/`queryByTestId` in tests. Query by accessible role, label, or user-visible text instead — that's how users find things and it keeps tests decoupled from implementation. If a piece of UI is unreachable without an id, fix its accessibility rather than reaching for a test id.

## Conventions

- **Commit messages**: `<issue number>: Short present-tense description` (e.g. `1234: Add feature`)
- **Branch names**: `<issue number>-short-description` (e.g. `1234-add-feature`)
- **File naming**: PascalCase. Route entry files get a `Page` (web) or `Container` (native) suffix.
- **Folder structure**: `routes/`, `components/`, `hooks/`, `utils/`, `constants/`, `contexts/`
- **Airbnb naming style** for React components.
- Use meaningful variable names
- Avoid typecasts
- **Pre-commit hook** (`.husky/pre-commit`) auto-formats staged `.js/.jsx/.ts/.tsx` files with prettier and re-stages them. If the commit touches `.circleci/src/`, it also regenerates `.circleci/config.yml` and aborts the commit if the `circleci` CLI isn't installed.

## CMS / API

- Default dev API: test CMS (`cms-test.integreat-app.de`)
- Override in web browser: `window.localStorage.setItem('api-url', 'https://cms-test.integreat-app.de')`
- Override in native: tap the yellow location marker 10 times on the regions page
- Show hidden regions (including testumgebung): search for `wirschaffendas`

## Agent skills

### Issue tracker

Issues and specs are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
