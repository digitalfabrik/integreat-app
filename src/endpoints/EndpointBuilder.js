import { isEqual } from 'lodash/lang'

import Endpoint from './Endpoint'
import StateMapperBuilder from './StateMapperBuilder'

class EndpointBuilder {
  _name
  _url
  _mapper
  _stateMapperBuilder
  _refetchLogic

  constructor (name) {
    this._name = name
    this._stateMapperBuilder = new StateMapperBuilder(this)

    this._refetchLogic = (options, nextOptions) => !isEqual(options, nextOptions)
  }

  withUrl (url) {
    this._url = url
    return this
  }

  withMapper (mapper) {
    this._mapper = mapper
    return this
  }

  withStateMapper () {
    return this._stateMapperBuilder
  }

  withRefetchLogic (refetchLogic) {
    this._refetchLogic = refetchLogic
    return this
  }

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
