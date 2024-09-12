import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import { EventModel } from 'shared/api'

type UseDateFilterReturn = {
  startDate: DateTime | null
  setStartDate: (startDate: DateTime | null) => void
  endDate: DateTime | null
  setEndDate: (endDate: DateTime | null) => void
  filteredEvents: EventModel[]
  startDateError: string | null
  endDateError: string | null
}

const useDateFilter = (events: EventModel[] | null, isClear: boolean): UseDateFilterReturn => {
  const [startDate, setStartDate] = useState<DateTime | null>(DateTime.now())
  const [endDate, setEndDate] = useState<DateTime | null>(DateTime.now().plus({ year: 1 }))
  const endDateError = endDate ? null : 'invalidEndDate'
  const isEarlierError = startDate && endDate && startDate > endDate ? 'shouldBeEarlier' : null
  const startDateError = startDate ? isEarlierError : 'invalidStartDate'

  const filteredEvents = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) {
      return []
    }

    const startDateTime = startDate
    const endDateTime = endDate.endOf('day')

    return isClear
      ? events || []
      : events?.filter(event => event.date.startDate <= endDateTime && event.date.endDate >= startDateTime) || []
  }, [startDate, endDate, isClear, events])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredEvents,
    startDateError,
    endDateError,
  }
}

export default useDateFilter
