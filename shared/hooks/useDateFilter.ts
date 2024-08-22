import { DateTime } from 'luxon'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

import { EventModel } from 'shared/api'

type UseDateFilterReturn = {
  fromDate: string
  setFromDate: Dispatch<SetStateAction<string>>
  toDate: string
  setToDate: Dispatch<SetStateAction<string>>
  filteredEvents: EventModel[]
  fromDateError: string | null
  toDateError: string | null
}

const useDateFilter = (events: EventModel[] | null): UseDateFilterReturn => {
  const [fromDate, setFromDate] = useState<string>(DateTime.local().toFormat('yyyy-MM-dd').toLocaleString())
  const [toDate, setToDate] = useState<string>(
    DateTime.local().plus({ day: 10 }).toFormat('yyyy-MM-dd').toLocaleString(),
  )
  const [filteredEvents, setFilteredEvents] = useState<EventModel[]>([])
  const [fromDateError, setFromDateError] = useState<string | null>(null)
  const [toDateError, setToDateError] = useState<string | null>(null)

  useEffect(() => {
    const isValidDateFormat = (date: string) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      return dateRegex.test(date)
    }
    const filterByDateRange = (from: string, to: string) => {
      setToDateError('')
      setFromDateError('')

      if (!isValidDateFormat(from)) {
        setFromDateError('Invalid from date format')
        return []
      }

      if (!isValidDateFormat(to)) {
        setToDateError('Invalid to date format')
        return []
      }
      const fromDateTime = DateTime.fromISO(from)
      const toDateTime = DateTime.fromISO(to).endOf('day')

      if (fromDateTime > toDateTime) {
        setFromDateError('from date should be earlier than to date')
        return []
      }
      return (
        events?.filter(
          event =>
            DateTime.fromISO(event.date.startDate) >= fromDateTime &&
            DateTime.fromISO(event.date.endDate) <= toDateTime,
        ) || []
      )
    }

    setFilteredEvents(filterByDateRange(fromDate, toDate))
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
