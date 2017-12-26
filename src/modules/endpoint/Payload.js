import isUrl from 'is-url'

/**
 * The payload gets stored in the redux store and holds the information about a etch
 */
class Payload {
  /**
   * Creates a new Payload. You can only supply either data or error. The url has to be valid.
   *
   * @param isFetching {boolean} Whether we're currently fetching from requestUrl
   * @param data {object|null} The data which has been fetched or null
   * @param error {string|null} The error message which has occurred or null
   * @param requestUrl {string|null} The url from which to fetch or null if we're not sure yet
   * @param fetchDate {number|null} The date when the last fetch has been started
   * @throws {Error} If you supply data and error or the url is invalid.
   */
  constructor (isFetching, data = null, error = null, requestUrl = null, fetchDate = null) {
    this._isFetching = isFetching
    this._fetchDate = fetchDate
    this._error = error
    this._requestUrl = requestUrl
    this._data = data

    if (requestUrl !== null && !isUrl(requestUrl)) {
      throw new Error('requestUrl must be a valid URL')
    }

    if (error && data) {
      throw new Error('data and error can not be set at the same time')
    }
  }

  /**
   * @return {number} The date the fetch was initiated as serializable number
   */
  get fetchDate () {
    return this._fetchDate
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
   * @return {string} The error message if the fetch failed or null
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
