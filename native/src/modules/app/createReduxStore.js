// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'

import toggleDarkModeReducer from '../theme/reducers'
import type { Saga } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import createDebugger from 'redux-flipper'
import { all, call } from 'redux-saga/effects'
import type { StateType } from './StateType'
import { defaultCitiesState, defaultCityContentState, defaultContentLanguageState } from './StateType'
import type { StoreActionType } from './StoreActionType'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { DataContainer } from '../endpoint/DataContainer'
import citiesReducer from '../endpoint/reducers/citiesReducer'
import watchFetchCategory from '../endpoint/sagas/watchFetchCategory'
import watchFetchCities from '../endpoint/sagas/watchFetchCities'
import cityContentReducer from '../endpoint/reducers/cityContentReducer'
import watchFetchEvent from '../endpoint/sagas/watchFetchEvent'
import watchFetchNews from '../endpoint/sagas/watchFetchNews'
import watchContentLanguageSwitch from '../endpoint/sagas/watchContentLanguageSwitch'
import contentLanguageReducer from '../i18n/reducers/contentLanguageReducer'
import watchClearCity from '../i18n/watchClearCity'
import watchClearResourcesAndCache from '../endpoint/sagas/watchClearResourcesAndCache'
import watchFetchPoi from '../endpoint/sagas/watchFetchPoi'
import buildConfig from './constants/buildConfig'
import resourceCacheUrlReducer from '../static-server/reducers/resourceCacheUrlReducer'

function * rootSaga (dataContainer: DataContainer): Saga<void> {
  yield all([
    call(watchFetchCategory, dataContainer),
    call(watchFetchEvent, dataContainer),
    call(watchFetchPoi, dataContainer),
    call(watchFetchCities, dataContainer),
    call(watchFetchNews, dataContainer),
    call(watchClearCity),
    call(watchContentLanguageSwitch, dataContainer),
    call(watchClearResourcesAndCache, dataContainer)
  ])
}

const createReduxStore = (
  dataContainer: DataContainer
): Store<StateType, StoreActionType> => {
  const sagaMiddleware = createSagaMiddleware()

  const initialState: StateType = {
    darkMode: false,
    cities: defaultCitiesState,
    contentLanguage: defaultContentLanguageState,
    cityContent: defaultCityContentState,
    resourceCacheUrl: null
  }

  const rootReducer = combineReducers({
    darkMode: toggleDarkModeReducer,
    cities: citiesReducer,
    contentLanguage: contentLanguageReducer,
    cityContent: cityContentReducer,
    resourceCacheUrl: resourceCacheUrlReducer
  })

  const middlewares = [sagaMiddleware]
  if (buildConfig().featureFlags.developerFriendly) {
    const flipperReduxMiddleware = createDebugger()
    middlewares.push(flipperReduxMiddleware)
  }

  const middleware = applyMiddleware(...middlewares)
  const enhancer = buildConfig().featureFlags.developerFriendly ? composeWithDevTools(middleware) : middleware
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(rootSaga, dataContainer)
  return store
}

export default createReduxStore
