import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'
import { routerForBrowser } from 'redux-little-router'

import ENDPOINTS from './endpoints'
import Payload from './endpoints/Payload'
import routes from './routes'

/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
let reducers = ENDPOINTS.reduce((result, endpoint) => {
  let defaultState = new Payload(false)
  let reducer = (state, action) => action.payload

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.startFetchAction, reducer, defaultState),
    handleAction(endpoint.finishFetchAction, reducer, defaultState)
  )

  return result
}, {})

// Additional reducers
const {
  enhancer,
  reducer,
  middleware
} = routerForBrowser({routes})

/**
 * The middlewares of this app, add additional middlewares here
 * @type {[*]}
 */
let middlewares = [
  middleware,
  thunkMiddleware // Allows to return functions in actions
]

// eslint-disable-next-line no-undef
if (__DEV__) {
  middlewares.push(createLogger()) // Logs all state changes in console
}

/**
 * Configures the main store which holds the global state of the app
 *
 * @param preloadedState
 * @returns {*} A configured store
 */
let configureStore = function configureStore (preloadedState) {
  return createStore(
    combineReducers({...reducers, router: reducer}),
    preloadedState,
    compose(enhancer, applyMiddleware(...middlewares))
  )
}

/**
 * The main store of this app
 */
export default configureStore()
