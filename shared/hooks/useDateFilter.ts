import { DateTime } from 'luxon'
import { useState, useEffect } from 'react'

import { EventModel } from 'shared/api'

type UseDateFilterReturn = {
  fromDate: DateTime | null
  setFromDate: (fromDate: DateTime | null) => void
  toDate: DateTime | null
  setToDate: (toDate: DateTime | null) => void
  filteredEvents: EventModel[]
  fromDateError: string | null
  toDateError: string | null
}

const useDateFilter = (events: EventModel[] | null, translation: (key: string) => string): UseDateFilterReturn => {
  const [fromDate, setFromDate] = useState<DateTime | null>(DateTime.local())
  const [toDate, setToDate] = useState<DateTime | null>(DateTime.local().plus({ day: 10 }))
  const [filteredEvents, setFilteredEvents] = useState<EventModel[]>([])
  const [fromDateError, setFromDateError] = useState<string | null>(null)
  const [toDateError, setToDateError] = useState<string | null>(null)
  useEffect(() => {
    const filterByDateRange = (from: DateTime | null, to: DateTime | null) => {
      setToDateError('')
      setFromDateError('')

      if (!from) {
        setFromDateError(translation('invalidFromDate'))
        return []
      }
      if (!to) {
        setToDateError(translation('invalidToDate'))
        return []
      }

      const fromDateTime = from
      const toDateTime = to.endOf('day')

      if (fromDateTime > toDateTime) {
        setFromDateError(translation('shouldBeEarlier'))
        return []
      }
      return events?.filter(event => event.date.startDate >= fromDateTime && event.date.endDate <= toDateTime) || []
    }

    setFilteredEvents(filterByDateRange(fromDate, toDate))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, events])

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    filteredEvents,
    fromDateError,
    toDateError,
  }
}

export default useDateFilter
