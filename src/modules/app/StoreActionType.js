// @flow

import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { LanguageResourceCacheStateType } from './StateType'
import type { ContentLoadCriterionType } from '../endpoint/ContentLoadCriterion'

export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES', params: {| forceRefresh: boolean |}
|}
export type PushCitiesActionType = {|
  type: 'PUSH_CITIES', params: {| cities: Array<CityModel> |}
|}
export type FetchCitiesFailedActionType = {|
  type: 'FETCH_CITIES_FAILED', params: {|
    message: string
  |}
|}
export type CitiesActionType = PushCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType

export type PushLanguagesActionType = {|
  type: 'PUSH_LANGUAGES',
  params: {|
    languages: Array<LanguageModel>
  |}
|}

export type SetContentLanguageActionType = {|
  type: 'SET_CONTENT_LANGUAGE', params: {| contentLanguage: string |}
|}

export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY', params: {|
    city: string, language: string,
    path: string, depth: number, key: string,
    criterion: ContentLoadCriterionType
  |}
|}
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED',
  params: {|
    key: string, city: string, language: string,
    path: string, depth: number,
    message: string
  |}
|}
export type PushCategoryActionType = {|
  type: 'PUSH_CATEGORY', params: {|
    categoriesMap: CategoriesMapModel,
    resourceCache: LanguageResourceCacheStateType,
    cityLanguages: Array<LanguageModel>,
    city: string,
    language: string,
    path: string, depth: number, key: string
  |}
|}
export type PushCategoryLanguagesActionType = {|
  type: 'PUSH_CATEGORY_LANGUAGES', params: {|
    key: string,
    allAvailableLanguages: Map<string, string>,
    city: string,
    language: string,
    depth: number
  |}
|}

export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY', params: {| key: string |}
|}

export type CategoriesActionType =
  ClearCategoryActionType
  | FetchCategoryActionType
  | PushCategoryActionType
  | PushCategoryLanguagesActionType
  | FetchCategoryFailedActionType

export type FetchEventActionType = {|
  type: 'FETCH_EVENT', params: {|
    city: string, language: string,
    path: ?string, key: string,
    criterion: ContentLoadCriterionType
  |}
|}
export type ClearEventActionType = {|
  type: 'CLEAR_EVENT', params: {| key: string |}
|}
export type PushEventActionType = {|
  type: 'PUSH_EVENT',
  params: {|
    events: Array<EventModel>,
    path: ?string, key: string,
    resourceCache: LanguageResourceCacheStateType,
    cityLanguages: Array<LanguageModel>,
    language: string,
    city: string
  |}
|}
export type PushEventLanguagesActionType = {|
  type: 'PUSH_EVENT_LANGUAGES',
  params: {|
    key: string,
    allAvailableLanguages: Map<string, ?string>,
    city: string,
    language: string
  |}
|}
export type FetchEventFailedActionType = {|
  type: 'FETCH_EVENT_FAILED',
  params: {|
    message: string,
    key: string, language: string, path: ?string, city: string
  |}
|}

export type EventsActionType =
  ClearEventActionType
  | FetchEventActionType
  | PushEventActionType
  | PushEventLanguagesActionType
  | FetchEventFailedActionType

export type SwitchContentLanguageActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE', params: {|
    newLanguage: string, city: string
  |}
|}

export type SwitchContentLanguageFailedActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE_FAILED', message: string
|}

export type MorphContentLanguageActionType = {|
  type: 'MORPH_CONTENT_LANGUAGE', params: {|
    newCategoriesMap: CategoriesMapModel,
    newResourceCache: LanguageResourceCacheStateType,
    newEvents: Array<EventModel>,
    newLanguage: string
  |}
|}

export type ClearCityActionType = {|
  type: 'CLEAR_CITY'
|}

export type ResourcesFetchFailedActionType = {|
  type: 'FETCH_RESOURCES_FAILED',
  params: {|
    message: string
  |}
|}

export type CityContentActionType =
  CategoriesActionType
  | EventsActionType
  | MorphContentLanguageActionType
  | SwitchContentLanguageActionType
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
