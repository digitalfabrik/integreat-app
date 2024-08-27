type MarkedDateType = {
  selected: boolean
  startingDay?: boolean
  endingDay?: boolean
}

export const getMarkedDates = (startDate: string, endDate: string): Record<string, MarkedDateType> => {
  const markedDateStyling = {
    color: '#FBDA16',
    textColor: '#000',
  }

  const markedDates: Record<string, MarkedDateType> = {}

  if (startDate) {
    markedDates[startDate] = {
      selected: true,
      startingDay: true,
      endingDay: startDate === endDate,
      ...markedDateStyling,
    }
  }

  if (endDate && startDate !== endDate) {
    markedDates[endDate] = {
      selected: true,
      endingDay: true,
      ...markedDateStyling,
    }
  }

  if (startDate && endDate && startDate !== endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    while (start <= end) {
      const dateString = start.toISOString().split('T')[0]
      if (dateString !== startDate && dateString !== endDate) {
        markedDates[dateString || 0] = {
          selected: true,
          ...markedDateStyling,
        }
      }
      start.setDate(start.getDate() + 1)
    }
  }

  return markedDates
}
