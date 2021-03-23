// @flow

import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  LanguageModel,
  LocalNewsModel,
  PoiModel,
  TunewsModel
} from 'api-client'
import type { CategoryRouteConfigType, LanguageResourceCacheStateType, NewsModelsType } from './StateType'
import type { ContentLoadCriterionType } from '../endpoint/ContentLoadCriterion'
import type { TFunction } from 'react-i18next'
import type { ErrorCodeType } from '../error/ErrorCodes'
import type { NewsType } from 'api-client/src/routes'

// Starts fetching all available cities
export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES',
  +params: {| +forceRefresh: boolean |}
|}

// Pushes fetched cities to the state
export type PushCitiesActionType = {|
  type: 'PUSH_CITIES',
  +params: {| +cities: $ReadOnlyArray<CityModel> |}
|}

// Adds an error occurred during fetching of cities to the state
export type FetchCitiesFailedActionType = {|
  type: 'FETCH_CITIES_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType
  |}
|}

export type CitiesActionType = PushCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType

// Pushes fetched languages to the state
export type PushLanguagesActionType = {|
  type: 'PUSH_LANGUAGES',
  +params: {|
    +languages: $ReadOnlyArray<LanguageModel>
  |}
|}

// Adds an error occurred during fetching of languages to the state
export type FetchLanguagesFailedActionType = {|
  type: 'FETCH_LANGUAGES_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType
  |}
|}

// Sets the currently used content language
export type SetContentLanguageActionType = {|
  type: 'SET_CONTENT_LANGUAGE',
  +params: {| +contentLanguage: string |}
|}

// Adds a new category route to the state and starts fetching relevant data
export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY',
  +params: {|
    +key: string,
    ...CategoryRouteConfigType,
    +criterion: ContentLoadCriterionType
  |}
|}

// Sets an occurred error to the corresponding category route
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED',
  +params: {|
    +key: string,
    ...CategoryRouteConfigType,
    +message: string,
    +code: ErrorCodeType,
    +allAvailableLanguages: $ReadOnlyMap<string, ?string> | null
  |}
|}

// Pushes fetched category to the corresponding route the state
export type PushCategoryActionType = {|
  type: 'PUSH_CATEGORY',
  +params: {|
    +categoriesMap: CategoriesMapModel,
    +resourceCache: LanguageResourceCacheStateType,
    +cityLanguages: Array<LanguageModel>,
    ...CategoryRouteConfigType,
    +key: string,
    +refresh: boolean
  |}
|}

export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY',
  +params: {| +key: string |}
|}

export type CategoriesActionType =
  | ClearCategoryActionType
  | FetchCategoryActionType
  | PushCategoryActionType
  | FetchCategoryFailedActionType

// Adds a new news route to the state and starts fetching relevant data
export type FetchNewsActionType = {|
  type: 'FETCH_NEWS',
  +params: {|
    +city: string,
    +language: string,
    +newsId: ?string,
    +key: string,
    +criterion: ContentLoadCriterionType,
    +type: NewsType
  |}
|}

// Starts fetching the next page of news for a selected city and language
export type FetchMoreNewsActionType = {|
  type: 'FETCH_MORE_NEWS',
  +params: {|
    +city: string,
    +language: string,
    +previouslyFetchedNews: $ReadOnlyArray<LocalNewsModel | TunewsModel>,
    +newsId: ?string,
    +key: string,
    +criterion: ContentLoadCriterionType,
    +type: NewsType,
    +page: number,
    +hasMoreNews: boolean
  |}
|}

// Pushes fetched news to the corresponding route the state
export type PushNewsActionType = {|
  type: 'PUSH_NEWS',
  +params: {|
    +news: NewsModelsType,
    +previouslyFetchedNews?: NewsModelsType, // in case if there is old news then concat old news with new ones
    +newsId: ?string,
    +key: string,
    +availableLanguages: $ReadOnlyArray<LanguageModel>,
    +language: string,
    +city: string,
    +hasMoreNews: boolean, // stop loading more when no items are coming from response
    +type: NewsType,
    +page: number
  |}
|}

// Sets an occurred error to the corresponding news route
export type FetchNewsFailedActionType = {|
  type: 'FETCH_NEWS_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType,
    +key: string,
    +allAvailableLanguages: ?$ReadOnlyMap<string, ?string>,
    +language: string,
    +newsId: ?string,
    +type: NewsType,
    +city: string
  |}
|}

export type NewsActionType =
  | FetchNewsActionType
  | FetchMoreNewsActionType
  | FetchNewsFailedActionType
  | PushNewsActionType

