import Endpoint from './Endpoint'
import { MapResponseType } from './MapResponseType'
import { MapParamsToUrlType } from './MapParamsToUrlType'
import { MapParamsToBodyType } from './MapParamsToBody'
/**
 * Helper class to build a {@link Endpoint}
 */

class EndpointBuilder<P, T> {
  name: string
  paramsToBodyMapper: MapParamsToBodyType<P> | null | undefined
  paramsToUrlMapper: MapParamsToUrlType<P>
  mapper: MapResponseType<P, T>
  responseOverride: T | null | undefined
  errorOverride: Error | null | undefined

  /**
   * Creates a new endpoint builder
   * @param {string} name The name of the endpoint to build
   */
  constructor(name: string) {
    this.name = name
  }

  /**
   * Adds a state to url mapper to the builder
   * @param paramsToUrlMapper The paramsToUrlMapper which is mapping the params to a url
   * @return {EndpointBuilder} The builder itself
   */
  withParamsToUrlMapper(paramsToUrlMapper: MapParamsToUrlType<P>): EndpointBuilder<P, T> {
    this.paramsToUrlMapper = paramsToUrlMapper
    return this
  }

  withParamsToBodyMapper(paramsToBodyMapper: MapParamsToBodyType<P> | null | undefined): EndpointBuilder<P, T> {
    this.paramsToBodyMapper = paramsToBodyMapper
    return this
  }

  /**
   * Adds a json mapper to the builder
   * @param mapper The mapper which maps json from our cms to models
   * @return {EndpointBuilder} The builder itself
   */
  withMapper(mapper: MapResponseType<P, T>): EndpointBuilder<P, T> {
    this.mapper = mapper
    return this
  }

  /**
   * Overrides value from the API response. Useful for testing.
   * @param responseOverride {*} The response
   * @return {EndpointBuilder} The builder itself
   */
  withResponseOverride(responseOverride: T): EndpointBuilder<P, T> {
    this.responseOverride = responseOverride
    return this
  }

  /**
   * Fetcher throws an error. Useful for testing.
   * @param errorOverride {*} The error
   * @return {EndpointBuilder} The builder itself
   */
  withErrorOverride(errorOverride: Error): EndpointBuilder<P, T> {
    this.errorOverride = errorOverride
    return this
  }

  /**
   * Checks the data and builds the endpoint
   * @return {Endpoint} The final endpoint
   */
  build(): Endpoint<P, T> {
    if (!this.name) {
      throw Error('You have to set a name to build an endpoint!')
    }

    if (!this.paramsToUrlMapper) {
      throw Error('You have to set a url mapper to build an endpoint!')
    }

    if (!this.mapper) {
      throw Error('You have to set a mapper to build an endpoint!')
    }

    return new Endpoint<P, T>(
      this.name,
      this.paramsToUrlMapper,
      this.paramsToBodyMapper,
      this.mapper,
      this.responseOverride,
      this.errorOverride
    )
  }
}

export default EndpointBuilder
