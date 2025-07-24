import React from 'react'

import { OpeningHoursModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import OpeningHours from '../OpeningHours'

jest.mock('react-inlinesvg')
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
        appointmentOverlayLink={appointmentUrl}
      />,
    )

  const openingHours = Array.from(
    { length: 7 },
    () =>
      new OpeningHoursModel({
        allDay: false,
        closed: false,
        timeSlots: [{ end: '18:00', start: '08:00' }],
        appointmentOnly: false,
      }),
  )

  const appointmentUrl = 'https://make.an/appointment'

  it('should display that the location is temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, null)
    expect(getByText('pois:temporarilyClosed')).toBeTruthy()
  })

  it('should display that the location is open', () => {
    const { getByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('pois:opened')).toBeTruthy()
  })

  it('should display the link to make an appointment', () => {
    const { getByText } = renderOpeningHours(true, false, openingHours, appointmentUrl)
    expect(getByText('pois:makeAppointment')).toBeTruthy()
  })

  it('should display the link to make an appointment without openingHours', () => {
    const { getByText } = renderOpeningHours(true, false, null, appointmentUrl)
    expect(getByText('pois:onlyWithAppointment')).toBeTruthy()
    expect(getByText('pois:makeAppointment')).toBeTruthy()
  })

  it('should display the link to make an appointment if temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, openingHours, appointmentUrl)
    expect(getByText('pois:makeAppointment')).toBeTruthy()
  })
})
