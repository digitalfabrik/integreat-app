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
import categoriesReducer from '../endpoint/reducers/categoriesReducer'
import fileCacheReducer from '../endpoint/reducers/fileCacheReducer'
import citiesReducer from '../endpoint/reducers/cititesReducer'
import languagesReducer from '../endpoint/reducers/languagesReducer'
import currentCityReducer from '../../routes/categories/reducers/currentCityReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

function * rootSaga (): Saga<void> {
  yield all([
    fork(fetchCities),
    fork(fetchCategories),
    fork(networkEventsListenerSaga, {})
  ])
}

const createReduxStore = (callback: () => void, persist: boolean = false): { store: Store<StateType, StoreActionType>, persistor: Persistor } => {
  if (!persist) {
    AsyncStorage.clear()
  }

  const sagaMiddleware = createSagaMiddleware()

  const initialState: StateType = {
    uiDirection: 'ltr',
    language: 'en',
    currentCity: null,
    darkMode: false,

    cities: {json: null, error: null},
    categories: {},
    languages: {},
    fileCache: {},

    network: {isConnected: false, actionQueue: []}
  }

  const persistConfig: PersistConfig = {
    version: 1,
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet,
    whitelist: persist ? ['cities', 'categories', 'network'] : []
  }

  // Create this reducer only once. It is not pure!
  const persitedReducer = persistCombineReducers(persistConfig, {
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    currentCity: currentCityReducer,
    darkMode: toggleDarkModeReducer,

    cities: citiesReducer,
    categories: categoriesReducer,
    languages: languagesReducer,
    fileCache: fileCacheReducer,

    network: reactNativeOfflineReducer
  })

  const rootReducer = (state, action) => {
    if (!state) {
      return initialState
    }
    return persitedReducer(state, action)
  }

  // TODO: Disable logger and dev tools in production

  const middleware = applyMiddleware(createNetworkMiddleware(), sagaMiddleware, createLogger())

  const store = createStore(rootReducer, initialState, composeWithDevTools(middleware))

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
