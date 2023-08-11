import React from 'react'

import { renderWithTheme } from '../../testing/render'
import OpeningEntry from '../OpeningEntry'

jest.mock('react-i18next')

describe('OpeningEntry', () => {
  const timeSlots = [
    { end: '18:00', start: '13:00' },
    { end: '12:00', start: '08:00' },
  ]
  const currentWeekday = 'Monday'
  const renderOpeningEntries = (allDay: boolean, closed: boolean, isCurrentDay: boolean) =>
    renderWithTheme(
      <OpeningEntry
        weekday={currentWeekday}
        allDay={allDay}
        closed={closed}
        timeSlots={timeSlots}
        isCurrentDay={isCurrentDay}
      />
    )
  it('should display the timeslots of a weekday', () => {
    const { getByText } = renderOpeningEntries(false, false, false)
    expect(getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeTruthy()
    expect(getByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeTruthy()
  })

  it('should display all day opened for the weekday if allDay flag is true', () => {
    const { getByText } = renderOpeningEntries(true, false, false)
    expect(getByText('pois:allDay')).toBeTruthy()
  })

  it('should display closed for the weekday if closed flag is true', () => {
    const { getByText } = renderOpeningEntries(false, true, false)
    expect(getByText('pois:closed')).toBeTruthy()
  })

  it('should highlight the timeslot of the current weekday bold', () => {
    const { getByText } = renderOpeningEntries(false, false, true)
    const currentDayContainer = document.getElementById(`openingEntryContainer-${currentWeekday}`)
    const containerStyle = window.getComputedStyle(currentDayContainer!)
    expect(getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeTruthy()
    expect(containerStyle.fontWeight).toBe('600')
  })
})
