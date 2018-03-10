import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { initializeCurrentLocation, routerForBrowser } from 'redux-little-router'
import { createLogger } from 'redux-logger'

import RouteConfig from 'modules/app/RouteConfig'
import setLanguageChangeUrlsReducer from '../language/reducers/setLanguageChangeUrls'
import { createResponsiveStateReducer, responsiveStoreEnhancer } from 'redux-responsive'

const createReduxStore = (createHistory, initialState = {}, routes = new RouteConfig()) => {
  const history = createHistory()
  const basename = ''

  // Additional reducers
  const {enhancer: routerEnhancer, reducer: routerReducer, middleware: routerMiddleware} = routerForBrowser({
    routes: routes.toPlainObject(),
    basename,
    history
  })

  /**
   * The middlewares of this app, add additional middlewares here
   */
  const middlewares = [
    routerMiddleware,
    thunkMiddleware // Allows to return functions in actions
  ]

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    middlewares.push(createLogger()) // Logs all state changes in console
  }

  const reducer = combineReducers({
    viewport: createResponsiveStateReducer({small: 750}, {infinity: 'large'}),
    router: routerReducer,
    languageChangeUrls: setLanguageChangeUrlsReducer
  })

  const enhancer = compose(responsiveStoreEnhancer, routerEnhancer, applyMiddleware(...middlewares))

  const store = createStore(reducer, initialState, enhancer)

  const initialLocation = store.router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
  }

  return store
}

export default createReduxStore
