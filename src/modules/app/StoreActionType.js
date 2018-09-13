// @flow

import Payload from '../endpoint/Payload'
import { offlineActionTypes } from 'react-native-offline'

type PayloadActionType<T> = { type: string, payload: Payload<T> }

export type CitiesActionType = PayloadActionType<any> & { params: { language: string } }

export type CategoriesActionType = PayloadActionType<any> & { params: { language: string, city: string } }

export type ConnectionChangeActionType = { type: offlineActionTypes.CONNECTION_CHANGE, payload: Payload<boolean> }

export type StoreActionType = ConnectionChangeActionType | CitiesActionType | CategoriesActionType
