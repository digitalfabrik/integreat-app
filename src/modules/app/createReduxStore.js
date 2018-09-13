// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'

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
import { AsyncStorage } from 'react-native'
import { persistCombineReducers, persistStore } from 'redux-persist'
import type { PersistConfig } from 'redux-persist/src/types'
import type { StateType } from './StateType'
import type { StoreActionType } from './StoreActionType'
import fetchCities from '../endpoint/sagas/fetchCities'
import fetchCategories from '../endpoint/sagas/fetchCategories'

const citiesReducer = (state = null, action): any => {
  switch (action.type) {
    case 'CITIES_FETCH_SUCCEEDED':
      return action.payload.data
    default:
      return state
  }
}

const categoriesReducer = (state = null, action): any => {
  switch (action.type) {
    case 'CATEGORIES_FETCH_SUCCEEDED':
      return action.payload.data
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

const createReduxStore = (callback: () => void): Store<StateType, StoreActionType> => {
  const sagaMiddleware = createSagaMiddleware()
  const persistConfig: PersistConfig = {
    key: 'data',
    storage: AsyncStorage,
    version: 0,
    whitelist: ['data']
  }

  const initialState: StateType = {
    uiDirection: 'ltr',
    language: undefined,
    darkMode: false,
    network: {isConnected: false, actionQueue: []},
    data: {
      cities: undefined,
      categories: undefined
    },
    _persist: {
      version: 0,
      rehydrated: false
    }
  }

  const rootReducer = (state, action) => {
    if (!state) {
      return initialState
    }

    return persistCombineReducers(persistConfig, {
      uiDirection: uiDirectionReducer,
      language: languageReducer,
      darkMode: toggleDarkModeReducer,
      network: reactNativeOfflineReducer,
      data: combineReducers({
        cities: citiesReducer,
        categories: categoriesReducer
      })
    })(state, action)
  }

  const middleware = applyMiddleware(createNetworkMiddleware(), sagaMiddleware, createLogger())

  const store = createStore(rootReducer, initialState, middleware)

  persistStore(
    store,
    null,
    () => {
      checkInternetConnection().then(isConnected => {
        store.dispatch({
          type: offlineActionTypes.CONNECTION_CHANGE,
          payload: isConnected
        })
        sagaMiddleware.run(rootSaga)
        callback()
      })
    }
  )

  return store
}

export default createReduxStore
