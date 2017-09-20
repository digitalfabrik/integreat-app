export default class DateModel {
  constructor ({ startDate, startTime = '00:00:00', endDate, endTime, allDay = false }) {
    this._startDate = startDate
    this._startTime = startTime
    this._endDate = endDate
    this._endTime = endTime
    this._allDay = allDay
  }

  get startDate () {
    return this._startDate
  }

  get startTime () {
    return this._startTime
  }

  get endDate () {
    return this._endDate
  }

  get endTime () {
    return this._endTime
  }

  get allDay () {
    return this._allDay
  }

  toString () {
    if (this.allDay) {
      if (this.endDate && this.endDate !== this.startDate) {
        return `Von ${this.startDate} bis ${this.endDate}`
      } else {
        return `Am ${this.startDate}`
      }
    } else {
      if (this.endDate && this.endDate !== this.startDate) {
        return `Von ${this.startDate} um ${this.startTime} bis ${this.endDate} um ${this.endTime}`
      } else if (this.endDate === this.startDate && this.endTime !== this.startTime) {
        return `Am ${this.startDate} von ${this.startTime} bis ${this.endTime}`
      } else if (this.startTime) {
        return `Am ${this.startDate} um ${this.startTime}`
      } else {
        return `Am ${this.startDate}`
      }
    }
  }
}
