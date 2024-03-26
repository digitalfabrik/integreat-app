import { JPAL_TRACKING_CODE_QUERY_PARAM } from '../tracking'
import { MapParamsToBodyType } from './MapParamsToBody'
import { MapParamsToUrlType } from './MapParamsToUrlType'
import { MapResponseType } from './MapResponseType'
import Payload from './Payload'
import FetchError from './errors/FetchError'
import NotFoundError from './errors/NotFoundError'
import ResponseError from './errors/ResponseError'
import { getJpalTrackingCode, request as fetch } from './request'

/**
 * An Endpoint holds all the relevant information to fetch data from it
 */

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

    const baseUrl = overrideUrl || this.mapParamsToUrl(params)

    const urlObject = new URL(baseUrl)
    const jpalTrackingCode = getJpalTrackingCode()
    if (jpalTrackingCode) {
      urlObject.searchParams.append(JPAL_TRACKING_CODE_QUERY_PARAM, jpalTrackingCode)
    }

    const url = urlObject.toString()

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

    const response = await fetch(url, requestOptions).catch((e: Error) => {
      throw new FetchError({
        endpointName: this.stateName,
        innerError: e,
        url,
        requestOptions,
      })
    })

    const NOT_FOUND_CODE = 404
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
