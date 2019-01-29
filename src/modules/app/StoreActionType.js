// @flow

import { offlineActionTypes } from 'react-native-offline'
import { CategoriesMapModel, CategoryModel, CityModel } from '@integreat-app/integreat-api-client'

type MetaType = {| retry?: boolean, dismiss?: string[] |}

export type FetchCitiesRequestActionType = {| type: 'FETCH_CITIES_REQUEST', params: {| language: string |}, meta: MetaType |}
export type CitiesFetchSucceededActionType = {| type: 'CITIES_FETCH_SUCCEEDED', payload: {| cities: Array<CityModel> |} |}
export type CitiesFetchFailedActionType = {| type: 'CITIES_FETCH_FAILED', message: string |}
export type CitiesFetchActionType =
  FetchCitiesRequestActionType
  | CitiesFetchSucceededActionType
  | CitiesFetchFailedActionType

export type FetchCategoriesRequestActionType = {|
  type: 'FETCH_CATEGORIES_REQUEST',
  params: {| language: string, city: string, path: string, depth: number, key: string |},
  meta: MetaType
|}
export type CategoriesFetchSucceededActionType = {| type: 'CATEGORIES_FETCH_SUCCEEDED', payload: {| categoriesMap: CategoriesMapModel, path: string, depth: number, key: string |}, city: string, language: string |}
export type CategoriesFetchFailedActionType = {| type: 'CATEGORIES_FETCH_FAILED', city: string, language: string, message: string |}
export type CategoriesFetchActionType =
  FetchCategoriesRequestActionType
  | CategoriesFetchSucceededActionType
  | CategoriesFetchFailedActionType

export type NavigateToCategoryActionType = {| type: 'NAVIGATE_TO_CATEGORY', params: {| city: string, language: string, path: string |}, meta: MetaType |}
// export type NAVIGATE_TO_PREVIOUS_CATEGORY = {| type: 'NAVIGATE_TO_CATEGORY', params: {| city: string, language: string |}, meta: MetaType |}
// export type SWITCH_LANGUAGE = {| type: 'SWITCH_LANGUAGE', params: {| city: string, previousLanguage: string, previousPath: string, newLanguage: string|}, meta: MetaType |}

export type ConnectionChangeActionType = {| type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean |}

export type ResourcesDownloadSucceededActionType = {| type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city: string, language: string |}
export type ResourcesDownloadFailedActionType = {| type: 'RESOURCES_DOWNLOAD_FAILED', city: string, language: string, message: string |}
export type ResourcesDownloadActionType =
  | ResourcesDownloadSucceededActionType
  | ResourcesDownloadFailedActionType

export type SetLanguageActionType = { type: 'SET_LANGUAGE', payload: string }

export type SetCurrentCityActionType = { type: 'SET_CURRENT_CITY', payload: string }

export type SetUiDirectionActionType = { type: 'SET_UI_DIRECTION', payload: 'ltr' | 'rtl' }

export type ToggleDarkModeActionType = { type: 'TOGGLE_DARK_MODE' }

export type StoreActionType =
  ConnectionChangeActionType
  | CitiesFetchActionType
  | CategoriesFetchActionType
  | ResourcesDownloadActionType
  | SetLanguageActionType
  | SetCurrentCityActionType
  | SetUiDirectionActionType
  | ToggleDarkModeActionType
  | NavigateToCategoryActionType
