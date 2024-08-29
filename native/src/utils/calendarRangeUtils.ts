import { DateTime } from 'luxon'

import { lightColors } from 'build-configs/integreat/theme/colors'

type MarkedDateType = {
  selected: boolean
  startingDay?: boolean
  endingDay?: boolean
}

export const getMarkedDates = (
  startDate: DateTime | null,
  endDate: DateTime | null,
): Record<string, MarkedDateType> => {
  const markedDateStyling = {
    color: lightColors.themeColor,
    textColor: lightColors.textColor,
  }

  const markedDates: Record<string, MarkedDateType> = {}

  const cutoffDate = DateTime.fromISO('2020-01-01')

  const validStartDate = startDate && startDate >= cutoffDate ? startDate : null

  const validEndDate = endDate && endDate >= cutoffDate ? endDate : null

  if (validStartDate) {
    const startDateString = validStartDate.toISODate()
    markedDates[startDateString] = {
      selected: true,
      startingDay: true,
      endingDay: startDateString === validEndDate?.toISODate(),
      ...markedDateStyling,
    }
  }

  if (validEndDate && (!validStartDate || validStartDate.toISODate() !== validEndDate.toISODate())) {
    const endDateString = validEndDate.toISODate()
    markedDates[endDateString] = {
      selected: true,
      endingDay: true,
      ...markedDateStyling,
    }
  }

  if (validStartDate && validEndDate && validStartDate < validEndDate) {
    let current = validStartDate.plus({ days: 1 })

    while (current < validEndDate) {
      const dateString = current.toISODate()
      markedDates[dateString] = {
        selected: true,
        ...markedDateStyling,
      }
      current = current.plus({ days: 1 })
    }
  }

  return markedDates
}
