import { applyMiddleware, combineReducers, createStore, Middleware, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createDebugger from 'redux-flipper'
import { all, call } from 'typed-redux-saga'
import { defaultCitiesState, defaultCityContentState, defaultContentLanguageState, StateType } from './StateType'
import { StoreActionType } from './StoreActionType'
import { composeWithDevTools } from 'redux-devtools-extension'
import { DataContainer } from '../utils/DataContainer'
import citiesReducer from './reducers/citiesReducer'
import watchFetchCategory from '../sagas/watchFetchCategory'
import watchFetchCities from '../sagas/watchFetchCities'
import cityContentReducer from './reducers/cityContentReducer'
import watchFetchEvent from '../sagas/watchFetchEvent'
import watchFetchNews from '../sagas/watchFetchNews'
import watchContentLanguageSwitch from '../sagas/watchContentLanguageSwitch'
import contentLanguageReducer from './reducers/contentLanguageReducer'
import watchClearCity from '../sagas/watchClearCity'
import watchClearResourcesAndCache from '../sagas/watchClearResourcesAndCache'
import watchFetchPoi from '../sagas/watchFetchPoi'
import buildConfig from '../constants/buildConfig'
import resourceCacheUrlReducer from './reducers/resourceCacheUrlReducer'
import snackbarReducer from './reducers/snackbarReducer'

function* rootSaga(dataContainer: DataContainer) {
  yield* all([
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

const createReduxStore = (dataContainer: DataContainer): Store<StateType, StoreActionType> => {
  const sagaMiddleware = createSagaMiddleware()
  const initialState: StateType = {
    cities: defaultCitiesState,
    contentLanguage: defaultContentLanguageState,
    cityContent: defaultCityContentState,
    resourceCacheUrl: null,
    snackbar: []
  }
  const rootReducer = combineReducers({
    cities: citiesReducer,
    contentLanguage: contentLanguageReducer,
    cityContent: cityContentReducer,
    resourceCacheUrl: resourceCacheUrlReducer,
    snackbar: snackbarReducer
  })
  const middlewares: Middleware[] = [sagaMiddleware]

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
