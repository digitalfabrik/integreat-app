import { DateTime } from 'luxon'

import { EventModel } from '../api'
import { MAX_DATE_RECURRENCES } from '../constants'

const isWithinDateRange = (
  startDate: DateTime | null,
  endDate: DateTime | null,
  itemStartDate: DateTime,
  itemEndDate: DateTime,
): boolean => {
  const endDateTime = endDate?.endOf('day')
  return (!endDateTime || itemStartDate <= endDateTime) && (!startDate || itemEndDate >= startDate)
}

export const isEventWithinRange = (
  event: EventModel,
  startDate: DateTime | null,
  endDate: DateTime | null,
): boolean => {
  const isWithinRange = isWithinDateRange(startDate, endDate, event.date.startDate, event.date.endDate)

  if (event.date.recurrenceRule) {
    const recurrences = event.date.recurrences(MAX_DATE_RECURRENCES, startDate?.startOf('day'), endDate?.endOf('day'))
    const hasValidRecurrence = recurrences.some(recurrence =>
      isWithinDateRange(startDate, endDate, recurrence.startDate, recurrence.endDate),
    )
    return isWithinRange || hasValidRecurrence
  }

  return isWithinRange
}
