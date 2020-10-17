// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel, TunewsModel, LocalNewsModel, PoiModel } from '@integreat-app/integreat-api-client'
import type { CategoryRouteConfigType, LanguageResourceCacheStateType, NewsType, NewsModelsType } from './StateType'
import type { ContentLoadCriterionType } from '../endpoint/ContentLoadCriterion'
import type { TFunction } from 'react-i18next'
import type { ErrorCodeType } from '../error/ErrorCodes'

export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES',
  +params: {| +forceRefresh: boolean |}
|}
export type PushCitiesActionType = {|
  type: 'PUSH_CITIES', +params: {| +cities: $ReadOnlyArray<CityModel> |}
|}
export type FetchCitiesFailedActionType = {|
  type: 'FETCH_CITIES_FAILED', +params: {|
    +message: string, +code: ErrorCodeType
  |}
|}
export type CitiesActionType = PushCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType

export type PushLanguagesActionType = {|
  type: 'PUSH_LANGUAGES',
  +params: {|
    +languages: $ReadOnlyArray<LanguageModel>
  |}
|}
export type FetchLanguagesFailedActionType = {|
  type: 'FETCH_LANGUAGES_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType
  |}
|}

export type SetContentLanguageActionType = {|
  type: 'SET_CONTENT_LANGUAGE', +params: {| +contentLanguage: string |}
|}

export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY',
  +params: {|
    +key: string,
    ...CategoryRouteConfigType,
    +criterion: ContentLoadCriterionType
  |}
|}

export type FetchNewsActionType = {|
  type: 'FETCH_NEWS',
  +params: {|
    +city: string, +language: string,
    +newsId: ?string, +key: string,
    +criterion: ContentLoadCriterionType,
    +type: NewsType
  |}
|}

export type FetchMoreNewsActionType = {|
  type: 'FETCH_MORE_NEWS',
  +params: {|
    +city: string, +language: string,
    +previouslyFetchedNews: $ReadOnlyArray<LocalNewsModel | TunewsModel>,
    +newsId: ?string, +key: string,
    +criterion: ContentLoadCriterionType,
    +type: NewsType,
    +page: number,
    +hasMoreNews: boolean
  |}
|}

export type ClearNewsActionType = {|
  type: 'CLEAR_NEWS', +params: {| +key: string, +city: string |}
|}

export type PushNewsActionType = {|
  type: 'PUSH_NEWS',
  +params: {|
    +news: NewsModelsType,
    +previouslyFetchedNews?: NewsModelsType, // in case if there is old news then concat old news with new ones
    +newsId: ?string,
    +key: string,
    +cityLanguages: $ReadOnlyArray<LanguageModel>,
    +language: string,
    +city: string,
    +hasMoreNews: boolean, // stop loading more when no items are coming from response
    +type: NewsType,
    +page: number
  |}
|}

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
  FetchNewsActionType
  | FetchMoreNewsActionType
  | FetchNewsFailedActionType
  | ClearNewsActionType
  | PushNewsActionType

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
export type PushCategoryActionType = {|
  type: 'PUSH_CATEGORY',
  +params: {|
    +categoriesMap: CategoriesMapModel,
    +resourceCache: LanguageResourceCacheStateType,
    +cityLanguages: Array<LanguageModel>,
    ...CategoryRouteConfigType,
    +key: string
  |}
|}

export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY', +params: {| +key: string |}
|}

export type CategoriesActionType =
  ClearCategoryActionType
  | FetchCategoryActionType
  | PushCategoryActionType
  | FetchCategoryFailedActionType

export type FetchPoiActionType = {|
  type: 'FETCH_POI', +params: {|
    +city: string, +language: string,
    +path: ?string, +key: string,
    +criterion: ContentLoadCriterionType
  |}
|}

export type ClearPoiActionType = {|
  type: 'CLEAR_POI', +params: {| +key: string |}
|}

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

export type PoisActionType =
  ClearPoiActionType
  | FetchPoiActionType
  | PushPoiActionType
  | FetchPoiFailedActionType

export type FetchEventActionType = {|
  type: 'FETCH_EVENT', +params: {|
    +city: string, +language: string,
    +path: ?string, +key: string,
    +criterion: ContentLoadCriterionType
  |}
|}

export type ClearEventActionType = {|
  type: 'CLEAR_EVENT', +params: {| +key: string |}
|}

export type PushEventActionType = {|
  type: 'PUSH_EVENT',
  +params: {|
    +events: $ReadOnlyArray<EventModel>,
    +path: ?string,
    +key: string,
    +resourceCache: LanguageResourceCacheStateType,
    +cityLanguages: $ReadOnlyArray<LanguageModel>,
    +language: string,
    +city: string
  |}
|}

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

export type EventsActionType =
  ClearEventActionType
  | FetchEventActionType
  | PushEventActionType
  | FetchEventFailedActionType

export type SwitchContentLanguageActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE', +params: {|
    // The TFunction should be removed again in https://issues.integreat-app.de/browse/NATIVE-359
    +newLanguage: string, +city: string, +t: TFunction
  |}
|}

export type SwitchContentLanguageFailedActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE_FAILED', +params: {|
    +message: string
  |}
|}

export type ContentLanguageActionType = SwitchContentLanguageActionType | SwitchContentLanguageFailedActionType

export type MorphContentLanguageActionType = {|
  type: 'MORPH_CONTENT_LANGUAGE', +params: {|
    +newCategoriesMap: CategoriesMapModel,
    +newResourceCache: LanguageResourceCacheStateType,
    +newEvents: $ReadOnlyArray<EventModel>,
    +newPois: $ReadOnlyArray<PoiModel>,
    +newLanguage: string
  |}
|}

export type ClearCityActionType = {|
  type: 'CLEAR_CITY'
|}

export type ResourcesFetchFailedActionType = {|
  type: 'FETCH_RESOURCES_FAILED',
  +params: {|
    +message: string,
    +code: ErrorCodeType
  |}
|}

export type CityContentActionType =
  CategoriesActionType
  | EventsActionType
  | PoisActionType
  | MorphContentLanguageActionType
  | ContentLanguageActionType
  | ClearCityActionType
  | PushLanguagesActionType
  | FetchLanguagesFailedActionType
  | ResourcesFetchFailedActionType
  | NewsActionType

export type ToggleDarkModeActionType = {|
  type: 'TOGGLE_DARK_MODE'
|}

export type ClearResourcesAndCacheActionType = {|
  type: 'CLEAR_RESOURCES_AND_CACHE'
|}

export type SetResourceCacheUrlActionType = {|
  type: 'SET_RESOURCE_CACHE_URL', +params: {| +url: string |}
|}

export type StoreActionType =
  ToggleDarkModeActionType
  | CitiesActionType
  | CityContentActionType
  | SetContentLanguageActionType
  | ClearResourcesAndCacheActionType
  | SetResourceCacheUrlActionType
