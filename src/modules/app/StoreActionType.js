// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CityModel, CategoriesMapModel } from '@integreat-app/integreat-api-client'

// type MetaType = {| retry?: boolean, dismiss?: string[] |}

export type SelectCitiesActionType = {|
  type: 'SELECT_CITIES', params: {||}
|}
export type InsertCitiesActionType = {|
  type: 'INSERT_CITIES', params: {| cities: Array<CityModel> |}
|}
export type SelectCitiesFailedActionType = {|
  type: 'SELECT_CITIES_FAILED', message: string
|}
export type CitiesActionType = InsertCitiesActionType | SelectCitiesActionType | SelectCitiesFailedActionType

export type ClearCategoryActionType = {|
  type: 'CLEAR_CATEGORY', params: {| key: string |}
|}
export type SelectCategoryActionType = {|
  type: 'SELECT_CATEGORY', params: {|
    city: string, language: string, path: string, depth: number, key: string
  |}
|}
export type SelectCategoryFailedActionType = {|
  type: 'SELECT_CATEGORY_FAILED', message: string
|}
export type InsertCategoryActionType = {|
  type: 'INSERT_CATEGORY', params: {|
    categoriesMap: CategoriesMapModel,
    selectAction: SelectCategoryActionType
  |}
|}
export type CategoriesActionType =
  ClearCategoryActionType
  | SelectCategoryActionType
  | InsertCategoryActionType
  | SelectCategoryFailedActionType

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
