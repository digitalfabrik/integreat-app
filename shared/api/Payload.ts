class Payload<T extends object> {
  _isFetching: boolean
  _data: T | null
  _error: Error | null
  _requestUrl: string | null
  _fetchDate: number

  constructor(
    isFetching: boolean,
    requestUrl: string | null = null,
    data: T | null = null,
    error: Error | null = null,
    fetchDate: number = Date.now(),
  ) {
    this._isFetching = isFetching
    this._fetchDate = fetchDate
    this._error = error
    this._requestUrl = requestUrl
    this._data = data

    if (error && data !== null) {
      throw new Error('data and error can not be set at the same time')
    }
  }

  get fetchDate(): number {
    return this._fetchDate
  }

  get isFetching(): boolean {
    return this._isFetching
  }

  get data(): T | null {
    return this._data
  }

  get error(): Error | null {
    return this._error
  }

  get requestUrl(): string | null {
    return this._requestUrl
  }
}

export default Payload
