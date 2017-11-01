/**
 * The payload gets stored in the redux store and holds the information about a etch
 */
class Payload {
  constructor (isFetching, data = null, error = null, requestUrl = null) {
    this._isFetching = isFetching
    this._data = data
    this._error = error
    this._requestUrl = requestUrl
  }

  /**
   * @return {boolean} If a fetch is going on
   */
  get isFetching () {
    return this._isFetching
  }

  /**
   * @return {*} The data which has been fetched or null
   */
  get data () {
    return this._data
  }

  /**
   * @return {boolean} If the {@link data} is ready to be used
   */
  ready () {
    return !!this._data
  }

  /**
   * @return {string} The error message if the fetch failed
   */
  get error () {
    return this._error
  }

  /**
   * @return {string} The url which was used to initiate the fetch
   */
  get requestUrl () {
    return this._requestUrl
  }
}

export default Payload
