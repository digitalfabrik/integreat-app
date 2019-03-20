// @flow

import type { Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import { AsyncStorage } from 'react-native'

import uiDirectionReducer from 'modules/i18n/reducers/uiDirectionReducer'
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
import { all, call } from 'redux-saga/effects'
import { persistCombineReducers, persistStore } from 'redux-persist'
import type { PersistConfig, Persistor } from 'redux-persist/src/types'
import type { StateType } from './StateType'
import type { StoreActionType } from './StoreActionType'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { composeWithDevTools } from 'redux-devtools-extension'
import MemoryDatabase from '../endpoint/MemoryDatabase'
import {
  defaultCategoriesState,
  defaultCitiesState
} from './StateType'
import citiesReducer from '../endpoint/reducers/citiesReducer'
import categoriesReducer from '../endpoint/reducers/categoriesReducer'
import watchFetchCategory from '../endpoint/sagas/watchFetchCategory'
import watchFetchCities from '../endpoint/sagas/watchFetchCities'

function * rootSaga (database: MemoryDatabase): Saga<void> {
  yield all([
    call(watchFetchCategory, database),
    call(watchFetchCities, database),
    call(networkEventsListenerSaga, {})
  ])
}

const createReduxStore = (
  database: MemoryDatabase, callback: () => void
): { store: Store<StateType, StoreActionType>, persistor: Persistor } => {
  const sagaMiddleware = createSagaMiddleware()

  const initialState: StateType = {
    uiDirection: 'ltr',
    darkMode: false,

    cities: defaultCitiesState,
    categories: defaultCategoriesState,

    network: {isConnected: false, actionQueue: []}
  }

  // Do never blacklist the "network" key.
  const persistConfig: PersistConfig = {
    version: 1,
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet,
    blacklist: ['cities', 'categories']
  }

  // Create this reducer only once. It is not pure!
  const persitedReducer = persistCombineReducers(persistConfig, {
    uiDirection: uiDirectionReducer,
    darkMode: toggleDarkModeReducer,

    cities: citiesReducer,
    categories: categoriesReducer,

    network: reactNativeOfflineReducer
  })

  const rootReducer = (state, action) => {
    if (!state) {
      return initialState
    }
    return persitedReducer(state, action)
  }
  const middlewares = [createNetworkMiddleware(), sagaMiddleware]

  // If you want to use redux-logger again use this code:
  // import { createLogger } from 'redux-logger'
  // if (__DEV__) {
  //   middlewares.push(createLogger())
  // }

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
