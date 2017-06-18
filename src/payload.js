export default class {
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

  hasError () {
    return !!this.error
  }

  get error () {
    return this._error
  }
}
