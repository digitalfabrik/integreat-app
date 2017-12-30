import { applyMiddleware, combineReducers, compose, createStore } from 'redux'

import thunkMiddleware from 'redux-thunk'
import { initializeCurrentLocation, routerForBrowser } from 'redux-little-router'
import createBrowserHistory from 'history/createBrowserHistory'

import routes from 'routes'
import endpointReducers from 'modules/endpoint/reducers'
import { createLogger } from 'redux-logger'

import setLanguageChangeUrlsReducer from 'modules/language/reducers/setLanguageChangeUrls'

class Store {
  init (initialState) {
    this._history = createBrowserHistory()

    this.history.listen((location, action) => {
      // Keep default behavior of restoring scroll position when user:
      // - clicked back button
      // - clicked on a link that programmatically calls `history.goBack()`
      // - manually changed the URL in the address bar (here we might want
      // to scroll to top, but we can't differentiate it from the others)
      if (action === 'POP') {
        return
      }
      // In all other cases, scroll to top
      window.scrollTo(0, 0)
    })

    // Additional reducers
    const {
      enhancer,
      reducer,
      middleware
    } = routerForBrowser({routes, basename: '', history: this.history})

    /**
     * The middlewares of this app, add additional middlewares here
     * @type {[*]}
     */
    let middlewares = [
      middleware,
      thunkMiddleware // Allows to return functions in actions
    ]

    // eslint-disable-next-line no-undef
    if (__DEV__) {
      middlewares.push(createLogger()) // Logs all state changes in console
    }

    /**
     * Configures the main store which holds the global state of the app
     *
     * @param preloadedState
     * @returns {*} A configured store
     */
    const configureStore = function configureStore (preloadedState) {
      return createStore(
        combineReducers({
          ...endpointReducers,
          router: reducer,
          languageChangeUrls: setLanguageChangeUrlsReducer
        }),
        preloadedState,
        compose(enhancer, applyMiddleware(...middlewares))
      )
    }

    this._store = configureStore(initialState)

    const initialLocation = this.getState().router

    if (initialLocation) {
      this.dispatch(initializeCurrentLocation(initialLocation))
    }
  }

  /**
   * @returns Gets redux state
   */
  getState () {
    return this._store.getState()
  }

  get redux () {
    return this._store
  }

  dispatch (action) {
    return this._store.dispatch(action)
  }

  subscribe (fn) {
    return this._store.subscribe(fn)
  }

  /**
   * @returns Gets the current history implementation
   */
  get history () {
    return this._history
  }
}

export default Store
