// @flow

import Payload from '../endpoint/Payload'
import { offlineActionTypes } from 'react-native-offline'

type ActionType<T> = { type: T }

type PayloadActionType<T, P> = ActionType<T> & { payload: Payload<P> }

export type FetchCitiesRequestActionType = ActionType<'FETCH_CITIES_REQUEST'> & { params: { language: string } }
export type CitiesFetchSucceededActionType = PayloadActionType<'CITIES_FETCH_SUCCEEDED', any>
export type CitiesActionType = FetchCitiesRequestActionType | CitiesFetchSucceededActionType

export type FetchCategoriesRequestActionType = ActionType<'FETCH_CATEGORIES_REQUEST'> & { params: { language: string, city: string } }
export type CategoriesFetchSucceededActionType = PayloadActionType<'CATEGORIES_FETCH_SUCCEEDED', any>
export type CategoriesActionType = FetchCategoriesRequestActionType | CategoriesFetchSucceededActionType

export type ConnectionChangeActionType = ActionType<offlineActionTypes.CONNECTION_CHANGE> & { payload: boolean }

export type StoreActionType = ConnectionChangeActionType | CitiesActionType | CategoriesActionType
