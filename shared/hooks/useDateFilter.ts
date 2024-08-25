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

const useDateFilter = (events: EventModel[] | null, translation: (key: string) => string): UseDateFilterReturn => {
  const [fromDate, setFromDate] = useState<string>(DateTime.local().toFormat('yyyy-MM-dd').toLocaleString())
  const [toDate, setToDate] = useState<string>(
    DateTime.local().plus({ day: 10 }).toFormat('yyyy-MM-dd').toLocaleString(),
  )
  const [filteredEvents, setFilteredEvents] = useState<EventModel[]>([])
  const [fromDateError, setFromDateError] = useState<string | null>(null)
  const [toDateError, setToDateError] = useState<string | null>(null)

  const months = 12
  const days = 31
  useEffect(() => {
    const isValidDateFormat = (date: string) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      return dateRegex.test(date)
    }
    const filterByDateRange = (from: string, to: string) => {
      setToDateError('')
      setFromDateError('')
      const splitFrom = from.split('-')
      const splitTo = to.split('-')

      if (!isValidDateFormat(from)) {
        setFromDateError(translation('invalid_from_date'))
        return []
      }
      if (!isValidDateFormat(to)) {
        setToDateError(translation('invalid_to_date'))
        return []
      }
      if (Number(splitFrom[1]) < 1 || Number(splitFrom[1]) > months) {
        setFromDateError(translation('invalid_from_date'))
        return []
      }
      if (Number(splitFrom[2]) < 1 || Number(splitFrom[2]) > days) {
        setFromDateError(translation('invalid_from_date'))
        return []
      }
      if (Number(splitTo[1]) < 1 || Number(splitTo[1]) > months) {
        setToDateError(translation('invalid_to_date'))
        return []
      }
      if (Number(splitTo[2]) < 1 || Number(splitTo[2]) > days) {
        setToDateError(translation('invalid_to_date'))
        return []
      }

      const fromDateTime = DateTime.fromISO(from)
      const toDateTime = DateTime.fromISO(to).endOf('day')

      if (fromDateTime > toDateTime) {
        setFromDateError(translation('should_be_earlier'))
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
