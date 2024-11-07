import { DateTime } from 'luxon'

import { ThemeType } from 'build-configs'

type MarkedDateType = {
  selected: boolean
  startingDay?: boolean
  endingDay?: boolean
}

export const getMarkedDates = (
  startDate: DateTime | null,
  endDate: DateTime | null,
  theme: ThemeType,
  currentInput: string,
): Record<string, MarkedDateType> => {
  const markedDateStyling = {
    color: theme.colors.themeColor,
    textColor: theme.colors.textColor,
  }

  const markedDates: Record<string, MarkedDateType> = {}

  const cutoffStartDate = DateTime.now().minus({ years: 2 })
  const cutoffEndDate = DateTime.now().plus({ years: 2 })

  if (!startDate || startDate < cutoffStartDate || (endDate && endDate > cutoffEndDate)) {
    return {}
  }

  if (currentInput === 'to' && endDate === null) {
    markedDates[startDate.toISODate()] = {
      selected: true,
      startingDay: false,
      endingDay: true,
      ...markedDateStyling,
    }
  } else if (currentInput === 'from' && endDate === null) {
    markedDates[startDate.toISODate()] = {
      selected: true,
      startingDay: true,
      endingDay: false,
      ...markedDateStyling,
    }
  } else {
    let runningDate = startDate
    const safeEndDate = endDate ?? startDate
    while (runningDate <= safeEndDate) {
      markedDates[runningDate.toISODate()] = {
        selected: true,
        startingDay: startDate.equals(runningDate),
        endingDay: safeEndDate.equals(runningDate),
        ...markedDateStyling,
      }
      runningDate = runningDate.plus({ days: 1 })
    }
  }

  return markedDates
}
