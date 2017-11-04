/**
 * Builds a function which maps the state to an object
 */
class StateMapperBuilder {
  _stateMapper
  _endpointBuilder

  /**
   * This function maps as state to an object
   * @function stateMapper
   * @param {object} state
   * @return {object} An object with transformed information from the state
   */

  /**
   * Creates a new endpoint builder
   * @param endpointBuilder The endpoint builder
   */
  constructor (endpointBuilder) {
    this._endpointBuilder = endpointBuilder
    this._stateMapper = () => ({})
  }

  /**
   * Uses the function passed
   * @param {stateMapper} stateMapper The state mapper
   */
  fromFunction (stateMapper) {
    if (!stateMapper) {
      throw new Error('The state mapper can not be null!')
    }
    this._stateMapper = stateMapper
    return this._endpointBuilder
  }

  fromArray (array, reducer = (state, element) => state[element]) {
    this._stateMapper = (state) => array.reduce((accumulator, currentValue) => {
      accumulator[currentValue] = reducer(state, currentValue)
      return accumulator
    }, {})
    return this._endpointBuilder
  }

  /**
   * Builds the state mapper
   * @return {stateMapper} The state mapper
   */
  build () {
    return this._stateMapper
  }
}

export default StateMapperBuilder
