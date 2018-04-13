// @flow

import Endpoint from './Endpoint'
import type { MapParamsToUrl, MapResponse } from './Endpoint'
import type { PayloadData } from './Payload'

/**
 * Helper class to build a {@link Endpoint}
 */
class EndpointBuilder {
  _name: string
  _paramsToUrlMapper: MapParamsToUrl
  _mapper: MapResponse
  _responseOverride: ?PayloadData
  _errorOverride: ?Error

  /**
   * Creates a new endpoint builder
   * @param {string} name The name of the endpoint to build
   */
  constructor (name: string) {
    this._name = name
  }

  /**
   * Adds a state to url mapper to the builder
   * @param paramsToUrlMapper The paramsToUrlMapper which is mapping the params to a url
   * @return {EndpointBuilder} The builder itself
   */
  withParamsToUrlMapper (paramsToUrlMapper: MapParamsToUrl): EndpointBuilder {
    this._paramsToUrlMapper = paramsToUrlMapper
    return this
  }

  /**
   * Adds a json mapper to the builder
   * @param mapper The mapper which maps json from our cms to models
   * @return {EndpointBuilder} The builder itself
   */
  withMapper (mapper: MapResponse): EndpointBuilder {
    this._mapper = mapper
    return this
  }

  /**
   * Overrides value from the API response. Useful for testing.
   * @param responseOverride {*} The response
   * @return {EndpointBuilder} The builder itself
   */
  withResponseOverride (responseOverride: any): EndpointBuilder {
    this._responseOverride = responseOverride
    return this
  }

  /**
   * Fetcher throws an error. Useful for testing.
   * @param errorOverride {*} The error
   * @return {EndpointBuilder} The builder itself
   */
  withErrorOverride (errorOverride: Error): EndpointBuilder {
    this._errorOverride = errorOverride
    return this
  }

  /**
   * Checks the data and builds the endpoint
   * @return {Endpoint} The final endpoint
   */
  build (): Endpoint {
    if (!this._name) {
      throw Error('You have to set a name to build an endpoint!')
    }

    if (!this._paramsToUrlMapper) {
      throw Error('You have to set a url mapper to build an endpoint!')
    }

    if (!this._mapper) {
      throw Error('You have to set a mapper to build an endpoint!')
    }

    return new Endpoint(this._name, this._paramsToUrlMapper, this._mapper, this._responseOverride, this._errorOverride)
  }
}

export default EndpointBuilder
