import Endpoint from './Endpoint'

class EndpointBuilder {
  _name
  _url
  _mapper
  _stateMapper
  _refetchLogic

  constructor (name) {
    this._name = name
    this._stateMapper = (state) => ({
      language: state.router.params.language,
      location: state.router.params.location
    })

    this._refetchLogic = (options, nextOptions) => options.language !== nextOptions.language
  }

  withUrl (url) {
    this._url = url
    return this
  }

  withMapper (mapper) {
    this._mapper = mapper
    return this
  }

  withStateMapper (stateMapper) {
    this._stateMapper = stateMapper
    return this
  }

  withRefetchLogic (refetchLogic) {
    this._refetchLogic = refetchLogic
    return this
  }

  build () {
    return new Endpoint(this._name, this._url, this._mapper, this._stateMapper, this._refetchLogic)
  }
}

export default EndpointBuilder

export const endpoint = (name) => new EndpointBuilder(name)
