class StateMapperBuilder {
  _fn
  _endpointBuilder

  constructor (endpointBuilder) {
    this._endpointBuilder = endpointBuilder
    this._fn = () => ({})
  }

  fromFunction (fn) {
    this._fn = fn
    return this._endpointBuilder
  }

  fromArray (array, reducer = (state, element) => state[element]) {
    this._fn = (state) => array.reduce((accumulator, currentValue) => {
      accumulator[currentValue] = reducer(state, currentValue)
      return accumulator
    }, {})
    return this._endpointBuilder
  }

  build () {
    return this._fn
  }
}

export default StateMapperBuilder
