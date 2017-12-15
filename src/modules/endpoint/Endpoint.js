import { createAction, handleAction } from 'redux-actions'
import format from 'string-template'

import reduceReducers from 'reduce-reducers'
import Payload from './Payload'
import StoreResponse from './StoreResponse'

class ActionType {
  static FINISH_FETCH = 'FINISH_FETCH_DATA'
  static START_FETCH = 'START_FETCH_DATA'
}

/**
 * A Endpoint holds all the relevant information to fetch data form it
 */
class Endpoint {
  /**
   * @type string
   */
  url
  finishFetchAction
  startFetchAction
  /**
   * @type mapStateToUrlParamsCallback
   */
  mapStateToUrlParams
  /**
   * @type shouldRefetchCallback
   */
  shouldRefetch

  /**
   * Converts a fetched response to an object
   */
  mapResponse

  /**
   * @callback mapDataCallback
   * @param {object} data The data which has been fetched (Possibly a plain js object)
   * @param {object} urlParams The params which were used in the fetch url
   * @return {object} The mapped data
   */

  /**
   * @callback mapStateToUrlParamsCallback
   * @param {object} state
   * @return {object} The url params
   */

  /**
   * @callback shouldRefetchCallback
   * @param {object} currentProps
   * @param {object} nextProps
   * @return {boolean} Whether we should refetch
   */

  /**
   * @param {string} name The name of this endpoint. This is used as key in the state and as Payload name. The Payload name is name + 'Paylaod'
   * @param {string} url The url with params (params are used like this: https://cms.integreat-app.de/{location}/{language})
   * @param {function} mapResponse Transforms the response from the fetch to a result
   * @param {mapStateToUrlParamsCallback} mapStateToUrlParams Maps the state to the url params which are needed in the Fetcher component
   * @param shouldRefetch Takes the current and the next props and should return whether we should refetch
   */
  constructor (name, url, mapResponse, mapStateToUrlParams, shouldRefetch) {
    this.url = url
    this.mapStateToUrlParams = mapStateToUrlParams
    this.shouldRefetch = shouldRefetch
    this.mapResponse = mapResponse

    const actionName = name.toUpperCase()

    this.finishFetchAction = createAction(`${ActionType.FINISH_FETCH}_${actionName}`, (value, error, requestUrl) => {
      return new Payload(false, value, error, requestUrl, new Date().getTime())
    })
    this.startFetchAction = createAction(`${ActionType.START_FETCH}_${actionName}`, () => new Payload(true))
    this._stateName = name
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

  requestAction (urlParams = {}) {
    /*
      Returns whether the correct data is available and ready for the fetcher to be displayed.
     */
    /**
     * @param urlParams The params for the url of the endpoint
     * @param options The options get passed to the {@link mapResponse} function when fetching
     * @return {function(*, *)} The Action for the redux store which can initiate a fetch
     */
    return (dispatch, getState) => {
      const endpointData = getState()[this.stateName]
      if (endpointData.isFetching) {
        return Promise.resolve(false)
      }

      const formattedURL = format(this.url, urlParams)
      /*
       todo:  check if there are any paramters left in the url: formattedURL.match(/{(.*)?}/)
       currently this does not work as unused paramaters are just removed from the url
       */

      const lastUrl = endpointData.requestUrl
      const lastFetchedDate = endpointData.fetchDate

      const canCacheByTime = !!lastFetchedDate && new Date().getTime() - 1000 * 60 * 60 <= lastFetchedDate
      const urlNotChanged = !!lastUrl && lastUrl === formattedURL

      if (urlNotChanged && canCacheByTime) {
        // Correct payload has been loaded and can now be used by the fetcher(s)
        return new StoreResponse(true)
      }

      // Refetch if url changes or we don't have a lastUrl
      dispatch(this.startFetchAction())
      return fetch(formattedURL)
        .then(response => response.json())
        .then(json => {
          let error
          let value
          try {
            value = this.mapResponse(json, urlParams)
          } catch (e) {
            error = e.message
            console.error('Failed to parse the json: ' + this.stateName, e.message)
          }

          return dispatch(this.finishFetchAction(value, error, formattedURL))
        })
        .catch(e => {
          console.error('Failed to load the endpoint request: ' + this.stateName, e.message)
          return dispatch(this.finishFetchAction(null, 'endpoint:page.loadingFailed', formattedURL))
        })
      // Fetchers cannot display payload yet, since it's currently fetching
      // return Promise.resolve(false)
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
