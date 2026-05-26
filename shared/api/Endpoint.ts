import { MapParamsToBodyType } from './MapParamsToBody.js'
import { MapParamsToUrlType } from './MapParamsToUrlType.js'
import { MapResponseType } from './MapResponseType.js'
import Payload from './Payload.js'
import FetchError from './errors/FetchError.js'
import NotFoundError from './errors/NotFoundError.js'
import ResponseError from './errors/ResponseError.js'
import { request as fetch } from './request.js'

const NOT_FOUND_CODE = 404

class Endpoint<P, T extends object> {
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
    errorOverride?: Error | null,
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

  async request(params: P, overrideUrl?: string): Promise<Payload<T>> {
    if (this.errorOverride) {
      throw this.errorOverride
    }

    const url = overrideUrl || this.mapParamsToUrl(params)

    if (this.responseOverride) {
      return new Payload(false, url, this.responseOverride, null)
    }

    const body = this.mapParamsToBody ? this.mapParamsToBody(params) : null
    const headers = typeof body === 'string' ? { headers: { 'Content-Type': 'application/json' } } : {}

    const requestOptions =
      body === null
        ? {
            method: 'GET',
          }
        : {
            method: 'POST',
            body,
            ...headers,
          }

    const response = await fetch(url, requestOptions).catch(error => {
      throw new FetchError({
        endpointName: this.stateName,
        innerError: error,
        url,
        requestOptions,
      })
    })

    if (response.status === NOT_FOUND_CODE) {
      throw new NotFoundError({ ...params, type: 'category', id: this.stateName })
    }

    if (!response.ok) {
      throw new ResponseError({
        endpointName: this.stateName,
        response,
        url,
        requestOptions,
      })
    }

    const json = await response.json().catch(e => {
      throw new FetchError({
        endpointName: this.stateName,
        innerError: e,
        url,
        requestOptions,
      })
    })

    const fetchedData = this.mapResponse(json, params)
    return new Payload(false, url, fetchedData, null)
  }
}

export default Endpoint
