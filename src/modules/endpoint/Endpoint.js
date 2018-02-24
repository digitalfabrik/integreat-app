import { createAction, handleAction } from 'redux-actions'

import reduceReducers from 'reduce-reducers'
import Payload from './Payload'
import StoreResponse from './StoreResponse'

class ActionType {
  static FINISH_FETCH = 'FINISH_FETCH_DATA'
  static START_FETCH = 'START_FETCH_DATA'
}

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint {
  /**
   * @type string
   */
  _stateName
  finishFetchAction
  startFetchAction
  /**
   * @type mapStateToUrlCallback
   */
  mapStateToUrl
  /**
   * @type shouldRefetchCallback
   */
  shouldRefetch

  /**
   * Converts a fetched response to an object
   */
  mapResponse

  /**
   * Holds the override value for the response
   */
  responseOverride

  /**
   * @callback mapDataCallback
   * @param {object} data The data which has been fetched (Possibly a plain js object)
   * @param {object | undefined} state The state which was used in the fetch url
   * @return {object} The mapped data
   */

  /**
   * @callback mapStateToUrlCallback
   * @param {object | undefined} state
   * @return {string} The url
   */

  /**
   * @callback shouldRefetchCallback
   * @param {object} currentProps
   * @param {object} nextProps
   * @return {boolean} Whether we should refetch
   */

  /**
   * @param {string} name The name of this endpoint. This is used as key in the state and as Payload name. The Payload name is name + 'Paylaod'
   * @param {function} mapStateToUrl The mapper which maps the state to a request url
   * @param {function} mapResponse Transforms the response from the fetch to a result
   * @param shouldRefetch Takes the current and the next props and should return whether we should refetch
   * @param responseOverride {*} An override value from the API response. Useful for testing.
   */
  constructor (name, mapStateToUrl, mapResponse, shouldRefetch, responseOverride) {
    this.mapStateToUrl = mapStateToUrl
    this.shouldRefetch = shouldRefetch
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this._stateName = name

    const actionName = name.toUpperCase()

    this.finishFetchAction = createAction(`${ActionType.FINISH_FETCH}_${actionName}`, (value, error, requestUrl) => {
      return new Payload(false, value, error, requestUrl, new Date().getTime())
    })
    this.startFetchAction = createAction(`${ActionType.START_FETCH}_${actionName}`, () => new Payload(true))
  }

  /**
   * @returns {string|*} The name of the linked state
   */
  get stateName () {
    return this._stateName
  }

  /**
   * @returns {string|*} The name of the resulting payload
   */
  get payloadName () {
    return `${this.stateName}Payload`
  }

  requestAction (state) {
    const responseOverride = this.responseOverride
    /**
     * Returns whether the correct data is available and ready for the fetcher to be displayed.
     *
     * @param state The state with (hopefully) all relevant params
     * @param options The options get passed to the {@link mapResponse} function when fetching
     * @return {function(*, *)} The Action for the redux store which can initiate a fetch
     */
    return (dispatch, getState) => {
      const endpointData = getState()[this.stateName]
      if (endpointData.isFetching) {
        return new StoreResponse(false)
      }

      const formattedURL = this.mapStateToUrl(state)

      if (formattedURL.includes(undefined)) {
        throw new Error('Some necessary params in the state were undefined:' + formattedURL)
      }

      const lastUrl = endpointData.requestUrl
      const urlNotChanged = lastUrl && lastUrl === formattedURL

      if (urlNotChanged) {
        // Correct payload has been loaded and can now be used by the fetcher(s)
        return new StoreResponse(true)
      }

      // Refetch if url changes or we don't have a lastUrl
      dispatch(this.startFetchAction())

      if (responseOverride) {
        const value = this.mapResponse(responseOverride, state)
        dispatch(this.finishFetchAction(value, null, formattedURL))
        return new StoreResponse(false, Promise.resolve(value))
      }

      // Fetchers cannot display payload yet, since it's currently fetching
      return new StoreResponse(false,
        fetch(formattedURL)
          .then(response => response.json())
          .then(json => {
            try {
              const value = this.mapResponse(json, state)
              return dispatch(this.finishFetchAction(value, null, formattedURL))
            } catch (e) {
              console.error(`Failed to map the json for the endpoint: ${this.stateName}`)
              console.error(e)
              return dispatch(this.finishFetchAction(null, 'endpoint:page.loadingFailed', formattedURL))
            }
          })
          .catch(e => {
            console.error(`Failed to load the request for the endpoint: ${this.stateName}`)
            console.error(e)
            return dispatch(this.finishFetchAction(null, 'endpoint:page.loadingFailed', formattedURL))
          })
      )
    }
  }

  createReducer () {
    const defaultState = new Payload(false)
    const reducer = (state, action) => action.payload

    return reduceReducers(
      handleAction(this.startFetchAction, reducer, defaultState),
      handleAction(this.finishFetchAction, reducer, defaultState)
    )
  }
}

export default Endpoint
