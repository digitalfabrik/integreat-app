// @flow

import type { Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { AsyncStorage } from 'react-native'

import { languageReducer, uiDirectionReducer } from 'modules/i18n/reducers'
import toggleDarkModeReducer from '../theme/reducers'
import {
  checkInternetConnection,
  createNetworkMiddleware,
  networkEventsListenerSaga,
  offlineActionTypes,
  reducer as reactNativeOfflineReducer
} from 'react-native-offline'
import type { Saga } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'
import { persistCombineReducers, persistStore } from 'redux-persist'
import type { PersistConfig, Persistor } from 'redux-persist/src/types'
import type { StateType } from './StateType'
import type { CitiesFetchActionType, StoreActionType } from './StoreActionType'
import fetchCities from '../endpoint/sagas/fetchCities'
import fetchCategories from '../endpoint/sagas/fetchCategories'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import categoriesReducer from '../endpoint/reducers/categoriesReducer'
import parseResources from '../endpoint/sagas/parseResources'
import fetchResources from '../endpoint/sagas/fetchResources'

const citiesReducer = (state = {json: undefined}, action: CitiesFetchActionType): any => {
  switch (action.type) {
    case 'CITIES_FETCH_SUCCEEDED':
      return {...state, json: action.payload.data}
    default:
      return state
  }
}

function * rootSaga (): Saga<void> {
  yield all([
    fork(fetchCities),
    fork(fetchCategories),
    fork(parseResources),
    fork(fetchResources),
    fork(networkEventsListenerSaga, {})
  ])
}

const createReduxStore = (callback: () => void, persist: boolean = false): { store: Store<StateType, StoreActionType>, persistor: Persistor } => {
  if (!persist) {
    AsyncStorage.clear()
  }

  const sagaMiddleware = createSagaMiddleware()
  const persistConfig: PersistConfig = {
    version: 0,
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet,
    whitelist: persist ? ['cities', 'categories'] : []
  }

  const initialState: StateType = {
    uiDirection: 'ltr',
    language: 'en',
    darkMode: false,
    network: {isConnected: false, actionQueue: []},
    cities: {json: undefined},
    categories: {jsons: {}, city: undefined}
  }

  // Create this reducer only once. It is not pure!
  const persitedReducer = persistCombineReducers(persistConfig, {
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    darkMode: toggleDarkModeReducer,
    network: reactNativeOfflineReducer,
    cities: citiesReducer,
    categories: categoriesReducer
  })

  const rootReducer = (state, action) => {
    if (!state) {
      return initialState
    }
    return persitedReducer(state, action)
  }

  const middleware = applyMiddleware(createNetworkMiddleware(), sagaMiddleware, createLogger())

  const store = createStore(rootReducer, initialState, middleware)

  const persistor = persistStore(
    store,
    undefined,
    async () => {
      const isConnected: boolean = await checkInternetConnection()
      store.dispatch({
        type: offlineActionTypes.CONNECTION_CHANGE,
        payload: isConnected
      })
      sagaMiddleware.run(rootSaga)
      callback()
    }
  )

  return {store, persistor}
}

export default createReduxStore
