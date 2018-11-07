// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import type { RoutesMap } from 'redux-first-router'
import { connectRoutes } from 'redux-first-router'
import { createLogger } from 'redux-logger'

import uiDirectionReducer from '../i18n/reducers'
import endpointReducers from './reducers'
import toggleDarkModeReducer from '../theme/reducers'
import { createResponsiveStateReducer, responsiveStoreEnhancer } from 'redux-responsive'
import defaultRoutesMap from './routesMap'
import onBeforeChange from './onBeforeChange'
import queryString from 'query-string'
import Payload from '../endpoint/Payload'

export type ActionType<T> = { type: string, payload: Payload<T> }

// todo: Change type to correct State type,
// https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
const createReduxStore = (createHistory: () => History, initialState: {} = {}, routesMap: RoutesMap = defaultRoutesMap): Store<any, any> => {
  const history = createHistory()

  const {reducer, middleware, enhancer} = connectRoutes(history, routesMap,
    {onBeforeChange: onBeforeChange, querySerializer: queryString}
  )

  /**
   * The middlewares of this app, add additional middlewares here
   */
  const middlewares = [
    middleware,
    thunkMiddleware // Allows to return functions in actions
  ]

  if (__DEV__) {
    middlewares.push(createLogger()) // Logs all state changes in console
  }
  const rootReducer = combineReducers({
    ...endpointReducers,
    viewport: createResponsiveStateReducer({small: 750}, {infinity: 'large'}),
    location: reducer,
    uiDirection: uiDirectionReducer,
    darkMode: toggleDarkModeReducer
  })

  const enhancers = compose(responsiveStoreEnhancer, enhancer, applyMiddleware(...middlewares))

  return createStore(rootReducer, initialState, enhancers)
}

export default createReduxStore
