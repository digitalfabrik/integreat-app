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
): Record<string, MarkedDateType> => {
  const markedDateStyling = {
    color: theme.colors.themeColor,
    textColor: theme.colors.textColor,
  }

  const markedDates: Record<string, MarkedDateType> = {}

  const cutoffStartDate = DateTime.now().minus({ years: 2 })
  const cutoffEndDate = DateTime.now().plus({ years: 2 })

  if (!startDate || startDate < cutoffStartDate || (endDate !== null && endDate > cutoffEndDate)) {
    return {}
  }
  const safeEndDate = endDate ?? startDate
  let currentDate = startDate
  while (currentDate <= safeEndDate) {
    markedDates[currentDate.toISODate()] = {
      selected: true,
      startingDay: startDate.equals(currentDate),
      endingDay: endDate?.equals(currentDate),
      ...markedDateStyling,
    }
    currentDate = currentDate.plus({ days: 1 })
  }

  return markedDates
}
