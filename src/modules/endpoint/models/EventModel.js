class EventModel {
  constructor ({id, title = '', content = '', thumbnail = '', address = '', town = '', startDate = undefined, endDate = undefined, allDay = false, excerpt = '', availableLanguages = []}) {
    this._id = id
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
    if (this._address && this._town) {
      return this._address + ', ' + this._town
    } else if (this._address) {
      return this._address
    } else if (this._town) {
      return this._town
    } else {
      return null
    }
  }

  get startDate () {
    return this._startDate
  }

  get endDate () {
    return this._endDate
  }

  get allDay () {
    return this._allDay
  }

  get excerpt () {
    return this._excerpt
  }

  get availableLanguages () {
    return this._availableLanguages
  }
}

export default EventModel
