import React from 'react'

import { OpeningHoursModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import OpeningHours from '../OpeningHours'

jest.mock('react-i18next')

describe('OpeningHours', () => {
  const renderOpeningHours = (
    isCurrentlyOpen: boolean,
    isTemporarilyClosed: boolean,
    openingHours: OpeningHoursModel[] | null = null,
    appointmentUrl: string | null = null,
  ) =>
    renderWithTheme(
      <OpeningHours
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={isTemporarilyClosed}
        openingHours={openingHours}
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

  const appointmentUrl = 'https://make.an/appointment'

  it('should display that the location is temporarily closed', () => {
    const { getByText, queryByText } = renderOpeningHours(false, true, null)
    expect(getByText('places:temporarilyClosed')).toBeTruthy()
    expect(queryByText('places:opened')).toBeFalsy()
    expect(queryByText('places:onlyWithAppointment')).toBeFalsy()
    expect(queryByText('places:makeAppointment')).toBeFalsy()
  })

  it('should display that the location is open', () => {
    const { getByText, queryByText, getAllByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('places:opened')).toBeTruthy()
    expect(getAllByText(openingHours[0]!.timeSlots[0]!.start, { exact: false })).toHaveLength(7)
    expect(getAllByText(openingHours[0]!.timeSlots[0]!.end, { exact: false })).toHaveLength(7)
    expect(queryByText('places:temporarilyClosed')).toBeFalsy()
    expect(queryByText('places:onlyWithAppointment')).toBeFalsy()
    expect(queryByText('places:makeAppointment')).toBeFalsy()
  })

  it('should display the link to make an appointment', () => {
    const { getByText } = renderOpeningHours(true, false, openingHours, appointmentUrl)
    expect(getByText('places:makeAppointment')).toBeTruthy()
  })

  it('should display the link to make an appointment without openingHours', () => {
    const { getByText, queryByText } = renderOpeningHours(true, false, null, appointmentUrl)
    expect(getByText('places:onlyWithAppointment')).toBeTruthy()
    expect(getByText('places:makeAppointment')).toBeTruthy()
    expect(queryByText('places:opened')).toBeFalsy()
    expect(queryByText('places:closed')).toBeFalsy()
  })

  it('should display the link to make an appointment if temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, openingHours, appointmentUrl)
    expect(getByText('places:makeAppointment')).toBeTruthy()
  })

  it('should not display anything', () => {
    const { queryByText } = renderOpeningHours(false, false, null)
    expect(queryByText('places:onlyWithAppointment')).toBeFalsy()
    expect(queryByText('places:makeAppointment')).toBeFalsy()
    expect(queryByText('places:opened')).toBeFalsy()
    expect(queryByText('places:closed')).toBeFalsy()
  })
})
