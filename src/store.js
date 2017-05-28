import { applyMiddleware, compose, createStore } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

/**
 * The middlewares of this app, add additional middlewares here
 * @type {[*]}
 */
let middlewares = [
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
    rootReducer,
    preloadedState,
    compose(applyMiddleware(...middlewares))
  )
}

/**
 * The main store of this app
 */
export default configureStore()
