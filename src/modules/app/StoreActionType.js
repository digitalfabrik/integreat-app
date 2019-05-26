// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { LanguageResourceCacheStateType } from './StateType'

// This may be used to react-offline
// type MetaType = {| retry?: boolean, dismiss?: string[] |}

export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES', params: {||}
|}
export type PushCitiesActionType = {|
  type: 'PUSH_CITIES', params: {| cities: Array<CityModel> |}
|}
export type FetchCitiesFailedActionType = {|
  type: 'FETCH_CITIES_FAILED', message: string
|}
export type CitiesActionType = PushCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType

export type FetchLanguagesForCategoryActionType = {|
  type: 'FETCH_LANGUAGES_FOR_CATEGORY',
  params: {|
    city: string, language: string,
    path: string, depth: number, key: string,
    forceUpdate: boolean
  |}
|}
export type FetchLanguagesForCategoryFailedActionType = {|
  type: 'FETCH_LANGUAGES_FOR_CATEGORY_FAILED',
  message: string
|}
export type PushLanguagesActionType = {|
  type: 'PUSH_LANGUAGES',
  params: {|
    languages: Array<LanguageModel>,
    city: string,
    language: string
  |}
|}
export type LanguagesForCategoryActionType = FetchLanguagesForCategoryActionType
  | FetchLanguagesForCategoryFailedActionType
  | PushLanguagesActionType

export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY', params: {|
    city: string, language: string,
    languages: Array<LanguageModel>,
    path: string, depth: number, key: string,
    forceUpdate: boolean
  |}
|}
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED', message: string
|}
export type PushCategoryActionType = {|
  type: 'PUSH_CATEGORY', params: {|
    categoriesMap: CategoriesMapModel,
    resourceCache: LanguageResourceCacheStateType,
    languages: Array<LanguageModel>,
    city: string,
    language: string,
    path: string, depth: number, key: string
  |}
|}
export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY', params: {| key: string |}
|}
export type CategoriesActionType =
  ClearCategoryActionType
  | FetchCategoryActionType
  | PushCategoryActionType
  | FetchCategoryFailedActionType

export type FetchEventActionType = {|
  type: 'FETCH_EVENT', params: {|
    city: string, language: string,
    path?: string, key: string,
    forceUpdate: boolean
  |}
|}
export type ClearEventActionType = {|
  type: 'CLEAR_EVENT', params: {| key: string |}
|}
export type PushEventActionType = {|
  type: 'PUSH_EVENT', params: {|
    events: Array<EventModel>,
    path?: string, key: string,
    resourceCache: LanguageResourceCacheStateType,
    languages: Array<LanguageModel>,
    city: string,
    language: string
  |}
|}
export type FetchEventFailedActionType = {|
  type: 'FETCH_EVENT_FAILED', message: string
|}

export type EventsActionType =
  ClearEventActionType
  | FetchEventActionType
  | PushEventActionType
  | FetchEventFailedActionType

export type SwitchContentLanguageActionType = {|
  type: 'SWITCH_CONTENT_LANGUAGE', params: {|
    city: string,
    newLanguage: string
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

export type ClearCityContentActionType = {|
  type: 'CLEAR_CITY_CONTENT'
|}

export type CityContentActionType =
  CategoriesActionType
  | EventsActionType
  | MorphContentLanguageActionType
  | SwitchContentLanguageActionType
  | LanguagesForCategoryActionType
  | ClearCityContentActionType

export type ResourcesFetchSucceededActionType = {|
  type: 'RESOURCES_FETCH_SUCCEEDED', city: string, language: string
|}
export type ResourcesFetchFailedActionType = {|
  type: 'RESOURCES_FETCH_FAILED', city: string, language: string, message: string
|}
export type ResourcesFetchActionType =
  | ResourcesFetchSucceededActionType
  | ResourcesFetchFailedActionType

export type SetUiDirectionActionType = {
  type: 'SET_UI_DIRECTION', payload: 'ltr' | 'rtl'
}

export type ToggleDarkModeActionType = {
  type: 'TOGGLE_DARK_MODE'
}

export type ConnectionChangeActionType = {|
  type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean
|}

export type StoreActionType =
  ConnectionChangeActionType
  | ResourcesFetchActionType
  | SetUiDirectionActionType
  | ToggleDarkModeActionType
  | CitiesActionType
  | CityContentActionType
