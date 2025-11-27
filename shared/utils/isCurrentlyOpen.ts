import { DateTime, Interval } from 'luxon'

import { OpeningHoursModel } from '../api'

const isCurrentlyOpen = (openingHours: OpeningHoursModel[] | null): boolean => {
  if (!openingHours) {
    return false
  }

  const now = DateTime.now()
  // isoWeekday return 1-7 for the weekdays
  const currentWeekday = now.weekday - 1
  const currentDay = openingHours[currentWeekday]

  if (currentDay) {
    if (currentDay.openAllDay) {
      return true
    }

    return currentDay.timeSlots.some(timeslot => {
      const startTime = DateTime.fromFormat(timeslot.start, 'HH:mm')
      const endTime = DateTime.fromFormat(timeslot.end, 'HH:mm')
      return Interval.fromDateTimes(startTime, endTime).contains(now)
    })
  }
  return false
}

export default isCurrentlyOpen
