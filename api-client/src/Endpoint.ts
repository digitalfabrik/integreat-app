import Payload from './Payload'
import MappingError from './errors/MappingError'
import { MapResponseType } from './MapResponseType'
import { MapParamsToUrlType } from './MapParamsToUrlType'
import { MapParamsToBodyType } from './MapParamsToBody'
import ResponseError, { RequestOptionsType } from './errors/ResponseError'
import FetchError from './errors/FetchError'
import NotFoundError from './errors/NotFoundError'
/**
 * A Endpoint holds all the relevant information to fetch data from it
 */

class Endpoint<P, T> {
  _stateName: string
  mapParamsToUrl: MapParamsToUrlType<P>
  mapParamsToBody: MapParamsToBodyType<P> | null | undefined
  mapResponse: MapResponseType<P, T>
  responseOverride: T | null | undefined
  errorOverride: Error | null | undefined

  constructor(
    name: string,
    mapParamsToUrl: MapParamsToUrlType<P>,
    mapParamsToBody: MapParamsToBodyType<P> | null | undefined,
    mapResponse: MapResponseType<P, T>,
    responseOverride?: T | null,
    errorOverride?: Error | null
  ) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapParamsToBody = mapParamsToBody
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
  }

  get stateName(): string {
    return this._stateName
  }

  async fetchOrThrow(url: string, requestOptions: Partial<RequestInit>): Promise<Response> {
    return fetch(url, requestOptions).catch((e: Error) => {
      throw new FetchError({
        endpointName: this.stateName,
        innerError: e
      })
    })
  }

  async request(params: P, overrideUrl?: string): Promise<Payload<T>> {
    if (this.errorOverride) {
      throw this.errorOverride
    }

    const url = overrideUrl || this.mapParamsToUrl(params)

    if (this.responseOverride) {
      return new Payload(false, url, this.responseOverride, null)
    }

    const requestOptions: RequestOptionsType = this.mapParamsToBody
      ? {
          method: 'POST',
          body: this.mapParamsToBody(params)
        }
      : {
          method: 'GET'
        }
    const response = await this.fetchOrThrow(url, requestOptions)

    if (!response.ok) {
      throw new ResponseError({
        endpointName: this.stateName,
        response,
        url,
        requestOptions
      })
    }

    try {
      const json = await response.json()
      const fetchedData = this.mapResponse(json, params)
      return new Payload(false, url, fetchedData, null)
    } catch (e) {
      throw e instanceof MappingError || e instanceof NotFoundError ? e : new MappingError(this.stateName, e.message)
    }
  }
}

export default Endpoint
