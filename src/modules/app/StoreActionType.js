// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CategoriesMapModel, CityModel, EventModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

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

export type CategoryPushParamsType = {|
  path: string, depth: number, key: string
|}
export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY', params: {|
    city: string, language: string, pushParams?: CategoryPushParamsType
  |}
|}
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED', message: string
|}
export type PushCategoryActionType = {|
  type: 'PUSH_CATEGORY', params: {|
    categoriesMap: CategoriesMapModel,
    pushParams: CategoryPushParamsType,
    resourceCache: ResourceCacheType,
    languages: Array<LanguageModel>,
    city: string,
    language: string
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

export type EventPushParamsType = {|
  path: string, key: string
|}

export type FetchEventActionType = {|
  type: 'FETCH_EVENT', params: {|
    city: string, language: string, pushParams?: EventPushParamsType
  |}
|}
export type ClearEventActionType = {|
  type: 'CLEAR_EVENT', params: {| key: string |}
|}
export type PushEventActionType = {|
  type: 'PUSH_EVENT', params: {|
    events: Array<EventModel>,
    pushParams: EventPushParamsType,
    resourceCache: ResourceCacheType,
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

export type CityContentLoadedActionType = {|
  type: 'CITY_CONTENT_LOADED', params: {|
    categoriesMap: CategoriesMapModel | null,
    events: Array<EventModel> | null,
    language: string
  |}
|}

export type ResourcesDownloadSucceededActionType = {|
  type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city: string, language: string
|}
export type ResourcesDownloadFailedActionType = {|
  type: 'RESOURCES_DOWNLOAD_FAILED', city: string, language: string, message: string
|}
export type ResourcesDownloadActionType =
  | ResourcesDownloadSucceededActionType
  | ResourcesDownloadFailedActionType

export type SetLanguageActionType = {
  type: 'SET_LANGUAGE', payload: string
}

export type SetCurrentCityActionType = {
  type: 'SET_CURRENT_CITY', payload: string
}

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
  | ResourcesDownloadActionType
  | SetLanguageActionType
  | SetCurrentCityActionType
  | SetUiDirectionActionType
  | ToggleDarkModeActionType
  | CategoriesActionType
  | CitiesActionType
  | EventsActionType
