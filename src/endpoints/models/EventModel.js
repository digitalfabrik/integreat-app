export default class EventModel {
  constructor ({ id, title = '', content = '', thumbnail = '', address = '', town = '', date = {} }) {
    this._id = id
    this._title = title
    this._content = content
    this._thumbnail = thumbnail
    this._address = address
    this._town = town
    this._date = date
  }

  get id () {
    return this._id
  }

  get title () {
    return this._title
  }

  get thumbnail () {
    return this._thumbnail
  }

  get content () {
    return this._content
  }

  get address () {
    return this._address + ', ' + this._town
  }

  getDate (locale) {
    return this._date.toLocaleString(locale)
  }
}
