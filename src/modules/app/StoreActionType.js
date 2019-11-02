// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { CategoryRouteConfigType, LanguageResourceCacheStateType } from './StateType'
import type { ContentLoadCriterionType } from '../endpoint/ContentLoadCriterion'
import type { TFunction } from 'i18next'

export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES',
  +params: {| +forceRefresh: boolean |}
|}
export type PushCitiesActionType = {|
  type: 'PUSH_CITIES', +params: {| +cities: $ReadOnlyArray<CityModel> |}
|}
export type FetchCitiesFailedActionType = {|
  type: 'FETCH_CITIES_FAILED', +params: {|
    +message: string
  |}
|}
export type CitiesActionType = PushCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType

export type PushLanguagesActionType = {|
  type: 'PUSH_LANGUAGES',
  +params: {|
    +languages: $ReadOnlyArray<LanguageModel>
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
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED',
  +params: {|
    +key: string,
    ...CategoryRouteConfigType,
    +message: string,
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
    +newLanguage: string
  |}
|}

export type ClearCityActionType = {|
  type: 'CLEAR_CITY'
|}

export type ResourcesFetchFailedActionType = {|
  type: 'FETCH_RESOURCES_FAILED',
  +params: {|
    +message: string
  |}
|}

export type CityContentActionType =
  CategoriesActionType
  | EventsActionType
  | MorphContentLanguageActionType
  | ContentLanguageActionType
  | ClearCityActionType
  | PushLanguagesActionType
  | ResourcesFetchFailedActionType

export type ToggleDarkModeActionType = {|
  type: 'TOGGLE_DARK_MODE'
|}

export type StoreActionType =
  ToggleDarkModeActionType
  | CitiesActionType
  | CityContentActionType
  | SetContentLanguageActionType
