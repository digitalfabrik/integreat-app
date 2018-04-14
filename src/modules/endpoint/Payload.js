// @flow

import isUrl from 'is-url'
import type { PayloadData } from '../../flowTypes'

/**
 * The payload gets stored in the redux store and holds the information about a fetch
 */
class Payload {
  _isFetching: boolean
  _data: ?PayloadData
  _error: ?Error
  _requestUrl: ?string
  _fetchDate: number

  constructor (isFetching: boolean, requestUrl: ?string = null, data: ?PayloadData = null, error: ?Error = null,
    fetchDate: number = new Date().getTime()) {
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

  get fetchDate (): number {
    return this._fetchDate
  }

  get isFetching (): boolean {
    return this._isFetching
  }

  get data (): ?PayloadData {
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
