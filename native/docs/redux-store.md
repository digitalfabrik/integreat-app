# Redux Store

## Contents

- [State](#state)
- [Actions](#actions)

## State

Refer to the documentation in [StateType](../src/modules/app/StateType.js).

### General State

- `darkMode`: Flag whether the dark mode is enabled. Not used anywhere.
- `resourceCacheUrl`: Url (localhost) from which resources of the cache are served.
- [cityContent](#city-content-state)
- `contentLanguage`: The currently selected content language (independent of the selected city).
- `cities`: Array of all available cities.

### City Content State

- `city`: The currently selected city code. May differ from the city of a route when peeking.
- `switchingLanguage`: Whether a language switch is currently in progress.
- `languages`: All available languages of the city.
- `routeMapping`: A map of navigation route keys to the necessary information of category, event, news or poi routes.
- `resourceCache`: A map of used cms resources to actually downloaded files.
- `searchRoute`: Category models for the search route. Should be removed in IGAPP-126.

## Actions

Refer to the documentation in [StoreActionType](../src/modules/app/StoreActionType.js).
