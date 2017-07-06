export default class Payload {
  constructor (isFetching, data = null, error = null) {
    this._isFetching = isFetching
    this._data = data
    this._error = error
  }

  get isFetching () {
    return this._isFetching
  }

  get data () {
    return this._data
  }

  get error () {
    return this._error
  }
}
