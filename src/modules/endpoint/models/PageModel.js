// @flow

import DateModel from './DateModel'
import LocationModel from './LocationModel'
import moment from 'moment'

class EventModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _thumbnail: ?string
  _location: ?LocationModel
  _date: ?DateModel
  _excerpt: string
  _order: ?number
  _parentPath: ?string
  _availableLanguages: Map<string, string>
  _lastUpdate: moment

  constructor ({id, path, title, content, parent, thumbnail, date, location, excerpt, lastUpdate, availableLanguages,
    order}: {|id: number, path: string, title: string, content: string, thumbnail: ?string, date: ?DateModel,
    parent: ?string, location: ?LocationModel, excerpt: string, order?: number, lastUpdate: moment,
    availableLanguages: Map<string, string>|}) {
    this._id = id
    this._path = path
    this._title = title
    this._content = content
    this._thumbnail = thumbnail
    this._date = date
    this._location = location
    this._excerpt = excerpt
    this._order = order
    this._lastUpdate = lastUpdate
    this._availableLanguages = availableLanguages
  }

  get id (): number {
    return this._id
  }

  get path (): string {
    return this._path
  }

  get parentPath (): ?string {
    return this._parentPath
  }

  get title (): string {
    return this._title
  }

  get thumbnail (): ?string {
    return this._thumbnail
  }

  get content (): string {
    return this._content
  }

  get date (): ?DateModel {
    return this._date
  }

  get location (): ?LocationModel {
    return this._location
  }

  get excerpt (): string {
    return this._excerpt
  }

  get order (): ?number {
    return this._order
  }

  get lastUpdate (): moment {
    return this._lastUpdate
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default EventModel
