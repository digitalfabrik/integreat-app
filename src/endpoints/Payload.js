class Payload {
  constructor (isFetching, data = null, error = null, requestUrl = null) {
    this._isFetching = isFetching
    this._data = data
    this._error = error
    this._requestUrl = requestUrl
  }

  get isFetching () {
    return this._isFetching
  }

  get data () {
    return this._data
  }

  ready () {
    return !!this._data
  }

  get error () {
    return this._error
  }

  get requestUrl () {
    return this._requestUrl
  }
}

export default Payload
