import { applyMiddleware, compose, createStore } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

// import {persistStore, autoRehydrate} from 'redux-persist'

const loggerMiddleware = createLogger()

let configureStore = function configureStore (preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      )
      // autoRehydrate()
    )
  )
}

let store = configureStore()
// persistStore(store);

export default store
