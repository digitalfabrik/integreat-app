// @flow

import type { Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import { AsyncStorage } from 'react-native'

import uiDirectionReducer from 'modules/i18n/reducers/uiDirectionReducer'
import toggleDarkModeReducer from '../theme/reducers'
import {
  checkInternetConnection,
  createNetworkMiddleware,
  networkSaga,
  offlineActionTypes,
  reducer as reactNativeOfflineReducer
} from 'react-native-offline'
import type { Saga } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import { persistCombineReducers, persistStore } from 'redux-persist'
import type { PersistConfig, Persistor } from 'redux-persist/src/types'
import type { StateType } from './StateType'
import { defaultCitiesState, defaultCityContentState } from './StateType'
import type { StoreActionType } from './StoreActionType'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { composeWithDevTools } from 'redux-devtools-extension'
import MemoryDatabase from '../endpoint/MemoryDatabase'
import citiesReducer from '../endpoint/reducers/citiesReducer'
import watchFetchCategory from '../endpoint/sagas/watchFetchCategory'
import watchFetchCities from '../endpoint/sagas/watchFetchCities'
import cityContentReducer from '../endpoint/reducers/cityContentReducer'
import watchFetchEvent from '../endpoint/sagas/watchFetchEvent'
import watchContentLanguageSwitch from '../endpoint/sagas/watchContentLanguageSwitch'

function * rootSaga (database: MemoryDatabase): Saga<void> {
  yield all([
    call(watchFetchCategory, database),
    call(watchFetchEvent, database),
    call(watchFetchCities, database),
    call(watchContentLanguageSwitch, database),
    call(networkSaga, {})
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
    cityContent: defaultCityContentState,

    network: {isConnected: false, actionQueue: []}
  }

  // Do never blacklist the "network" key.
  const persistConfig: PersistConfig = {
    version: 1,
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet,
    blacklist: ['cities', 'cityContent']
  }

  // Create this reducer only once. It is not pure!
  const persistedReducer = persistCombineReducers(persistConfig, {
    uiDirection: uiDirectionReducer,
    darkMode: toggleDarkModeReducer,

    cities: citiesReducer,
    cityContent: cityContentReducer,

    network: reactNativeOfflineReducer
  })

  const rootReducer = (state, action) => {
    if (!state) {
      return initialState
    }
    return persistedReducer(state, action)
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
