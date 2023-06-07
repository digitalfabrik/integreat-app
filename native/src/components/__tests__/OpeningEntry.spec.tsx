import React from 'react'

import renderWithTheme from '../../testing/render'
import OpeningEntry from '../OpeningEntry'

jest.mock('react-i18next')

describe('OpeningEntrySpec', () => {
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
        language='de'
      />
    )
  it('should display the timeslots of a weekday', () => {
    const { getByText } = renderOpeningEntries(false, false, false)
    expect(getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeTruthy()
    expect(getByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeTruthy()
  })

  it('should display all day opened for the weekday if allDay flag is true', () => {
    const { getByText } = renderOpeningEntries(true, false, false)
    expect(getByText('openingHoursAllDay')).toBeTruthy()
  })

  it('should display closed for the weekday if closed flag is true', () => {
    const { getByText } = renderOpeningEntries(false, true, false)
    expect(getByText('openingHoursClosed')).toBeTruthy()
  })

  it('should highlight the timeslot of the current weekday bold', () => {
    const expectedStyle = [{ fontFamily: 'NotoSans-Bold' }]
    const { getByText } = renderOpeningEntries(false, false, true)
    const timeSlotLabel = getByText(currentWeekday)
    const timeSlot = getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)
    expect(timeSlotLabel).toBeTruthy()
    expect(timeSlot).toBeTruthy()
    expect(timeSlotLabel.props.style).toEqual(expectedStyle)
    expect(timeSlot.props.style).toEqual(expectedStyle)
  })
})
