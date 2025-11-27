import { TimeSlot } from '../types'

class OpeningHoursModel {
  _openAllDay: boolean
  _closedAllDay: boolean
  _timeSlots: TimeSlot[]
  _appointmentOnly: boolean

  constructor({
    openAllDay,
    closedAllDay,
    timeSlots,
    appointmentOnly,
  }: {
    openAllDay: boolean
    closedAllDay: boolean
    timeSlots: TimeSlot[]
    appointmentOnly: boolean
  }) {
    this._openAllDay = openAllDay
    this._closedAllDay = closedAllDay
    this._timeSlots = timeSlots
    this._appointmentOnly = appointmentOnly
  }

  get timeSlots(): TimeSlot[] {
    return this._timeSlots
  }

  get closedAllDay(): boolean {
    return this._closedAllDay
  }

  get openAllDay(): boolean {
    return this._openAllDay
  }

  get appointmentOnly(): boolean {
    return this._appointmentOnly
  }
}

export default OpeningHoursModel
