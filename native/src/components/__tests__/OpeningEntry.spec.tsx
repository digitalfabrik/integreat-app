import { userEvent } from '@testing-library/react-native'
import React from 'react'

import { OpeningHoursModel } from 'shared/api'

import renderWithTheme from '../../testing/render'
import OpeningEntry from '../OpeningEntry'

jest.mock('react-i18next')

jest.useFakeTimers() // fixes a console warning because userEvents can take a long time, not actually necessary

describe('OpeningEntry', () => {
  const timeSlots = [
    { end: '18:00', start: '13:00', timezone: 'Europe/Berlin' },
    { end: '12:00', start: '08:00', timezone: 'Europe/Berlin' },
  ]
  const currentWeekday = 'Monday'
  const renderOpeningEntries = (allDay: boolean, closed: boolean, isCurrentDay: boolean, appointmentOnly: boolean) =>
    renderWithTheme(
      <OpeningEntry
        weekday={currentWeekday}
        isCurrentDay={isCurrentDay}
        language='de'
        appointmentUrl={null}
        openingHours={new OpeningHoursModel({ allDay, closed, timeSlots, appointmentOnly })}
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
    expect(getByText('allDay')).toBeTruthy()
    expect(queryByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeFalsy()
    expect(queryByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeFalsy()
    expect(queryByText('pois:closed')).toBeFalsy()
  })

  it('should display closed for the weekday if closed flag is true', () => {
    const { getByText, queryByText } = renderOpeningEntries(false, true, false, false)
    expect(getByText('closed')).toBeTruthy()
    expect(queryByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)).toBeFalsy()
    expect(queryByText(`${timeSlots[1]!.start}-${timeSlots[1]!.end}`)).toBeFalsy()
    expect(queryByText('pois:allDay')).toBeFalsy()
  })

  it('should highlight the timeslot of the current weekday bold', () => {
    const expectedStyle = { fontFamily: 'NotoSans-Bold' }
    const { getByText } = renderOpeningEntries(false, false, true, false)
    const timeSlotLabel = getByText(currentWeekday)
    const timeSlot = getByText(`${timeSlots[0]!.start}-${timeSlots[0]!.end}`)
    expect(timeSlotLabel).toBeTruthy()
    expect(timeSlot).toBeTruthy()
    expect(timeSlotLabel).toHaveStyle(expectedStyle)
    expect(timeSlot).toHaveStyle(expectedStyle)
  })

  it('should show that the location is only open with an appointment and toggle the overlay', async () => {
    const user = userEvent.setup()
    const { getByLabelText, getByText, queryByText } = renderOpeningEntries(false, false, false, true)
    const appointmentOnlyIcon = getByLabelText('appointmentNecessary')
    expect(appointmentOnlyIcon).toBeDefined()
    expect(queryByText('pois:makeAppointmentTooltipWithLink')).toBeNull()

    await user.press(appointmentOnlyIcon)
    expect(queryByText('pois:makeAppointmentTooltipWithLink')).toBeDefined()

    await user.press(getByText('common:close'))
    expect(queryByText('pois:makeAppointmentTooltipWithLink')).toBeNull()
  })
})
