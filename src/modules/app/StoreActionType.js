// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CityModel, CategoriesMapModel } from '@integreat-app/integreat-api-client'

// type MetaType = {| retry?: boolean, dismiss?: string[] |}

export type FetchCitiesActionType = {|
  type: 'FETCH_CITIES', params: {||}
|}
export type SelectCitiesActionType = {|
  type: 'SELECT_CITIES', params: {| cities: Array<CityModel> |}
|}
export type FetchCitiesFailedActionType = {|
  type: 'FETCH_CITIES_FAILED', message: string
|}
export type CitiesActionType = SelectCitiesActionType | FetchCitiesActionType | FetchCitiesFailedActionType

export type SelectParamsType = {
  path: string, depth: number, key: string
}
export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY', params: {| key: string |}
|}
export type FetchCategoryActionType = {|
  type: 'FETCH_CATEGORY', params: {|
    city: string, language: string, selectParams: SelectParamsType
  |}
|}
export type FetchCategoryFailedActionType = {|
  type: 'FETCH_CATEGORY_FAILED', message: string
|}
export type SelectCategoryActionType = {|
  type: 'SELECT_CATEGORY', params: {
    categoriesMap: CategoriesMapModel,
    selectParams: SelectParamsType,
    city: string,
    language: string
  }
|}
export type CategoriesActionType =
  ClearCategoryActionType
  | FetchCategoryActionType
  | SelectCategoryActionType
  | FetchCategoryFailedActionType

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
