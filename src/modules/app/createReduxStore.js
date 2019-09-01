// @flow

import type { Store } from 'redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'

import toggleDarkModeReducer from '../theme/reducers'
import type { Saga } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
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
import watchContentLanguageSwitch from '../endpoint/sagas/watchContentLanguageSwitch'
import contentLanguageReducer from '../i18n/reducers/contentLanguageReducer'
import watchClearCity from '../i18n/watchClearCity'

function * rootSaga (dataContainer: DataContainer): Saga<void> {
  yield all([
    call(watchFetchCategory, dataContainer),
    call(watchFetchEvent, dataContainer),
    call(watchFetchCities, dataContainer),
    call(watchClearCity),
    call(watchContentLanguageSwitch, dataContainer)
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
    cityContent: defaultCityContentState
  }

  const rootReducer = combineReducers({
    darkMode: toggleDarkModeReducer,
    cities: citiesReducer,
    contentLanguage: contentLanguageReducer,
    cityContent: cityContentReducer
  })

  const middleware = applyMiddleware(sagaMiddleware)
  const enhancer = __DEV__ ? composeWithDevTools(middleware) : middleware
  const store = createStore(rootReducer, initialState, enhancer)

  sagaMiddleware.run(rootSaga, dataContainer)
  return store
}

export default createReduxStore
