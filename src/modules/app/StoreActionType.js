// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { LanguageResourceCacheStateType } from './StateType'
import type { UiDirectionType } from '../i18n/actions/setUIDirection'

// This may be used to react-offline
// type MetaType = {| retry?: boolean, dismiss?: string[] |}

export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES'
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

export type InitializeCityContentActionType = {|
  type: 'INITIALIZE_CITY_CONTENT',
  params: {|
    city: string,
    language: string,
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
    forceUpdate: boolean, shouldRefreshResources: boolean
  |}
|}
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED',
  params: {|
    message: string
  |}
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
    forceUpdate: boolean, shouldRefreshResources: boolean
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
  type: 'FETCH_EVENT_FAILED',
  params: {|
    message: string
  |}
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

export type ClearCityActionType = {|
  type: 'CLEAR_CITY'
|}

export type ResourcesFetchFailedActionType = {|
  type: 'RESOURCES_FETCH_FAILED',
  params: {|
    message: string
  |}
|}

export type CityContentActionType =
  CategoriesActionType
  | EventsActionType
  | MorphContentLanguageActionType
  | SwitchContentLanguageActionType
  | ClearCityContentActionType
  | InitializeCityContentActionType
  | ResourcesFetchFailedActionType

export type SetUiDirectionActionType = {|
  type: 'SET_UI_DIRECTION', params: {|
    direction: UiDirectionType
  |}
|}

export type ToggleDarkModeActionType = {|
  type: 'TOGGLE_DARK_MODE'
|}

export type ConnectionChangeActionType = {|
  type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean
|}

export type StoreActionType =
  ConnectionChangeActionType
  | SetUiDirectionActionType
  | ToggleDarkModeActionType
  | CitiesActionType
  | CityContentActionType
  | SetContentLanguageActionType
  | ClearCityActionType
