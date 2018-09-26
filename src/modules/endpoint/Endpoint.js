// @flow

import Payload from './Payload'
import LoadingError from './errors/LoadingError'
import MappingError from './errors/MappingError'
import ParamMissingError from './errors/ParamMissingError'
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

  constructor (name: string, mapParamsToUrl: MapParamsToUrlType<P>, mapResponse: MapResponseType<P, T>, responseOverride: ?T, errorOverride: ?Error) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
  }

  get stateName (): string {
    return this._stateName
  }

  async _loadData (params: P): Promise<Payload<T>> {
    let formattedUrl
    try {
      const responseOverride = this.responseOverride
      const errorOverride = this.errorOverride

      formattedUrl = this.mapParamsToUrl(params)

      if (errorOverride) {
        return new Payload(false, formattedUrl, null, errorOverride)
      }
      if (responseOverride) {
        const data = responseOverride
        return new Payload(false, formattedUrl, data, null)
      }

      return await this._fetchData(formattedUrl, params)
    } catch (e) {
      let error
      if (e instanceof LoadingError || e instanceof ParamMissingError || e instanceof MappingError) {
        error = e
      } else {
        error = new LoadingError({endpointName: this.stateName, message: e.message})
      }

      console.error(error)
      return new Payload(false, formattedUrl, null, error)
    }
  }

  async _fetchData (formattedUrl: string, params: P): Promise<Payload<T>> {
    const response = await fetch(formattedUrl)
    if (!response.ok) {
      throw new LoadingError({endpointName: this.stateName, message: `${response.status}`})
    }
    try {
      const json = await response.json()
      const fetchedData = json
      return new Payload(false, formattedUrl, fetchedData, null)
    } catch (e) {
      throw (e instanceof MappingError) ? e : new MappingError(this.stateName, e.message)
    }
  }
}

export default Endpoint
