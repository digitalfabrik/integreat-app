// @flow

import { offlineActionTypes } from 'react-native-offline'

export type FetchCitiesRequestActionType = {| type: 'FETCH_CITIES_REQUEST', params: {| language: string |}, meta: {| retry: boolean |} |}
export type CitiesFetchSucceededActionType = {| type: 'CITIES_FETCH_SUCCEEDED', payload: any |}
export type CitiesFetchFailedActionType = {| type: 'CITIES_FETCH_FAILED', message: string |}
export type CitiesFetchActionType =
  FetchCitiesRequestActionType
  | CitiesFetchSucceededActionType
  | CitiesFetchFailedActionType

export type FetchCategoriesRequestActionType = {| type: 'FETCH_CATEGORIES_REQUEST', params: {| prioritisedLanguage: string, city: string |}, meta: {| retry: boolean |} |}
export type CategoriesFetchSucceededActionType = {| type: 'CATEGORIES_FETCH_SUCCEEDED', payload: any, city: string, language: string |}
export type CategoriesFetchFailedActionType = {| type: 'CATEGORIES_FETCH_FAILED', message: string |}
export type CategoriesFetchActionType =
  FetchCategoriesRequestActionType
  | CategoriesFetchSucceededActionType
  | CategoriesFetchFailedActionType

export type ConnectionChangeActionType = {| type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean |}

export type DownloadResourcesRequestActionType = {| type: 'DOWNLOAD_RESOURCES_REQUEST' |}
export type ResourcesDownloadPartiallySucceededActionType = {| type: 'RESOURCES_DOWNLOAD_PARTIALLY_SUCCEEDED', city: string, downloaded: {[url: string]: string} |}
export type ResourcesDownloadSucceededActionType = {| type: 'RESOURCES_DOWNLOAD_SUCCEEDED', city: string|}
export type ResourcesDownloadFailedActionType = {| type: 'RESOURCES_DOWNLOAD_FAILED', message: string |}
export type ResourcesDownloadActionType =
  DownloadResourcesRequestActionType
  | ResourcesDownloadSucceededActionType
  | ResourcesDownloadPartiallySucceededActionType
  | ResourcesDownloadFailedActionType

export type StoreActionType =
  ConnectionChangeActionType
  | CitiesFetchActionType
  | CategoriesFetchActionType
  | ResourcesDownloadActionType
