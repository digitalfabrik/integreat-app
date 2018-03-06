// @flow

import moment from 'moment'

type eventModel = {
  id: boolean,
  title: string,
  content: string,
  thumbnail: string,
  availableLanguages: any,
  content: string,
  town: string,
  address: string,
  startDate: moment,
  endDate: moment,
  allDay: boolean,
  excerpt: string
}

class EventModel {
  _id: boolean
  _title: string
  _content: string
  _thumbnail: string
  _availableLanguages: any
  _content: string
  _town: string
  _address: string
  _startDate: moment
  _endDate: moment
  _allDay: boolean
  _excerpt: string

  constructor (eventModel: eventModel) {
    this._id = eventModel.id
    this._title = eventModel.title
    this._content = eventModel.content
    this._thumbnail = eventModel.thumbnail
    this._address = eventModel.address
    this._town = eventModel.town
    this._startDate = eventModel.startDate
    this._endDate = eventModel.endDate
    this._allDay = eventModel.allDay
    this._excerpt = eventModel.excerpt
    this._availableLanguages = eventModel.availableLanguages
  }

  get id (): boolean {
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

  get address (): ?string {
    if (this._address && this._town) {
      return `${this._address}, ${this._town}`
    } else if (this._address) {
      return this._address
    } else if (this._town) {
      return this._town
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

  get availableLanguages (): any {
    return this._availableLanguages
  }
}

export default EventModel