// Adds a new pois route to the state and starts fetching relevant data
export type FetchPoiActionType = {|
  type: 'FETCH_POI',
  +params: {|
    +city: string,
    +language: string,
    +path: ?string,
    +key: string,
    +criterion: ContentLoadCriterionType
  |}
|}

// Pushes fetched pois to the corresponding route the state
export type PushPoiActionType = {|
  type: 'PUSH_POI',
  +params: {|
    +pois: $ReadOnlyArray<PoiModel>,
    +path: ?string,
    +key: string,
    +resourceCache: LanguageResourceCacheStateType,
    +cityLanguages: $ReadOnlyArray<LanguageModel>,
    +language: string,
    +city: string
  |}
|}

// Sets an occurred error to the corresponding pois route
export type FetchPoiFailedActionType = {|
  type: 'FETCH_POI_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType,
    +key: string,
    +allAvailableLanguages: ?$ReadOnlyMap<string, ?string>,
    +language: string,
    +path: ?string,
    +city: string
  |}
|}

export type PoisActionType = FetchPoiActionType | PushPoiActionType | FetchPoiFailedActionType

// Adds a new event route to the state and starts fetching relevant data
export type FetchEventActionType = {|
  type: 'FETCH_EVENT',
  +params: {|
    +city: string,
    +language: string,
    +path: ?string,
    +key: string,
    +criterion: ContentLoadCriterionType
  |}
|}

// Pushes fetched events to the corresponding route the state
export type PushEventActionType = {|
  type: 'PUSH_EVENT',
  +params: {|
    +events: $ReadOnlyArray<EventModel>,
    +path: ?string,
    +key: string,
    +resourceCache: LanguageResourceCacheStateType,
    +cityLanguages: $ReadOnlyArray<LanguageModel>,
    +language: string,
    +city: string,
    +refresh: boolean
  |}
|}

// Sets an occurred error to the corresponding event route
export type FetchEventFailedActionType = {|
  type: 'FETCH_EVENT_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType,
    +key: string,
    +allAvailableLanguages: ?$ReadOnlyMap<string, ?string>,
    +language: string,
    +path: ?string,
    +city: string
  |}
|}

export type EventsActionType = FetchEventActionType | PushEventActionType | FetchEventFailedActionType

// Initiates a content language switch, i.e. switching the content language and morphing all opened routes.
export type SwitchContentLanguageActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE',
  +params: {|
    // TODO IGAPP-498 The alert should be replaced with a snackbar, hence the TFunction should also be removed.
    +newLanguage: string,
    +city: string,
    +t: TFunction
  |}
|}

// Stops the content language switch if an error occurred.
export type SwitchContentLanguageFailedActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE_FAILED',
  +params: {|
    +message: string
  |}
|}

export type ContentLanguageActionType = SwitchContentLanguageActionType | SwitchContentLanguageFailedActionType

// Initiates replacing (morphing) the routes in the old with corresponding ones in the new language.
export type MorphContentLanguageActionType = {|
  type: 'MORPH_CONTENT_LANGUAGE',
  +params: {|
    +newCategoriesMap: CategoriesMapModel,
    +newResourceCache: LanguageResourceCacheStateType,
    +newEvents: $ReadOnlyArray<EventModel>,
    +newPois: $ReadOnlyArray<PoiModel>,
    +newLanguage: string
  |}
|}

// Removes the corresponding route from the state
export type ClearRouteActionType = {|
  type: 'CLEAR_ROUTE',
  +params: {| +key: string |}
|}

// Clears the selected city by removing the corresponding state and setting and unsubscribing from push notifications.
export type ClearCityActionType = {|
  type: 'CLEAR_CITY'
|}

// Updates the progress of the resource fetching, used for showing the loading spinner
export type ResourcesFetchProgressActionType = {|
  type: 'FETCH_RESOURCES_PROGRESS',
  +params: {|
    +progress: number
  |}
|}

// Sets an occurred error to the resource cache
export type ResourcesFetchFailedActionType = {|
  type: 'FETCH_RESOURCES_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType
  |}
|}

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
  | NewsActionType

// Toggles the dark mode flag in the state
export type ToggleDarkModeActionType = {|
  type: 'TOGGLE_DARK_MODE'
|}

// Removes all downloaded resources and files
export type ClearResourcesAndCacheActionType = {|
  type: 'CLEAR_RESOURCES_AND_CACHE'
|}

// Sets the url of the resource server (localhost)
export type SetResourceCacheUrlActionType = {|
  type: 'SET_RESOURCE_CACHE_URL',
  +params: {| +url: string |}
|}

export type StoreActionType =
  | ToggleDarkModeActionType
  | CitiesActionType
  | CityContentActionType
  | SetContentLanguageActionType
  | ClearResourcesAndCacheActionType
  | SetResourceCacheUrlActionType
