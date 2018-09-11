// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'

import { languageReducer, uiDirectionReducer } from 'modules/i18n/reducers'
import toggleDarkModeReducer from '../theme/reducers'
import Payload from '../endpoint/Payload'
import {
  checkInternetConnection,
  createNetworkMiddleware,
  offlineActionTypes,
  reducer as reactNativeOfflineReducer
} from 'react-native-offline'
import createSagaMiddleware from 'redux-saga'
import citiesEndpoint from '../endpoint/endpoints/cities'

type StateType = {
  cities: Payload<any>
}

const citiesReducer = (state = new Payload(false), action) => {
  switch (action.type) {
    case 'cities_FETCH_SUCCEEDED':
      return action.payload
    default:
      return state
  }
}

// todo: Change type to correct State type,
// https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
const createReduxStore = (callback: () => void, initialState: StateType = {cities: new Payload(false)}): Store<any, any> => {
  const sagaMiddleware = createSagaMiddleware()

  const rootReducer = combineReducers({
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    darkMode: toggleDarkModeReducer,
    cities: citiesReducer,
    network: reactNativeOfflineReducer
  })

  const store = createStore(rootReducer, initialState, applyMiddleware(createNetworkMiddleware(), sagaMiddleware, createLogger()))
  sagaMiddleware.run(citiesEndpoint.saga.bind(citiesEndpoint))

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
