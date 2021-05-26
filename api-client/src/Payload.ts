/**
 * The payload gets stored in the redux store and holds the information about a fetch
 */
class Payload<T> {
  _isFetching: boolean
  _data: T | null | undefined
  _error: Error | null | undefined
  _requestUrl: string | null | undefined
  _fetchDate: number

  constructor(
    isFetching: boolean,
    requestUrl: string | null | undefined = null,
    data: T | null | undefined = null,
    error: Error | null | undefined = null,
    fetchDate: number = Date.now()
  ) {
    this._isFetching = isFetching
    this._fetchDate = fetchDate
    this._error = error
    this._requestUrl = requestUrl
    this._data = data

    if (error && data) {
      throw new Error('data and error can not be set at the same time')
    }
  }

  get fetchDate(): number {
    return this._fetchDate
  }

  get isFetching(): boolean {
    return this._isFetching
  }

  get data(): T | null | undefined {
    return this._data
  }

  get error(): Error | null | undefined {
    return this._error
  }

  get requestUrl(): string | null | undefined {
    return this._requestUrl
  }
}

export default Payload
