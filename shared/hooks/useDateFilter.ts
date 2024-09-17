import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import { EventModel } from 'shared/api'

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

    const endDateTime = endDate?.endOf('day')

    return (
      events
        .filter(event => !endDateTime || event.date.startDate <= endDateTime)
        .filter(event => !startDate || event.date.endDate >= startDate) || []
    )
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
