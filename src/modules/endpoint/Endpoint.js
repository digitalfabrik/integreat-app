// @flow

import Payload from './Payload'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import CategoriesMapModel from './models/CategoriesMapModel'
import CityModel from './models/CityModel'
import LanguageModel from './models/LanguageModel'
import EventModel from './models/EventModel'
import ExtraModel from './models/ExtraModel'
import SprungbrettModel from './models/SprungbrettJobModel'
import DisclaimerModel from './models/DisclaimerModel'
import startFetchAction from './actions/startFetchAction'
import finishFetchAction from './actions/finishFetchAction'

export const LOADING_ERROR = 'Failed to load the request for the endpoint'
export const MAPPING_ERROR = 'Failed to map the json for the endpoint'

type Params = {city?: string, language?: string} | {url: string}
type PayloadData = Array<CityModel | LanguageModel | EventModel | ExtraModel | SprungbrettModel> |
  CategoriesMapModel | DisclaimerModel
type MapParamsToUrl = (params: Params) => string
type MapResponse = (json: any, params?: Params) => PayloadData
type ResponseOverride = () => PayloadData
type ErrorOverride = () => string

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint {
  _stateName: string
  mapParamsToUrl: MapParamsToUrl
  mapResponse: MapResponse
  responseOverride: ?ResponseOverride
  errorOverride: ?ErrorOverride

  constructor (name: string, mapParamsToUrl: MapParamsToUrl, mapResponse: MapResponse,
    responseOverride: ?ResponseOverride, errorOverride: ?ErrorOverride) {
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

    if (formattedURL.includes('undefined')) {
      throw new Error(`Some necessary params in the state were undefined: ${formattedURL}`)
    }

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

    const payload = await this.fetchData(formattedURL, params)
    dispatch(finishFetchAction(this.stateName, payload))
    return payload
  }

  async fetchData (formattedUrl: string, params: Params): Promise<PayloadData> {
    const response = await fetch(formattedUrl)
    if (!response.ok) {
      console.error(`${LOADING_ERROR}: ${this.stateName}`)
      return new Payload(false, null, LOADING_ERROR, formattedUrl)
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
