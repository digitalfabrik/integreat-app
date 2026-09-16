import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { OpeningHoursModel } from 'shared/api'

import renderWithTheme from '../../testing/render'
import OpeningHours from '../OpeningHours'

describe('OpeningHours', () => {
  const renderOpeningHours = (
    isCurrentlyOpen: boolean,
    isTemporarilyClosed: boolean,
    openingHours: OpeningHoursModel[] | null = null,
    appointmentUrl: string | null = 'https://make.an/appointment',
  ) =>
    renderWithTheme(
      <OpeningHours
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={isTemporarilyClosed}
        openingHours={openingHours}
        language='de'
        appointmentUrl={appointmentUrl}
      />,
    )
  const openingHours = Array.from(
    { length: 7 },
    () =>
      new OpeningHoursModel({
        openAllDay: false,
        closedAllDay: false,
        timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
        appointmentOnly: false,
      }),
  )

  it('should display that the location is temporarily closed', () => {
    const { getByText, queryByText } = renderOpeningHours(false, true, null, null)
    expect(getByText('places:hours.temporarilyClosed')).toBeTruthy()
    expect(queryByText('places:hours.open')).toBeFalsy()
    expect(queryByText('places:hours.appointment.required')).toBeFalsy()
    expect(queryByText('places:hours.appointment.make.title')).toBeFalsy()
  })

  it('should display that the location is opened', () => {
    const { getByText, queryByText, getAllByText } = renderOpeningHours(true, false, openingHours, null)
    expect(getByText('places:hours.open')).toBeTruthy()
    fireEvent.press(getByText('places:hours.title'))
    expect(getAllByText(openingHours[0]!.timeSlots[0]!.start, { exact: false })).toHaveLength(7)
    expect(getAllByText(openingHours[0]!.timeSlots[0]!.end, { exact: false })).toHaveLength(7)
    expect(queryByText('places:hours.temporarilyClosed')).toBeFalsy()
    expect(queryByText('places:hours.appointment.required')).toBeFalsy()
    expect(queryByText('places:hours.appointment.make.title')).toBeFalsy()
  })

  it('should display the link to make an appointment', () => {
    const { getByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('places:hours.appointment.make.title')).toBeTruthy()
  })

  it('should display the link to make an appointment without openingHours', () => {
    const { getByText, queryByText } = renderOpeningHours(true, false, null)
    expect(getByText('places:hours.appointment.required')).toBeTruthy()
    expect(getByText('places:hours.appointment.make.title')).toBeTruthy()
    expect(queryByText('places:hours.open')).toBeFalsy()
    expect(queryByText('places:hours.closed')).toBeFalsy()
  })

  it('should display the link to make an appointment if temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, openingHours)
    expect(getByText('places:hours.appointment.make.title')).toBeTruthy()
  })

  it('should not display anything', () => {
    const { queryByText } = renderOpeningHours(false, false, null, null)
    expect(queryByText('places:hours.appointment.required')).toBeFalsy()
    expect(queryByText('places:hours.appointment.make.title')).toBeFalsy()
    expect(queryByText('places:hours.open')).toBeFalsy()
    expect(queryByText('places:hours.closed')).toBeFalsy()
  })
})
