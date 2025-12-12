import React from 'react'

import { OpeningHoursModel } from 'shared/api'

import renderWithTheme from '../../testing/render'
import OpeningHours from '../OpeningHours'

jest.mock('react-i18next')

describe('OpeningHours', () => {
  const renderOpeningHours = (
    isCurrentlyOpen: boolean,
    isTemporarilyClosed: boolean,
    openingHours: OpeningHoursModel[] | null = null,
  ) =>
    renderWithTheme(
      <OpeningHours
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={isTemporarilyClosed}
        openingHours={openingHours}
        language='de'
        appointmentUrl='https://make.an/appointment'
      />,
    )
  const openingHours = Array.from(
    { length: 7 },
    () =>
      new OpeningHoursModel({
        allDay: false,
        closed: false,
        timeSlots: [{ end: '18:00', start: '08:00', timezone: 'Europe/Berlin' }],
        appointmentOnly: false,
      }),
  )

  it('should display that the location is temporarily closed', () => {
    const { getByText, queryByText } = renderOpeningHours(false, true, null)
    expect(getByText('temporarilyClosed')).toBeTruthy()
    expect(queryByText('pois:opened')).toBeFalsy()
    expect(queryByText('pois:onlyWithAppointment')).toBeFalsy()
    expect(queryByText('pois:makeAppointment')).toBeFalsy()
  })

  it('should display that the location is opened', () => {
    const { getByText, queryByText, getAllByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('opened')).toBeTruthy()
    expect(getAllByText(openingHours[0]!.timeSlots[0]!.start, { exact: false })).toHaveLength(7)
    expect(getAllByText(openingHours[0]!.timeSlots[0]!.end, { exact: false })).toHaveLength(7)
    expect(queryByText('pois:temporarilyClosed')).toBeFalsy()
    expect(queryByText('pois:onlyWithAppointment')).toBeFalsy()
    expect(queryByText('pois:makeAppointment')).toBeFalsy()
  })

  it('should display the link to make an appointment', () => {
    const { getByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('makeAppointment')).toBeTruthy()
  })

  it('should display the link to make an appointment without openingHours', () => {
    const { getByText, queryByText } = renderOpeningHours(true, false, null)
    expect(getByText('onlyWithAppointment')).toBeTruthy()
    expect(getByText('makeAppointment')).toBeTruthy()
    expect(queryByText('pois:opened')).toBeFalsy()
    expect(queryByText('pois:closed')).toBeFalsy()
  })

  it('should display the link to make an appointment if temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, openingHours)
    expect(getByText('makeAppointment')).toBeTruthy()
  })

  it('should not display anything', () => {
    const { queryByText } = renderOpeningHours(false, false, null)
    expect(queryByText('pois:onlyWithAppointment')).toBeFalsy()
    expect(queryByText('pois:makeAppointment')).toBeFalsy()
    expect(queryByText('pois:opened')).toBeFalsy()
    expect(queryByText('pois:closed')).toBeFalsy()
  })
})
