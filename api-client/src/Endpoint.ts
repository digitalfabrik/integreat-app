import { MapParamsToBodyType } from './MapParamsToBody'
import { MapParamsToUrlType } from './MapParamsToUrlType'
import { MapResponseType } from './MapResponseType'
import Payload from './Payload'
import FetchError from './errors/FetchError'
import ResponseError, { RequestOptionsType } from './errors/ResponseError'
import { request as fetch } from './request'

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

    const response = await fetch(url, requestOptions).catch((e: Error) => {
      // TODO IGAPP-809: Remove again
      // eslint-disable-next-line no-console
      console.debug('An error occurred while fetching from ', url, ' with method ', requestOptions.method)
      if (requestOptions.method === 'POST') {
        // TODO IGAPP-809: Remove again
        // eslint-disable-next-line no-console
        console.debug(' and body ', requestOptions.body)
      }

      throw new FetchError({
        endpointName: this.stateName,
        innerError: e
      })
    })

    if (!response.ok) {
      throw new ResponseError({
        endpointName: this.stateName,
        response,
        url,
        requestOptions
      })
    }

    const json = await response.json().catch(e => {
      // TODO IGAPP-809: Remove again
      // eslint-disable-next-line no-console
      console.debug('An error occurred while fetching from ', url, ' with method ', requestOptions.method)
      if (requestOptions.method === 'POST') {
        // TODO IGAPP-809: Remove again
        // eslint-disable-next-line no-console
        console.debug(' and body ', requestOptions.body)
      }

      throw new FetchError({
        endpointName: this.stateName,
        innerError: e
      })
    })

    const fetchedData = this.mapResponse(json, params)
    return new Payload(false, url, fetchedData, null)
  }
}

export default Endpoint
