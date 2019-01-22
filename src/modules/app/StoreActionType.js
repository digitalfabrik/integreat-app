// @flow

import { offlineActionTypes } from 'react-native-offline'

type MetaType = {| retry?: boolean, dismiss?: string[] |}

export type FetchCitiesRequestActionType = {| type: 'FETCH_CITIES_REQUEST', params: {| language: string |}, meta: MetaType |}
export type CitiesFetchSucceededActionType = {| type: 'CITIES_FETCH_SUCCEEDED', payload: any |}
export type CitiesFetchFailedActionType = {| type: 'CITIES_FETCH_FAILED', message: string |}
export type CitiesFetchActionType =
  FetchCitiesRequestActionType
  | CitiesFetchSucceededActionType
  | CitiesFetchFailedActionType

export type FetchCategoriesRequestActionType = {| type: 'FETCH_CATEGORIES_REQUEST', params: {| language: string, city: string |}, meta: MetaType |}
export type FetchCategoriesCancelActionType = {| type: 'FETCH_CATEGORIES_CANCEL' |}
export type CategoriesFetchSucceededActionType = {| type: 'CATEGORIES_FETCH_SUCCEEDED', city: string |}
export type CategoriesFetchFailedActionType = {| type: 'CATEGORIES_FETCH_FAILED', city: string, message: string |}
export type CategoriesFetchActionType =
  FetchCategoriesRequestActionType
  | CategoriesFetchSucceededActionType
  | CategoriesFetchFailedActionType
  | FetchCategoriesCancelActionType

export type ConnectionChangeActionType = {| type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean |}

export type ResourcesDownloadSucceededActionType = {| type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city: string, files: { [url: string]: string } |}
export type ResourcesDownloadFailedActionType = {| type: 'RESOURCES_DOWNLOAD_FAILED', city: string, message: string |}
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
