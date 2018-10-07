// @flow

import moment from 'moment'

class EventModel {
  _id: number
  _path: string
  _title: string
  _content: string
  _thumbnail: ?string
  _address: string
  _town: string
  _startDate: moment
  _endDate: moment
  _allDay: boolean
  _excerpt: string
  _availableLanguages: Map<string, string>

  constructor ({id, path, title, content, thumbnail, address, town, startDate, endDate, allDay, excerpt,
    availableLanguages}: {|id: number, title: string, content: string, thumbnail: ?string, address: string,
    town: string, startDate: moment, endDate: moment, allDay: boolean, excerpt: string,
    availableLanguages: Map<string, string>|}) {
    this._id = id
    this._path = path
    this._title = title
    this._content = content
    this._thumbnail = thumbnail
    this._address = address
    this._town = town
    this._startDate = startDate
    this._endDate = endDate
    this._allDay = allDay
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

  get address (): string {
    if (this._address && this._town) {
      return `${this._address}, ${this._town}`
    } else if (this._address) {
      return this._address
    } else if (this._town) {
      return this._town
    } else {
      return ''
    }
  }

  get startDate (): moment {
    return this._startDate
  }

  get endDate (): moment {
    return this._endDate
  }

  get allDay (): boolean {
    return this._allDay
  }

  get excerpt (): string {
    return this._excerpt
  }

  get availableLanguages (): Map<string, string> {
    return this._availableLanguages
  }
}

export default EventModel
