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
import tunewsReducer from './reducers/tunewsReducer'
import { routesMap as defaultRoutesMap } from './route-configs/index'
import createHistory from './createHistory'
import type { StateType } from './StateType'
import type { StoreActionType } from './StoreActionType'
import buildConfig from './constants/buildConfig'

const createReduxStore = (initialState: StateType = {}, routesMap: RoutesMap = defaultRoutesMap): Store<StateType,
  StoreActionType> => {
  const { reducer, middleware, enhancer } = connectRoutes(routesMap, {
    createHistory: () => createHistory()
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
