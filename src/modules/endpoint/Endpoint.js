// @flow

import Payload from './Payload'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import startFetchAction from './actions/startFetchAction'
import finishFetchAction from './actions/finishFetchAction'
import type { PayloadData } from './Payload'
import LoadingError from './errors/LoadingError'
import MappingError from './errors/MappingError'
import ParamMissingError from './errors/ParamMissingError'

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
  errorOverride: ?Error

  constructor (name: string, mapParamsToUrl: MapParamsToUrl, mapResponse: MapResponse,
    responseOverride: ?PayloadData, errorOverride: ?Error) {
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
    let formattedUrl
    try {
      const responseOverride = this.responseOverride
      const errorOverride = this.errorOverride

      formattedUrl = this.mapParamsToUrl(params)

      const lastUrl = oldPayload.requestUrl

      if (lastUrl && lastUrl === formattedUrl) {
        // The correct data was already fetched
        return oldPayload
      }

      // Fetch if the data is not valid anymore or it hasn't been fetched yet
      dispatch(startFetchAction(this.stateName, formattedUrl))

      if (errorOverride) {
        const payload = new Payload(false, formattedUrl, null, errorOverride)
        dispatch(finishFetchAction(this.stateName, payload))
        return payload
      }
      if (responseOverride) {
        const data = this.mapResponse(responseOverride, params)
        const payload = new Payload(false, formattedUrl, data, null)
        dispatch(finishFetchAction(this.stateName, payload))
        return payload
      }

      const payload = await this.fetchData(formattedUrl, params)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    } catch (e) {
      let error
      if (e instanceof LoadingError || e instanceof ParamMissingError || e instanceof MappingError) {
        error = e
      } else {
        error = new LoadingError({endpointName: this.stateName, message: e.message})
      }

      console.error(error)
      const payload = new Payload(false, formattedUrl, null, error)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    }
  }

  async fetchData (formattedUrl: string, params: Params): Promise<Payload> {
    const response = await fetch(formattedUrl)
    if (!response.ok) {
      throw new LoadingError({endpointName: this.stateName, message: `${response.status}`})
    }
    try {
      const json = await response.json()
      const fetchedData = this.mapResponse(json, params)
      return new Payload(false, formattedUrl, fetchedData, null)
    } catch (e) {
      throw (e instanceof MappingError) ? e : new MappingError(this.stateName, e.message)
    }
  }
}

export default Endpoint
