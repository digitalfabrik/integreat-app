import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'
import { routerForBrowser } from 'redux-little-router'
import createBrowserHistory from 'history/createBrowserHistory'

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
    handleAction(endpoint.receiveAction, reducer, defaultState),
    handleAction(endpoint.requestAction, reducer, defaultState),
    handleAction(endpoint.invalidateAction, reducer, defaultState)
  )

  return result
}, {})

/**
 * Holds the current history implementation
 */
export const history = createBrowserHistory()

history.listen((location, action) => {
  // Keep default behavior of restoring scroll position when user:
  // - clicked back button
  // - clicked on a link that programmatically calls `history.goBack()`
  // - manually changed the URL in the address bar (here we might want
  // to scroll to top, but we can't differentiate it from the others)
  if (action === 'POP') {
    return
  }
  // In all other cases, scroll to top
  window.scrollTo(0, 0)
})

// Additional reducers
const {
  enhancer,
  reducer,
  middleware
} = routerForBrowser({routes, basename: '', history})

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
