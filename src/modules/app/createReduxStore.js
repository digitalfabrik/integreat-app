// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'

import { languageReducer, uiDirectionReducer } from '../i18n/reducers'
import toggleDarkModeReducer from '../theme/reducers'
import Payload from '../endpoint/Payload'

export type ActionType<T> = { type: string, payload: Payload<T> }

// todo: Change type to correct State type,
// https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
const createReduxStore = (initialState: {} = {}): Store<any, any> => {
  /**
   * The middlewares of this app, add additional middlewares here
   */
  const middlewares = []

  if (__DEV__) {
    middlewares.push(createLogger()) // Logs all state changes in console
  }

  const rootReducer = combineReducers({
    uiDirection: uiDirectionReducer,
    language: languageReducer,
    darkMode: toggleDarkModeReducer
  })

  const enhancers = compose(applyMiddleware(...middlewares))

  return createStore(rootReducer, initialState, enhancers)
}

export default createReduxStore
