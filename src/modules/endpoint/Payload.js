// @flow

import isUrl from 'is-url'
import type { PayloadDataType } from '../../flowTypes'

/**
 * The payload gets stored in the redux store and holds the information about a fetch
 */
class Payload {
  _isFetching: boolean
  _data: ?PayloadDataType
  _error: ?Error
  _requestUrl: ?string
  _fetchDate: number

  constructor (isFetching: boolean, requestUrl: ?string = null, data: ?PayloadDataType = null, error: ?Error = null,
    fetchDate: number = new Date().getTime()) {
    this._isFetching = isFetching
    this._fetchDate = fetchDate
    this._error = error
    this._requestUrl = requestUrl
    this._data = data

    if (!requestUrl) {
      throw new Error('requestUrl must not be null')
    }

    if (!isUrl(requestUrl)) {
      throw new Error('requestUrl must not be null')
    }

    if (error && data) {
      throw new Error('data and error can not be set at the same time')
    }
  }

  get fetchDate (): number {
    return this._fetchDate
  }

  get isFetching (): boolean {
    return this._isFetching
  }

  get data (): ?PayloadDataType {
    return this._data
  }

  get error (): ?Error {
    return this._error
  }

  get requestUrl (): ?string {
    return this._requestUrl
  }
}

export default Payload
