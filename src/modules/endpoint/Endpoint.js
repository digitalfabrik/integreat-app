// @flow

import Payload from './Payload'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import startFetchAction from './actions/startFetchAction'
import finishFetchAction from './actions/finishFetchAction'
import type { PayloadData } from './Payload'

export const LOADING_ERROR = 'Failed to load the request for the endpoint'
export const MAPPING_ERROR = 'Failed to map the json for the endpoint'

export type Params = {city?: string, language?: string, url?: string}
export type MapParamsToUrl = (params: Params) => string
export type MapResponse = (json: any, params: Params) => PayloadData

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint {
  _stateName: string
  mapParamsToUrl: MapParamsToUrl
  mapResponse: MapResponse
  responseOverride: ?PayloadData
  errorOverride: ?string

  constructor (name: string, mapParamsToUrl: MapParamsToUrl, mapResponse: MapResponse,
    responseOverride: ?PayloadData, errorOverride: ?string) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
  }

  get stateName (): string {
    return this._stateName
  }

  async loadData (dispatch: Dispatch, oldPayload: Payload, params: Params): Promise<Payload> {
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

    const lastUrl = oldPayload.requestUrl

    if (lastUrl && lastUrl === formattedURL) {
      // The correct data was already fetched
      return oldPayload
    }

    // Fetch if the data is not valid anymore or it hasn't been fetched yet
    dispatch(startFetchAction(this.stateName))

    if (errorOverride) {
      const payload = new Payload(false, null, errorOverride, formattedURL)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    }
    if (responseOverride) {
      const data = this.mapResponse(responseOverride, params)
      const payload = new Payload(false, data, null, formattedURL)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    }

    try {
      const payload = await this.fetchData(formattedURL, params)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    } catch (e) {
      console.error(`${LOADING_ERROR}: ${this.stateName}`)
      return new Payload(false, null, LOADING_ERROR, formattedURL)
    }
  }

  async fetchData (formattedUrl: string, params: Params): Promise<Payload> {
    const response = await fetch(formattedUrl)
    if (!response.ok) {
      throw new Error(LOADING_ERROR)
    }
    try {
      const json = await response.json()
      const fetchedData = this.mapResponse(json, params)
      return new Payload(false, fetchedData, null, formattedUrl)
    } catch (e) {
      console.error(`${MAPPING_ERROR}: ${this.stateName}`)
      console.error(e)
      return new Payload(false, null, MAPPING_ERROR, formattedUrl)
    }
  }
}

export default Endpoint
