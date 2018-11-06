// @flow

import Payload from './Payload'
import LoadingError from './errors/LoadingError'
import MappingError from './errors/MappingError'
import type { MapResponseType } from './MapResponseType'
import type { MapParamsToUrlType } from './MapParamsToUrlType'
import type { MapParamsToBodyType } from './MapParamsToBody'

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint<P, T> {
  _stateName: string
  mapParamsToUrl: MapParamsToUrlType<P>
  mapParamsToBody: MapParamsToBodyType<P>
  mapResponse: MapResponseType<P, T>
  responseOverride: ?T
  errorOverride: ?Error

  constructor (
    name: string,
    mapParamsToUrl: MapParamsToUrlType<P>, mapParamsToBody: MapParamsToBodyType<P>,
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

  async postFormData (url: string, params: P): Promise<Response> {
    const formattedBody = this.mapParamsToBody(params)

    return fetch(url, {
      method: 'POST',
      body: formattedBody
    })
  }

  async fetchData (formattedUrl: string, params: P): Promise<Payload<T>> {
    const url = this.mapParamsToUrl(params)
    const response = await (this.mapParamsToBody ? this.postFormData(url, params) : fetch(url))

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
