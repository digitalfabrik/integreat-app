// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CityModel, CategoriesMapModel, LanguageModel } from '@integreat-app/integreat-api-client'
import type { ResourceCacheType } from '../endpoint/ResourceCacheType'

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

export type PushParamsType = {
  path: string, depth: number, key: string
}
export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY', params: {|
    city: string, language: string, pushParams?: PushParamsType
  |}
|}
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED', message: string
|}
export type PushCategoryActionType = {|
  type: 'PUSH_CATEGORY', params: {
    categoriesMap: CategoriesMapModel, languages: Array<LanguageModel>,
    pushParams: PushParamsType,
    resourceCache: ResourceCacheType,
    city: string,
    language: string
  }
|}
export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY', params: {| key: string |}
|}
export type SwitchCategoryLanguageActionType = {|
  type: 'SWITCH_CATEGORY_LANGUAGE', params: {|
    newCategoriesMap: CategoriesMapModel,
    newLanguage: string
  |}
|}
export type CategoriesActionType =
  ClearCategoryActionType
  | FetchCategoryActionType
  | PushCategoryActionType
  | FetchCategoryFailedActionType
  | SwitchCategoryLanguageActionType

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
