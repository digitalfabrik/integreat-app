// @flow

import moment from 'moment'

class EventModel {
  _id: number
  _title: string
  _content: string
  _thumbnail: string
  _address: string
  _town: string
  _startDate: moment
  _endDate: moment
  _allDay: boolean
  _excerpt: string
  _availableLanguages: Map<string, string>

  constructor (obj: {id: number, title: string, content: string, thumbnail: string, address: string, town: string, startDate: moment, endDate: moment, allDay: boolean, excerpt: string, availableLanguages: Map<string, string>}) {
    this._id = obj.id
    this._title = obj.title
    this._content = obj.content
    this._thumbnail = obj.thumbnail
    this._address = obj.address
    this._town = obj.town
    this._startDate = obj.startDate
    this._endDate = obj.endDate
    this._allDay = obj.allDay
    this._excerpt = obj.excerpt
    this._availableLanguages = obj.availableLanguages
  }

  get id (): number {
    return this._id
  }

  get title (): string {
    return this._title
  }

  get thumbnail (): string {
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
