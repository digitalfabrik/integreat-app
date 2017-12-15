class StoreResponse {
  /**
   * @return {Promise} The promise which will be resolved in the by the store (more specifically by redux-thunk)
   */
  _promise,
  /**
   * @type {boolean} Whether the correct data is available and ready for the fetcher to be displayed.
   */
  _data_available

  constructor (data_available, promise = Promise.resolve()) {
    this._promise = promise
    this._data_available = data_available
  }
}

export default StoreResponse
