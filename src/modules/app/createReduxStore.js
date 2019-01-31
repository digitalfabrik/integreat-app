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
import fetchCities from '../endpoint/sagas/fetchCities'
import fetchCategories from '../endpoint/sagas/fetchCategories'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import currentCityReducer from '../categories/reducers/currentCityReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import MemoryDatabase from '../endpoint/MemoryDatabase'
import citiesReducer from '../endpoint/reducers/cititesReducer'
import categoriesReducer from '../endpoint/reducers/categoriesReducer'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import {
  defaultCategoriesSelectionState,
  defaultCategoriesState,
  defaultCitiesSelectionState,
  defaultCitiesState
} from './StateType'
import selectCitiesReducer from '../endpoint/reducers/selectCitiesReducer'
import selectCategoriesReducer from '../endpoint/reducers/selectCategoriesReducer'

function * rootSaga (database: MemoryDatabase): Saga<void> {
  yield all([
    fork(fetchCities, database),
    fork(fetchCategories, database),
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

    cities: defaultCitiesState,
    categories: defaultCategoriesState,

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

    cities: citiesReducer,
    categories: categoriesReducer,

    citiesSelection: selectCitiesReducer(database),
    categoriesSelection: selectCategoriesReducer(database),

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
