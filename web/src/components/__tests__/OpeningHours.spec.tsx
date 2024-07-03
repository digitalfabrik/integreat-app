import React from 'react'

import { OpeningHoursModel } from 'shared/api'
import OpenHoursModel from 'shared/api/models/OpeningHoursModel'

import { renderWithTheme } from '../../testing/render'
import OpeningHours from '../OpeningHours'

jest.mock('react-inlinesvg')
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
        link={null}
      />,
    )
  it('should display that the location is temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, null)
    expect(getByText('pois:temporarilyClosed')).toBeTruthy()
  })

  it('should display that the location is open', () => {
    const openingHours = Array.from(
      { length: 7 },
      () =>
        new OpenHoursModel({
          allDay: false,
          closed: false,
          timeSlots: [{ end: '18:00', start: '08:00' }],
          appointmentOnly: false,
        }),
    )
    const { getByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('pois:opened')).toBeTruthy()
  })

  it('should display that the location is only open with an appointment', () => {
    // TODO
  })
})
