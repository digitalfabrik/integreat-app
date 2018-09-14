// @flow

import { offlineActionTypes } from 'react-native-offline'

export type FetchCitiesRequestActionType = { type: 'FETCH_CITIES_REQUEST', params: { language: string } }
export type CitiesFetchSucceededActionType = { type: 'CITIES_FETCH_SUCCEEDED', payload: any }
export type CitiesFetchFailedActionType = { type: 'CITIES_FETCH_FAILED', message: string }
export type CitiesActionType =
  FetchCitiesRequestActionType
  | CitiesFetchSucceededActionType
  | CitiesFetchFailedActionType

export type FetchCategoriesRequestActionType = { type: 'FETCH_CATEGORIES_REQUEST', params: { language: string, city: string } }
export type CategoriesFetchSucceededActionType = { type: 'CATEGORIES_FETCH_SUCCEEDED', payload: any }
export type CategoriesFetchFailedActionType = { type: 'CATEGORIES_FETCH_FAILED', message: string }
export type CategoriesActionType =
  FetchCategoriesRequestActionType
  | CategoriesFetchSucceededActionType
  | CategoriesFetchFailedActionType

export type ConnectionChangeActionType = { type: offlineActionTypes.CONNECTION_CHANGE, payload: boolean }

export type StoreActionType = ConnectionChangeActionType | CitiesActionType | CategoriesActionType
