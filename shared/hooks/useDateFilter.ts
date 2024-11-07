import { DateTime } from 'luxon'
import { useState, useMemo } from 'react'

import EventModel from '../api/models/EventModel'
import filteringEventsLogic from '../utils/filteringEventsLogic'

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
  const isStartAfterEnd = startDate && endDate && startDate > endDate
  const startDateError = isStartAfterEnd ? 'shouldBeEarlier' : null

  const filteredEvents = useMemo(() => filteringEventsLogic(events, startDate, endDate), [startDate, endDate, events])

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
