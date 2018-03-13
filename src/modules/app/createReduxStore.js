import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { connectRoutes } from 'redux-first-router'
import { createLogger } from 'redux-logger'

import RouteConfig from 'modules/app/RouteConfig'
import setLanguageChangeUrlsReducer from '../language/reducers/setLanguageChangeUrls'
import { createResponsiveStateReducer, responsiveStoreEnhancer } from 'redux-responsive'

const createReduxStore = (createHistory, initialState = {}, routesMap = new RouteConfig()) => {
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

  const reducers = combineReducers({
    viewport: createResponsiveStateReducer({small: 750}, {infinity: 'large'}),
    router: reducer,
    languageChangeUrls: setLanguageChangeUrlsReducer
  })

  const enhancers = compose(responsiveStoreEnhancer, enhancer, applyMiddleware(...middlewares))

  return createStore(reducers, initialState, enhancers)
}

export default createReduxStore
