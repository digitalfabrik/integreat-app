// @flow

import type { MapParamsToUrlType } from './MapParamsToUrlType'
import type { MapParamsToBodyType } from './MapParamsToBodyType'
import FeedbackEndpoint from './FeedbackEndpoint'

/**
 * Helper class to build a {@link FeedbackEndpoint}
 */
class EndpointBuilder<Params, BodyType> {
  _name: string
  _paramsToUrlMapper: MapParamsToUrlType<Params>
  _paramsToBodyMapper: MapParamsToBodyType<Params, BodyType>

  /**
   * Creates a new feedback endpoint builder
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
  withParamsToUrlMapper (paramsToUrlMapper: MapParamsToUrlType<Params>): EndpointBuilder<Params, BodyType> {
    this._paramsToUrlMapper = paramsToUrlMapper
    return this
  }

  /**
   * Adds a json mapper to the builder
   * @param paramsToBodyMapper The paramsToBodyMapper which is mapping the params to the body to post
   * @return {EndpointBuilder} The builder itself
   */
  withParamsToBodyMapper (paramsToBodyMapper: MapParamsToBodyType<Params, BodyType>): EndpointBuilder<Params, BodyType> {
    this._paramsToBodyMapper = paramsToBodyMapper
    return this
  }

  /**
   * Checks the data and builds the endpoint
   * @return {Endpoint} The final endpoint
   */
  build (): FeedbackEndpoint<Params, BodyType> {
    if (!this._name) {
      throw Error('You have to set a name to build an feedback endpoint!')
    }

    if (!this._paramsToUrlMapper) {
      throw Error('You have to set a url mapper to build an feedback endpoint!')
    }

    if (!this._paramsToBodyMapper) {
      throw Error('You have to set a body mapper to build an feedback endpoint!')
    }

    return new FeedbackEndpoint(this._name, this._paramsToUrlMapper, this._paramsToBodyMapper)
  }
}

export default EndpointBuilder
