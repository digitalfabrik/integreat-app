import { DateTime } from 'luxon'

import { DateModel } from '../api'

type FormattedEventDate = {
  date: string
  weekday: string | undefined
  time: string
}

const formatEventDate = (date: DateModel): FormattedEventDate[] => {
  const startDate = date.startDate.toLocaleString(DateTime.DATE_MED)
  const endDate = date.endDate.toLocaleString(DateTime.DATE_MED)
  const weekday = date.startDate.toLocaleString(DateTime.DATE_HUGE).split(',')[0] // Get the weekday from the full date string
  const time = `${date.startDate.toLocaleString(DateTime.TIME_SIMPLE)} - ${date.endDate.toLocaleString(DateTime.TIME_SIMPLE)}`

  return [
    {
      date: startDate === endDate ? startDate : `${startDate} - ${endDate}`,
      weekday,
      time,
    },
  ]
}

export default formatEventDate
