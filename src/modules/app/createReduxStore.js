// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
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
import type { CategoriesActionType, CitiesActionType, StoreActionType } from './StoreActionType'
import fetchCities from '../endpoint/sagas/fetchCities'
import fetchCategories from '../endpoint/sagas/fetchCategories'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

const citiesReducer = (state = {json: undefined}, action: CitiesActionType): any => {
  switch (action.type) {
    case 'CITIES_FETCH_SUCCEEDED':
      return {...state, json: action.payload.data}
    default:
      return state
  }
}

const categoriesReducer = (state = {json: undefined, city: undefined}, action: CategoriesActionType): any => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return {...state, city: action.params.city}
    case 'CATEGORIES_FETCH_SUCCEEDED':
      return {...state, json: action.payload.data}
    default:
      return state
  }
}

function * rootSaga (): Saga<void> {
  yield all([
    fork(fetchCities),
    fork(fetchCategories),
    fork(networkEventsListenerSaga, {})
  ])
}

const createReduxStore = (callback: () => void, persist = false): { store: Store<StateType, StoreActionType>, persistor: Persistor } => {
  const sagaMiddleware = createSagaMiddleware()
  const persistConfig: PersistConfig = {
    version: 0,
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet
  }

  const initialState: StateType = {
    uiDirection: 'ltr',
    language: undefined,
    darkMode: false,
    network: {isConnected: false, actionQueue: []},
    data: {
      cities: {json: undefined},
      categories: {json: undefined, city: undefined}
    }
  }

  const persitedReducer = persistCombineReducers(persistConfig, {
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    darkMode: toggleDarkModeReducer,
    network: reactNativeOfflineReducer,
    data: combineReducers({
      cities: citiesReducer,
      categories: categoriesReducer
    })
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
      const isConnected = await checkInternetConnection()
      store.dispatch({
        type: offlineActionTypes.CONNECTION_CHANGE,
        payload: isConnected
      })
      sagaMiddleware.run(rootSaga)
      callback()
    }
  )

  if (!persist) {
    persistor.purge().then(() => console.log('Persisted store has been purged!'))
  }

  return {store, persistor}
}

export default createReduxStore
