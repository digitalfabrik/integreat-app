import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { connectRoutes } from 'redux-first-router'
import { createLogger } from 'redux-logger'

import setLanguageChangeUrlsReducer from '../language/reducers/setLanguageChangeUrls'
import endpointReducers from '../endpoint/reducers'
import { createResponsiveStateReducer, responsiveStoreEnhancer } from 'redux-responsive'
import defaultRoutesMap from './routesMap'

const createReduxStore = (createHistory, initialState = {}, routesMap = defaultRoutesMap) => {
  const history = createHistory()

  const {reducer, middleware, enhancer} = connectRoutes(history, routesMap)

  /**
   * The middlewares of this app, add additional middlewares here
   */
  const middlewares = [
    middleware,
    thunkMiddleware // Allows to return functions in actions
  ]

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    middlewares.push(createLogger()) // Logs all state changes in console
  }

  const rootReducer = combineReducers({
    ...endpointReducers,
    viewport: createResponsiveStateReducer({small: 750}, {infinity: 'large'}),
    location: reducer,
    languageChangeUrls: setLanguageChangeUrlsReducer
  })

  const enhancers = compose(responsiveStoreEnhancer, enhancer, applyMiddleware(...middlewares))

  return createStore(rootReducer, initialState, enhancers)
}

export default createReduxStore
