import { isEqual } from 'lodash/lang'

import Endpoint from './Endpoint'
import StateMapperBuilder from './StateMapperBuilder'

/**
 * Helper class to build a {@link Endpoint}
 */
class EndpointBuilder {
  _name
  _url
  _mapper
  _stateMapperBuilder
  _refetchLogic

  /**
   * Creates a new endpoint builder
   * @param {string} name The name of the endpoint to build
   */
  constructor (name) {
    this._name = name
    this._stateMapperBuilder = new StateMapperBuilder(this)

    this._refetchLogic = (urlParams, nextUrlParams) => !isEqual(urlParams, nextUrlParams)
  }

  /**
   * Adds a url to the builder
   * @param url The url
   * @return {EndpointBuilder} The builder itself
   */
  withUrl (url) {
    this._url = url
    return this
  }

  /**
   * Adds a url to the builder
   * @param mapper The mapper
   * @return {EndpointBuilder} The builder itself
   */
  withMapper (mapper) {
    this._mapper = mapper
    return this
  }

  /**
   * Adds a state mapper builder to this builder
   * @return {StateMapperBuilder} The state mapper of this builder
   */
  withStateMapper () {
    return this._stateMapperBuilder
  }

  /**
   * Adds refetch logic to this builder
   * @param refetchLogic The refetch logic
   * @return {EndpointBuilder}  The builder itself
   */
  withRefetchLogic (refetchLogic) {
    this._refetchLogic = refetchLogic
    return this
  }

  /**
   * Checks the data and builds the endpoint
   * @return {Endpoint} The final endpoint
   */
  build () {
    if (!this._name) {
      throw Error('You have to set a name to build an endpoint!')
    }

    if (!this._url) {
      throw Error('You have to set a url to build an endpoint!')
    }

    if (!this._mapper) {
      throw Error('You have to set a mapper to build an endpoint!')
    }

    if (!this._url) {
      throw Error('You have to set a url to build an endpoint!')
    }

    if (!this._stateMapperBuilder) {
      throw Error('You have to set a state mapper to build an endpoint!')
    }

    if (!this._refetchLogic) {
      throw Error('You have to set a refetch logic to build an endpoint!')
    }

    return new Endpoint(this._name, this._url, this._mapper, this._stateMapperBuilder.build(), this._refetchLogic)
  }
}

export default EndpointBuilder
