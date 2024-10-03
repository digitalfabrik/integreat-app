import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import { EventModel } from 'shared/api'

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

type UseDateFilterReturn = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  filteredEvents: EventModel[] | null
  startDateError: string | null
}

const useDateFilter = (events: EventModel[] | null): UseDateFilterReturn => {
  const [startDate, setStartDate] = useState<DateTime | null>(null)
  const [endDate, setEndDate] = useState<DateTime | null>(null)
  const startDateError = startDate && endDate && startDate > endDate ? 'shouldBeEarlier' : null

  const filteredEvents = useMemo(() => {
    if (!startDate && !endDate) {
      return events
    }

    const isStartAfterEnd = startDate && endDate && startDate > endDate
    if (!events || isStartAfterEnd) {
      return null
    }

    return events.filter(event => {
      const isWithinRange = isWithinDateRange(startDate, endDate, event.date.startDate, event.date.endDate)

      // If the event has a recurrence rule, check its recurrences as well
      if (event.date.recurrenceRule) {
        const recurrences = event.date.recurrences(MAX_DATE_RECURRENCES)

        // Check if at least one of the recurrences falls within the date range
        const hasValidRecurrence = recurrences.some(recurrence =>
          isWithinDateRange(startDate, endDate, recurrence.startDate, recurrence.endDate),
        )

        return isWithinRange || hasValidRecurrence
      }

      // If no recurrence rule, just return if the event itself is within the range
      return isWithinRange
    })
  }, [startDate, endDate, events])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredEvents,
    startDateError,
  }
}

export default useDateFilter
