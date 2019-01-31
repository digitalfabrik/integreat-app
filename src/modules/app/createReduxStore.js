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
import type { StoreActionType } from './StoreActionType'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import currentCityReducer from '../categories/reducers/currentCityReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import MemoryDatabase from '../endpoint/MemoryDatabase'
import {
  defaultCategoriesSelectionState,
  defaultCitiesSelectionState
} from './StateType'
import citiesSelectionReducer from '../endpoint/reducers/citiesSelectionReducer'
import categoriesSelectionReducer from '../endpoint/reducers/categoriesSelectionReducer'
import fetchCategory from '../endpoint/sagas/fetchCategory'
import fetchCities from '../endpoint/sagas/fetchCities'

function * rootSaga (database: MemoryDatabase): Saga<void> {
  yield all([
    fork(fetchCategory, database),
    fork(fetchCities, database),
    fork(networkEventsListenerSaga, {})
  ])
}

const createReduxStore = (database: MemoryDatabase, callback: () => void): { store: Store<StateType, StoreActionType>, persistor: Persistor } => {
  const sagaMiddleware = createSagaMiddleware()

  const initialState: StateType = {
    uiDirection: 'ltr',
    language: 'en',
    currentCity: null,
    darkMode: false,

    citiesSelection: defaultCitiesSelectionState,
    categoriesSelection: defaultCategoriesSelectionState,

    network: {isConnected: false, actionQueue: []}
  }

  // Do never exclude the "network" key.
  const persistConfig: PersistConfig = {
    version: 1,
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet,
    blacklist: ['cities', 'categories', 'citiesSelection', 'categoriesSelection']
  }

  // Create this reducer only once. It is not pure!
  const persitedReducer = persistCombineReducers(persistConfig, {
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    currentCity: currentCityReducer,
    darkMode: toggleDarkModeReducer,

    citiesSelection: citiesSelectionReducer,
    categoriesSelection: categoriesSelectionReducer,

    network: reactNativeOfflineReducer
  })

  const rootReducer = (state, action) => {
    if (!state) {
      return initialState
    }
    return persitedReducer(state, action)
  }
  const middlewares = [createNetworkMiddleware(), sagaMiddleware]

  if (__DEV__) {
    middlewares.push(createLogger())
  }

  const middleware = applyMiddleware(...middlewares)

  const enhancer = __DEV__ ? composeWithDevTools(middleware) : middleware

  const store = createStore(rootReducer, initialState, enhancer)

  const persistor = persistStore(
    store,
    undefined,
    async () => {
      const isConnected: boolean = await checkInternetConnection()
      store.dispatch({
        type: offlineActionTypes.CONNECTION_CHANGE,
        payload: isConnected
      })
      sagaMiddleware.run(rootSaga, database)
      callback()
    }
  )

  return {store, persistor}
}

export default createReduxStore
