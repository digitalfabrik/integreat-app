import { createAction } from 'redux-actions'

import Payload from './Payload'

export const startFetchActionName = (type: string): string => `START_FETCH_${type.toUpperCase()}`
export const finishFetchActionName = (type: string): string => `FINISH_FETCH_${type.toUpperCase()}`

export const endpointLoadingErrorMessage = 'Failed to load the request for the endpoint'

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
    this.finishFetchAction = (payload: Payload) => createAction(finishFetchActionName(this._stateName))(payload)
    this.startFetchAction = () => createAction(startFetchActionName(this._stateName))(new Payload(true))
  }

  /**
   * @returns {string|*} The name of the linked state
   */
  get stateName () {
    return this._stateName
  }

  async loadData (dispatch, oldPayload, params) {
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

    if (lastUrl && lastUrl === formattedURL) {
      // The correct data was already fetched
      return oldPayload
    }

    // Fetch if the data is not valid anymore or it hasn't been fetched yet
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

    const payload = await this.fetchData(formattedURL, params)
    dispatch(this.finishFetchAction(payload))
    return payload
  }

  async fetchData (formattedUrl, params) {
    return fetch(formattedUrl)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(endpointLoadingErrorMessage)
        }
      })
      .then(json => {
        try {
          const fetchedData = this.mapResponse(json, params)
          return new Payload(false, fetchedData, null, formattedUrl)
        } catch (e) {
          console.error(`Failed to map the json for the endpoint: ${this.stateName}`)
          console.error(e)
          return new Payload(false, null, 'endpoint:page.loadingFailed', formattedUrl)
        }
      })
      .catch(e => {
        console.error(`${e}: ${this.stateName}`)
        return new Payload(false, null, e, formattedUrl)
      })
  }
}

export default Endpoint
