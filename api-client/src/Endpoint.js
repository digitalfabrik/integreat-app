// @flow

import Payload from './Payload'
import MappingError from './errors/MappingError'
import type { MapResponseType } from './MapResponseType'
import type { MapParamsToUrlType } from './MapParamsToUrlType'
import type { MapParamsToBodyType } from './MapParamsToBody'
import ResponseError from './errors/ResponseError'
import FetchError from './errors/FetchError'
import type { RequestOptionsType } from './errors/ResponseError'

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint<P, T> {
  _stateName: string
  mapParamsToUrl: MapParamsToUrlType<P>
  mapParamsToBody: ?MapParamsToBodyType<P>
  mapResponse: MapResponseType<P, T>
  responseOverride: ?T
  errorOverride: ?Error

  constructor (
    name: string,
    mapParamsToUrl: MapParamsToUrlType<P>,
    mapParamsToBody: ?MapParamsToBodyType<P>,
    mapResponse: MapResponseType<P, T>,
    responseOverride: ?T, errorOverride: ?Error
  ) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapParamsToBody = mapParamsToBody
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
  }

  get stateName (): string {
    return this._stateName
  }

  async fetchOrThrow (url: string, requestOptions: $Shape<RequestOptions>): Promise<Response> {
    return fetch(url, requestOptions).catch((e: Error) => {
      throw new FetchError({ endpointName: this.stateName, innerError: e })
    })
  }

  async request (params: P, overrideUrl?: string): Promise<Payload<T>> {
    if (this.errorOverride) {
      throw this.errorOverride
    }

    const url = overrideUrl || this.mapParamsToUrl(params)
    if (this.responseOverride) {
      return new Payload(false, url, this.responseOverride, null)
    }

    const requestOptions: RequestOptionsType = this.mapParamsToBody ? {
      method: 'POST',
      body: this.mapParamsToBody(params)
    } : { method: 'GET' }
    const response = await this.fetchOrThrow(url, requestOptions)

    if (!response.ok) {
      throw new ResponseError({ endpointName: this.stateName, response, url, requestOptions })
    }

    try {
      const json = await response.json()
      const fetchedData = this.mapResponse(json, params)
      return new Payload(false, url, fetchedData, null)
    } catch (e) {
      throw (e instanceof MappingError) ? e : new MappingError(this.stateName, e.message)
    }
  }
}

export default Endpoint
