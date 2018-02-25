import { isEqual } from 'lodash/lang'

import Endpoint from './Endpoint'

/**
 * Helper class to build a {@link Endpoint}
 */
class EndpointBuilder {
  _name
  _stateToUrlMapper
  _mapper
  _responseOverride
  _refetchLogic

  /**
   * Creates a new endpoint builder
   * @param {string} name The name of the endpoint to build
   */
  constructor (name) {
    this._name = name

    this._refetchLogic = (state, nextState) => !isEqual(state, nextState)
  }

  /**
   * Adds a state to url mapper to the builder
   * @param stateToUrlMapper The stateToUrlMapper which is mapping the state to a url
   * @return {EndpointBuilder} The builder itself
   */
  withStateToUrlMapper (stateToUrlMapper) {
    this._stateToUrlMapper = stateToUrlMapper
    return this
  }

  /**
   * Adds a json mapper to the builder
   * @param mapper The mapper which maps json from our cms to models
   * @return {EndpointBuilder} The builder itself
   */
  withMapper (mapper) {
    this._mapper = mapper
    return this
  }

  /**
   * Adds refetch logic to this builder
   * @param refetchLogic The refetch logic which specifies when to refetch
   * @return {EndpointBuilder} The builder itself
   */
  withRefetchLogic (refetchLogic) {
    this._refetchLogic = refetchLogic
    return this
  }

  /**
   * Overrides value from the API response. Useful for testing.
   * @param responseOverride {*} The response
   * @return {EndpointBuilder} The builder itself
   */
  withResponseOverride (responseOverride) {
    this._responseOverride = responseOverride
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

    if (!this._stateToUrlMapper) {
      throw Error('You have to set a url mapper to build an endpoint!')
    }

    if (!this._mapper) {
      throw Error('You have to set a mapper to build an endpoint!')
    }

    if (!this._refetchLogic) {
      throw Error('You have to set a refetch logic to build an endpoint!')
    }

    return new Endpoint(this._name, this._stateToUrlMapper, this._mapper, this._refetchLogic, this._responseOverride)
  }
}

export default EndpointBuilder
