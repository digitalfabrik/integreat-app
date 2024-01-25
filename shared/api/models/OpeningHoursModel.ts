import { TimeSlot } from '../types'

class OpeningHoursModel {
  _allDay: boolean
  _closed: boolean
  _timeSlots: TimeSlot[]

  constructor({ allDay, closed, timeSlots }: { allDay: boolean; closed: boolean; timeSlots: TimeSlot[] }) {
    this._allDay = allDay
    this._closed = closed
    this._timeSlots = timeSlots
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
}

export default OpeningHoursModel
