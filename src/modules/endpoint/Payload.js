// @flow

import isUrl from 'is-url'
import LanguageModel from './models/LanguageModel'
import CategoriesMapModel from './models/CategoriesMapModel'
import ExtraModel from './models/ExtraModel'
import SprungbrettModel from './models/SprungbrettJobModel'
import CityModel from './models/CityModel'
import DisclaimerModel from './models/DisclaimerModel'
import EventModel from './models/EventModel'

export type PayloadData = Array<CityModel | LanguageModel | EventModel | ExtraModel | SprungbrettModel> |
  CategoriesMapModel | DisclaimerModel | null

/**
 * The payload gets stored in the redux store and holds the information about a fetch
 */
class Payload {
  _isFetching: boolean
  _data: PayloadData
  _error: ?Error
  _requestUrl: string | null
  _fetchDate: number

  constructor (isFetching: boolean, requestUrl: string | null = null, data: PayloadData = null, error: ?Error = null,
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

  get data (): PayloadData {
    return this._data
  }

  get error (): ?Error {
    return this._error
  }

  get requestUrl (): string | null {
    return this._requestUrl
  }
}

export default Payload
