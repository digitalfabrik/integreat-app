import { CategoriesMapModel, CityModel, ErrorCode, EventModel, LanguageModel, PoiModel } from 'api-client'

import { ContentLoadCriterionType } from '../models/ContentLoadCriterion'
import { CategoryRouteConfigType, LanguageResourceCacheStateType, SnackbarType } from './StateType'

// Starts fetching all available cities
export type FetchCitiesActionType = {
  type: 'FETCH_CITIES'
  readonly params: {
    readonly forceRefresh: boolean
  }
}
// Pushes fetched cities to the state
export type PushCitiesActionType = {
  type: 'PUSH_CITIES'
  readonly params: {
    readonly cities: ReadonlyArray<CityModel>
  }
}
// Adds an error occurred during fetching of cities to the state
export type FetchCitiesFailedActionType = {
  type: 'FETCH_CITIES_FAILED'
  readonly params: {
    readonly message: string
    readonly code: ErrorCode
  }
}
export type CitiesActionType = PushCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType
// Pushes fetched languages to the state
export type PushLanguagesActionType = {
  type: 'PUSH_LANGUAGES'
  readonly params: {
    readonly languages: ReadonlyArray<LanguageModel>
  }
}
// Adds an error occurred during fetching of languages to the state
export type FetchLanguagesFailedActionType = {
  type: 'FETCH_LANGUAGES_FAILED'
  readonly params: {
    readonly message: string
    readonly code: ErrorCode
  }
}
// Sets the currently used content language
export type SetContentLanguageActionType = {
  type: 'SET_CONTENT_LANGUAGE'
  readonly params: {
    readonly contentLanguage: string
  }
}
// Adds a new category route to the state and starts fetching relevant data
export type FetchCategoryActionType = {
  type: 'FETCH_CATEGORY'
  readonly params: CategoryRouteConfigType & {
    readonly key: string
    readonly criterion: ContentLoadCriterionType
  }
}
// Sets an occurred error to the corresponding category route
export type FetchCategoryFailedActionType = {
  type: 'FETCH_CATEGORY_FAILED'
  readonly params: CategoryRouteConfigType & {
    readonly key: string
    readonly message: string
    readonly code: ErrorCode
    readonly allAvailableLanguages: ReadonlyMap<string, string> | null
  }
}
// Pushes fetched category to the corresponding route the state
export type PushCategoryActionType = {
  type: 'PUSH_CATEGORY'
  readonly params: CategoryRouteConfigType & {
    readonly categoriesMap: CategoriesMapModel
    readonly resourceCache: LanguageResourceCacheStateType
    readonly cityLanguages: Array<LanguageModel>
    readonly key: string
    readonly refresh: boolean
  }
}
export type CategoriesActionType = FetchCategoryActionType | PushCategoryActionType | FetchCategoryFailedActionType
// Adds a new pois route to the state and starts fetching relevant data
export type FetchPoiActionType = {
  type: 'FETCH_POI'
  readonly params: {
    readonly city: string
    readonly language: string
    readonly path: string | null | undefined
    readonly key: string
    readonly criterion: ContentLoadCriterionType
  }
}
// Pushes fetched pois to the corresponding route the state
export type PushPoiActionType = {
  type: 'PUSH_POI'
  readonly params: {
    readonly pois: ReadonlyArray<PoiModel>
    readonly path: string | null | undefined
    readonly key: string
    readonly resourceCache: LanguageResourceCacheStateType
    readonly cityLanguages: ReadonlyArray<LanguageModel>
    readonly language: string
    readonly city: string
  }
}
// Sets an occurred error to the corresponding pois route
export type FetchPoiFailedActionType = {
  type: 'FETCH_POI_FAILED'
  readonly params: {
    readonly message: string
    readonly code: ErrorCode
    readonly key: string
    readonly allAvailableLanguages: ReadonlyMap<string, string | null | undefined> | null | undefined
    readonly language: string
    readonly path: string | null | undefined
    readonly city: string
  }
}
export type PoisActionType = FetchPoiActionType | PushPoiActionType | FetchPoiFailedActionType
// Adds a new event route to the state and starts fetching relevant data
export type FetchEventActionType = {
  type: 'FETCH_EVENT'
  readonly params: {
    readonly city: string
    readonly language: string
    readonly path: string | null | undefined
    readonly key: string
    readonly criterion: ContentLoadCriterionType
  }
}
// Pushes fetched events to the corresponding route the state
export type PushEventActionType = {
  type: 'PUSH_EVENT'
  readonly params: {
    readonly events: ReadonlyArray<EventModel>
    readonly path: string | null | undefined
    readonly key: string
    readonly resourceCache: LanguageResourceCacheStateType
    readonly cityLanguages: ReadonlyArray<LanguageModel>
    readonly language: string
    readonly city: string
    readonly refresh: boolean
  }
}
// Sets an occurred error to the corresponding event route
export type FetchEventFailedActionType = {
  type: 'FETCH_EVENT_FAILED'
  readonly params: {
    readonly message: string
    readonly code: ErrorCode
    readonly key: string
    readonly allAvailableLanguages: ReadonlyMap<string, string | null | undefined> | null | undefined
    readonly language: string
    readonly path: string | null | undefined
    readonly city: string
  }
}
export type EventsActionType = FetchEventActionType | PushEventActionType | FetchEventFailedActionType
// Initiates a content language switch, i.e. switching the content language and morphing all opened routes.
export type SwitchContentLanguageActionType = {
  type: 'SWITCH_CONTENT_LANGUAGE'
  readonly params: {
    readonly newLanguage: string
    readonly city: string
  }
}
// Stops the content language switch if an error occurred.
export type SwitchContentLanguageFailedActionType = {
  type: 'SWITCH_CONTENT_LANGUAGE_FAILED'
  readonly params: {
    readonly message: string
  }
}
export type ContentLanguageActionType = SwitchContentLanguageActionType | SwitchContentLanguageFailedActionType
// Initiates replacing (morphing) the routes in the old with corresponding ones in the new language.
export type MorphContentLanguageActionType = {
  type: 'MORPH_CONTENT_LANGUAGE'
  readonly params: {
    readonly newCategoriesMap: CategoriesMapModel
    readonly newResourceCache: LanguageResourceCacheStateType
    readonly newEvents: ReadonlyArray<EventModel>
    readonly newPois: ReadonlyArray<PoiModel>
    readonly newLanguage: string
  }
}
// Removes the corresponding route from the state
export type ClearRouteActionType = {
  type: 'CLEAR_ROUTE'
  readonly params: {
    readonly key: string
  }
}
// Clears the selected city by removing the corresponding state and setting and unsubscribing from push notifications.
export type ClearCityActionType = {
  type: 'CLEAR_CITY'
}
// Updates the progress of the resource fetching, used for showing the loading spinner
export type ResourcesFetchProgressActionType = {
  type: 'FETCH_RESOURCES_PROGRESS'
  readonly params: {
    readonly progress: number
  }
}
// Sets an occurred error to the resource cache
export type ResourcesFetchFailedActionType = {
  type: 'FETCH_RESOURCES_FAILED'
  readonly params: {
    readonly message: string
    readonly code: ErrorCode
  }
}
export type CityContentActionType =
  | CategoriesActionType
  | EventsActionType
  | PoisActionType
  | MorphContentLanguageActionType
  | ContentLanguageActionType
  | ClearRouteActionType
  | ClearCityActionType
  | PushLanguagesActionType
  | FetchLanguagesFailedActionType
  | ResourcesFetchProgressActionType
  | ResourcesFetchFailedActionType

// Removes all downloaded resources and files
export type ClearResourcesAndCacheActionType = {
  type: 'CLEAR_RESOURCES_AND_CACHE'
}
// Sets the url of the resource server (localhost)
export type SetResourceCacheUrlActionType = {
  type: 'SET_RESOURCE_CACHE_URL'
  readonly params: {
    readonly url: string
  }
}
// Enqueues a new snackbar
export type EnqueueSnackbarActionType = {
  type: 'ENQUEUE_SNACKBAR'
  readonly params: SnackbarType
}
// Dequeue the first snackbar
export type DequeueSnackbarActionType = {
  type: 'DEQUEUE_SNACKBAR'
}
export type StoreActionType =
  | EnqueueSnackbarActionType
  | DequeueSnackbarActionType
  | CitiesActionType
  | CityContentActionType
  | SetContentLanguageActionType
  | ClearResourcesAndCacheActionType
  | SetResourceCacheUrlActionType
