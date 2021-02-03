// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import type { RoutesMap } from 'redux-first-router'
import { connectRoutes, redirect, pathToAction } from 'redux-first-router'
import { createLogger } from 'redux-logger'
import uiDirectionReducer from '../i18n/reducers'
import endpointReducers from './reducers'
import toggleDarkModeReducer from '../theme/reducers'
import { createResponsiveStateReducer, responsiveStoreEnhancer } from 'redux-responsive'
import tunewsReducer from './reducers/tunewsReducer'
import { routesMap as defaultRoutesMap } from './route-configs/index'
import queryString from 'query-string'
import createHistory from './createHistory'
import type { StateType } from './StateType'
import type { StoreActionType } from './StoreActionType'
import buildConfig from './constants/buildConfig'
import { LANDING_ROUTE } from './route-configs/LandingRouteConfig'
import CategoriesRouteConfig from './route-configs/CategoriesRouteConfig'

const createReduxStore = (initialState: StateType = {}, routesMap: RoutesMap = defaultRoutesMap): Store<StateType,
  StoreActionType> => {
  const { reducer, middleware, enhancer } = connectRoutes(routesMap, {
    querySerializer: queryString,
    createHistory: () => createHistory(),
    onBeforeChange: (dispatch, _, bag) => {
      const payload = bag.action.payload
      const fixedCity = buildConfig().featureFlags.fixedCity
      // Redirect to fixed city instead of showing the landing page for '/landing/<language>' routes
      if (fixedCity && bag.action.type === LANDING_ROUTE && payload.language) {
        const config = new CategoriesRouteConfig()
        const routePath = config.getRoutePath({ city: fixedCity, language: payload.language })
        dispatch(redirect(pathToAction(routePath, routesMap)))
      }
    }
  })

  /**
   * The middlewares of this app, add additional middlewares here
   */
  const middlewares = [
    middleware,
    thunkMiddleware // Allows to return functions in actions
  ]

  if (buildConfig().featureFlags.developerFriendly) {
    middlewares.push(createLogger()) // Logs all state changes in console
  }
  const rootReducer = combineReducers({
    ...endpointReducers,
    viewport: createResponsiveStateReducer({ small: 750 }, { infinity: 'large' }),
    location: reducer,
    uiDirection: uiDirectionReducer,
    darkMode: toggleDarkModeReducer,
    tunews: tunewsReducer
  })

  const enhancers = compose(responsiveStoreEnhancer, enhancer, applyMiddleware(...middlewares))

  return createStore(rootReducer, initialState, enhancers)
}

export default createReduxStore
