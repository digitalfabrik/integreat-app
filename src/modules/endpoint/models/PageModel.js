// @flow

import DateModel from './DateModel'
import LocationModel from './LocationModel'

class EventModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _thumbnail: ?string
  _location: LocationModel
  _date: DateModel
  _excerpt: string
  _availableLanguages: Map<string, string>

  constructor ({id, path, title, content, thumbnail, date, location, excerpt, availableLanguages}: {|id: number,
    path: string, title: string, content: string, thumbnail: ?string, date: DateModel, location: LocationModel,
    excerpt: string, availableLanguages: Map<string, string>|}) {
    this._id = id
    this._path = path
    this._title = title
    this._content = content
    this._thumbnail = thumbnail
    this._date = date
    this._location = location
    this._excerpt = excerpt
    this._availableLanguages = availableLanguages
  }

  get id (): number {
    return this._id
  }

  get path (): string {
    return this._path
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

  get date (): DateModel {
    return this._date
  }

  get location (): LocationModel {
    return this._location
  }

  get excerpt (): string {
    return this._excerpt
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default EventModel
