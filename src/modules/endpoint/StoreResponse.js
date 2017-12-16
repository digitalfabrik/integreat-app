class StoreResponse {
  _promise
  _dataAvailable

  constructor (dataAvailable, promise = Promise.resolve()) {
    this._promise = promise
    this._dataAvailable = dataAvailable
  }

  /**
   * @return {boolean} Whether the correct data is available and ready for the fetcher to be displayed.
   */
  get dataAvailable () {
    return this._dataAvailable
  }

  /**
   * @return {Promise} The promise which will be resolved in the by the store (more specifically by redux-thunk)
   */
  get promise () {
    return this._promise
  }
}

export default StoreResponse
