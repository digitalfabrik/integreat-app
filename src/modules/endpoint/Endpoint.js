// @flow

import Payload from './Payload'
import LoadingError from './errors/LoadingError'
import MappingError from './errors/MappingError'
import type { MapResponseType } from './MapResponseType'
import type { MapParamsToUrlType } from './MapParamsToUrlType'

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint<P, T> {
  _stateName: string
  mapParamsToUrl: MapParamsToUrlType<P>
  mapResponse: MapResponseType<P, T>
  responseOverride: ?T
  errorOverride: ?Error

  constructor (name: string, mapParamsToUrl: MapParamsToUrlType<P>, mapResponse: MapResponseType<P, T>,
    responseOverride: ?T, errorOverride: ?Error) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
  }

  get stateName (): string {
    return this._stateName
  }

  async fetchData (formattedUrl: string, params: P): Promise<Payload<T>> {
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
