// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'

import { languageReducer, uiDirectionReducer } from 'modules/i18n/reducers'
import toggleDarkModeReducer from '../theme/reducers'
import Payload from '../endpoint/Payload'
import {
  checkInternetConnection,
  createNetworkMiddleware, networkEventsListenerSaga,
  offlineActionTypes,
  reducer as reactNativeOfflineReducer
} from 'react-native-offline'
import createSagaMiddleware from 'redux-saga'
import type { Saga } from 'redux-saga'
import { all, fork} from 'redux-saga/effects'
import citiesEndpoint from '../endpoint/endpoints/cities'
import CityModel from '../endpoint/models/CityModel'
import categoriesEndpoint from '../endpoint/endpoints/categories'
import CategoriesMapModel from '../endpoint/models/CategoriesMapModel'

type StateType = {
  cities: Payload<Array<CityModel>>
}

export type GenericActionType<T> = { type: string, payload: Payload<T> }

type CitiesActionType = GenericActionType<Array<CityModel>>

type ActionType = CitiesActionType

const citiesReducer = (state = new Payload(false), action): Payload<Array<CityModel>> => {
  switch (action.type) {
    case 'CITIES_FETCH_SUCCEEDED':
      return action.payload
    default:
      return state
  }
}

const categoriesReducer = (state = new Payload(false), action): Payload<CategoriesMapModel> => {
  switch (action.type) {
    case 'CATEGORIES_FETCH_SUCCEEDED':
      return action.payload
    default:
      return state
  }
}

function * rootSaga (): Saga<void> {
  yield all([
    fork(citiesEndpoint.fetchSaga.bind(citiesEndpoint)),
    fork(categoriesEndpoint.fetchSaga.bind(categoriesEndpoint)),
    fork(networkEventsListenerSaga, {})
  ])
}

// todo: Change type to correct State type,
// https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
const createReduxStore = (callback: () => void, initialState: StateType = {cities: new Payload(false), categories: new Payload(false)}): Store<StateType, ActionType> => {
  const sagaMiddleware = createSagaMiddleware()

  const rootReducer = combineReducers({
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    darkMode: toggleDarkModeReducer,
    network: reactNativeOfflineReducer,
    cities: citiesReducer,
    categories: categoriesReducer
  })

  const middleware = applyMiddleware(createNetworkMiddleware(), sagaMiddleware, createLogger())
  const store = createStore(rootReducer, initialState, middleware)
  sagaMiddleware.run(rootSaga)
  checkInternetConnection().then(isConnected => {
    store.dispatch({
      type: offlineActionTypes.CONNECTION_CHANGE,
      payload: isConnected
    })

    callback()
  })

  return store
}

export default createReduxStore
