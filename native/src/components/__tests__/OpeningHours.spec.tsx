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
      />,
    )
  it('should display that the location is temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, null)
    expect(getByText('temporarilyClosed')).toBeTruthy()
  })
  it('should display that the location is opened', () => {
    const openingHours = Array.from(
      { length: 7 },
      () => new OpeningHoursModel({ allDay: false, closed: false, timeSlots: [{ end: '18:00', start: '08:00' }] }),
    )
    const { getByText } = renderOpeningHours(true, false, openingHours)
    expect(getByText('opened')).toBeTruthy()
  })
})
