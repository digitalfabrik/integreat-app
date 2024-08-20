import { TimeSlot } from '../types'

class OpeningHoursModel {
  _allDay: boolean
  _closed: boolean
  _timeSlots: TimeSlot[]
  _appointmentOnly: boolean

  constructor({
    allDay,
    closed,
    timeSlots,
    appointmentOnly,
  }: {
    allDay: boolean
    closed: boolean
    timeSlots: TimeSlot[]
    appointmentOnly: boolean
  }) {
    this._allDay = allDay
    this._closed = closed
    this._timeSlots = timeSlots
    this._appointmentOnly = appointmentOnly
  }

  get timeSlots(): TimeSlot[] {
    return this._timeSlots
  }

  get closed(): boolean {
    return this._closed
  }

  get allDay(): boolean {
    return this._allDay
  }

  get appointmentOnly(): boolean {
    return this._appointmentOnly
  }
}

export default OpeningHoursModel
