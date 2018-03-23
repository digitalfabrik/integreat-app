// @flow

import { createAction } from 'redux-actions'

import Payload from './Payload'
import type { Action, Dispatch } from 'redux-first-router/dist/flow-types'
import CategoriesMapModel from './models/CategoriesMapModel'
import CityModel from './models/CityModel'
import LanguageModel from './models/LanguageModel'
import EventModel from './models/EventModel'
import ExtraModel from './models/ExtraModel'
import SprungbrettModel from './models/SprungbrettJobModel'
import DisclaimerModel from './models/DisclaimerModel'

export const startFetchActionName = (type: string): string => `START_FETCH_${type.toUpperCase()}`
export const finishFetchActionName = (type: string): string => `FINISH_FETCH_${type.toUpperCase()}`

export const endpointLoadingErrorMessage = 'Failed to load the request for the endpoint'

type Params = {city?: string, language?: string} | {url: string}
type PayloadData = Array<CityModel | LanguageModel | EventModel | ExtraModel | SprungbrettModel> |
  CategoriesMapModel | DisclaimerModel
type FinishFetchAction = (payload: Payload) => Action
type StartFetchAction = (payload: Payload) => Action
type MapParamsToUrl = (params: Params) => string
type MapResponse = (json: any, params?: Params) => PayloadData
type ResponseOverride = () => PayloadData
type ErrorOverride = () => string

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint {
  _stateName: string
  finishFetchAction: FinishFetchAction
  startFetchAction: StartFetchAction
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
    this.finishFetchAction = (payload: Payload) => createAction(finishFetchActionName(this._stateName))(payload)
    this.startFetchAction = () => createAction(startFetchActionName(this._stateName))(new Payload(true))
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

  async fetchData (formattedUrl: string, params: Params): Promise<PayloadData> {
    const response = await fetch(formattedUrl)
    if (!response.ok) {
      console.error(`${endpointLoadingErrorMessage}: ${this.stateName}`)
      return new Payload(false, null, endpointLoadingErrorMessage, formattedUrl)
    }
    const json = await response.json()
    try {
      const fetchedData = this.mapResponse(json, params)
      return new Payload(false, fetchedData, null, formattedUrl)
    } catch (e) {
      console.error(`Failed to map the json for the endpoint: ${this.stateName}`)
      console.error(e)
      return new Payload(false, null, 'endpoint:page.loadingFailed', formattedUrl)
    }
  }
}

export default Endpoint
