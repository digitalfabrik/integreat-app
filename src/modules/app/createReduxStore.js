import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { initializeCurrentLocation, routerForBrowser } from 'redux-little-router'
import { createLogger } from 'redux-logger'

import routes from 'routes'
import endpointReducers from 'modules/endpoint/reducers'
import setLanguageChangeUrlsReducer from '../language/reducers/setLanguageChangeUrls'
import setSprungbrettUrl from '../sprungbrett/reducers/setSprungbrettUrl'

const createReduxStore = (createHistory, initialState) => {
  const history = createHistory()
  const basename = ''

  // Additional reducers
  const {enhancer: routerEnhancer, reducer: routerReducer, middleware: routerMiddleware} = routerForBrowser({
    routes,
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
    ...endpointReducers,
    router: routerReducer,
    languageChangeUrls: setLanguageChangeUrlsReducer,
    sprungbrettUrl: setSprungbrettUrl
  })

  const enhancer = compose(routerEnhancer, applyMiddleware(...middlewares))

  const store = createStore(reducer, initialState, enhancer)

  const initialLocation = store.router
  if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
  }

  return store
}

export default createReduxStore
