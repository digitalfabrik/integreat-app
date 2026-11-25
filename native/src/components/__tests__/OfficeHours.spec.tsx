import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { isCurrentlyOpen } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import renderWithTheme from '../../testing/render'
import OfficeHours from '../OfficeHours'

jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  isCurrentlyOpen: jest.fn(),
}))

describe('OfficeHours', () => {
  const officeHours = Array.from(
    { length: 7 },
    () =>
      new OpeningHoursModel({
        openAllDay: false,
        closedAllDay: false,
        timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
        appointmentOnly: false,
      }),
  )

  const renderOfficeHours = (hours: OpeningHoursModel[] | null = officeHours) =>
    renderWithTheme(<OfficeHours officeHours={hours} />)

  beforeEach(() => {
    jest.mocked(isCurrentlyOpen).mockReturnValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should display that the office is open', async () => {
    const { getByText, getAllByText, queryByText } = await renderOfficeHours()

    expect(getByText('places:hours.open')).toBeTruthy()
    expect(queryByText(officeHours[0]!.timeSlots[0]!.start, { exact: false })).toBeFalsy()

    await fireEvent.press(getByText('places:hours.open'))

    expect(getAllByText(officeHours[0]!.timeSlots[0]!.start, { exact: false })).toHaveLength(7)
    expect(getAllByText(officeHours[0]!.timeSlots[0]!.end, { exact: false })).toHaveLength(7)
  })

  it('should display that the office is closed', async () => {
    jest.mocked(isCurrentlyOpen).mockReturnValue(false)

    const { getByText } = await renderOfficeHours()

    expect(getByText('places:hours.closed')).toBeTruthy()
  })

  it('should display all day if the office is open all day', async () => {
    const allDayOfficeHours = Array.from(
      { length: 7 },
      () =>
        new OpeningHoursModel({
          openAllDay: true,
          closedAllDay: false,
          timeSlots: [],
          appointmentOnly: false,
        }),
    )

    const { getByText, queryByText } = await renderOfficeHours(allDayOfficeHours)

    expect(getByText('places:hours.allDay')).toBeTruthy()
    expect(queryByText('places:hours.open')).toBeFalsy()
  })

  it('should display temporarily closed if the office is closed all day', async () => {
    const closedOfficeHours = Array.from(
      { length: 7 },
      () =>
        new OpeningHoursModel({
          openAllDay: false,
          closedAllDay: true,
          timeSlots: [],
          appointmentOnly: false,
        }),
    )

    const { getByText, queryByText } = await renderOfficeHours(closedOfficeHours)

    expect(getByText('places:hours.temporarilyClosed')).toBeTruthy()
    expect(queryByText('places:hours.open')).toBeFalsy()
  })
})
