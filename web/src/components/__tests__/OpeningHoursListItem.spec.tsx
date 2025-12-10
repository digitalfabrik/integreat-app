import React from 'react'

import { OpeningHoursModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import OpeningHoursListItem from '../OpeningHoursListItem'

jest.mock('react-i18next')

describe('OpeningHoursListItem', () => {
  const timeSlots = [
    { end: '18:00', start: '13:00' },
    { end: '12:00', start: '08:00' },
  ]
  const currentWeekday = 'Monday'
  const renderOpeningEntries = (
    openAllDay: boolean,
    closedAllDay: boolean,
    isCurrentDay: boolean,
    appointmentOnly: boolean,
  ) =>
    renderWithTheme(
      <OpeningHoursListItem
        weekday={currentWeekday}
        isCurrentDay={isCurrentDay}
        appointmentUrl={null}
        openingHours={new OpeningHoursModel({ openAllDay, closedAllDay, timeSlots, appointmentOnly })}
      />,
    )
  it('should display the timeslots of a weekday', () => {
    const { getByText, queryByText } = renderOpeningEntries(false, false, false, false)
    expect(getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeTruthy()
    expect(getByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeTruthy()
    expect(queryByText('pois:allDay')).toBeFalsy()
    expect(queryByText('pois:closed')).toBeFalsy()
  })

  it('should display all day opened for the weekday if allDay flag is true', () => {
    const { getByText, queryByText } = renderOpeningEntries(true, false, false, false)
    expect(getByText('pois:allDay')).toBeTruthy()
    expect(queryByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeFalsy()
    expect(queryByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeFalsy()
    expect(queryByText('pois:closed')).toBeFalsy()
  })

  it('should display closed for the weekday if closed flag is true', () => {
    const { getByText, queryByText } = renderOpeningEntries(false, true, false, false)
    expect(getByText('pois:closed')).toBeTruthy()
    expect(queryByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeFalsy()
    expect(queryByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeFalsy()
    expect(queryByText('pois:allDay')).toBeFalsy()
  })

  it('should highlight the timeslot of the current weekday bold', () => {
    const { getByText } = renderOpeningEntries(false, false, true, false)
    const currentDayContainer = getByText(currentWeekday)
    const containerStyle = window.getComputedStyle(currentDayContainer!)
    expect(getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeTruthy()
    expect(containerStyle.fontWeight).toBe('700')
  })
})
