// @flow

import { createAction, handleAction } from 'redux-actions'

import reduceReducers from 'reduce-reducers'
import Payload from './Payload'

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
   * @type mapParamsToUrlCallback
   */
  mapParamsToUrl

  /**
   * Converts a fetched response to an object
   */
  mapResponse

  /**
   * Holds the override value for the response
   */
  responseOverride

  /**
   * Holds the override value for the error
   */
  errorOverride

  /**
   * @callback mapDataCallback
   * @param {object} data The data which has been fetched (Possibly a plain js object)
   * @param {object | undefined} state The state which was used in the fetch url
   * @return {object} The mapped data
   */

  /**
   * @callback mapParamsToUrlCallback
   * @param {object | undefined} state
   * @return {string} The url
   */

  /**
   * @param {string} name The name of this endpoint. This is used as key in the state and as Payload name. The Payload name is name + 'Paylaod'
   * @param {function} mapParamsToUrl The mapper which maps the params to a request url
   * @param {function} mapResponse Transforms the response from the fetch to a result
   * @param responseOverride {*} An override value from the API response. Useful for testing.
   * @param errorOverride {*} An override value to simulate an error while fetching. Useful for testing.
   */
  constructor (name, mapParamsToUrl, mapResponse, responseOverride, errorOverride) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
    this.finishFetchAction = (payload: Payload) => createAction(`${ActionType.FINISH_FETCH}_${this._stateName.toUpperCase()}`)(payload)
    this.startFetchAction = () => createAction(`${ActionType.START_FETCH}_${this._stateName.toUpperCase()}`)(new Payload(true))
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

  async fetchData (dispatch, oldPayload, params) {
    const responseOverride = this.responseOverride
    const errorOverride = this.errorOverride
    /**
     * Returns whether the correct data is available and ready for the fetcher to be displayed.
     *
     * @param state The state with (hopefully) all relevant params
     * @param options The options get passed to the {@link mapResponse} function when fetching
     * @return {function(*, *)} The Action for the redux store which can initiate a fetch
     */
    const formattedURL = this.mapParamsToUrl(params)

    if (formattedURL.includes('undefined')) {
      throw new Error(`Some necessary params in the state were undefined: ${formattedURL}`)
    }

    const lastUrl = oldPayload.requestUrl
    const urlNotChanged = lastUrl && lastUrl === formattedURL

    if (urlNotChanged) {
      // Correct payload has been loaded and can now be used by the fetcher(s)
      return oldPayload
    }

    // Refetch if url changes or we don't have a lastUrl
    dispatch(this.startFetchAction())

    if (errorOverride) {
      const payload = new Payload(false, null, errorOverride, formattedURL)
      dispatch(this.finishFetchAction(payload))
      return payload
    }
    if (responseOverride) {
      const data = this.mapResponse(responseOverride, params)
      const payload = new Payload(false, data, null, formattedURL)
      dispatch(this.finishFetchAction(payload))
      return payload
    }

    fetch(formattedURL)
      .then(response => response.json())
      .then(json => {
        try {
          const fetchedData = this.mapResponse(json, params)
          const payload = new Payload(false, fetchedData, null, formattedURL)
          dispatch(this.finishFetchAction(payload))
          return payload
        } catch (e) {
          console.error(`Failed to map the json for the endpoint: ${this.stateName}`)
          console.error(e)
          dispatch(this.finishFetchAction(null, 'endpoint:page.loadingFailed', formattedURL))
        }
      })
      .catch(e => {
        console.error(`Failed to load the request for the endpoint: ${this.stateName}`)
        console.error(e)
        const payload = new Payload(false, null, e, formattedURL)
        dispatch(this.finishFetchAction(payload))
        return payload
      })
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
