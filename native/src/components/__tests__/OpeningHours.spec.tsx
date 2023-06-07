import React from 'react'

import { OpeningHoursModel } from 'api-client/src'
import OpenHoursModel from 'api-client/src/models/OpeningHoursModel'

import renderWithTheme from '../../testing/render'
import OpeningHours from '../OpeningHours'

jest.mock('react-i18next')

describe('OpeningHoursSpec', () => {
  const renderOpeningHours = (
    isCurrentlyOpen: boolean,
    isTemporarilyClosed: boolean,
    openingHours: OpeningHoursModel[] | null = null
  ) =>
    renderWithTheme(
      <OpeningHours
        isCurrentlyOpen={isCurrentlyOpen}
        isTemporarilyClosed={isTemporarilyClosed}
        openingHours={openingHours}
        language='de'
      />
    )
  it('should display that the location is temporarily closed', () => {
    const { getByText } = renderOpeningHours(false, true, null)
    expect(getByText('openingHoursTemporarilyClosed')).toBeTruthy()
  })
  it('should display that the location is opened', () => {
    const { getByText } = renderOpeningHours(true, false, [
      new OpenHoursModel({ allDay: false, closed: false, timeSlots: [{ end: '18:00', start: '08:00' }] }),
    ])
    expect(getByText('openingHoursOpened')).toBeTruthy()
  })
})
