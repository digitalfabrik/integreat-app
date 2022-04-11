import React from 'react'

import { CityModelBuilder } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { LocationInformationType } from '../../hooks/useUserLocation'
import render from '../../testing/render'
import CitySelector from '../CitySelector'

jest.mock('react-i18next')

describe('CitySelector', () => {
  const locationInformation: LocationInformationType = {
    status: 'unavailable',
    message: 'timeout',
    coordinates: null,
    requestAndDetermineLocation: jest.fn()
  }
  const props = {
    cities: new CityModelBuilder(3).build(),
    filterText: '',
    navigateToDashboard: jest.fn(),
    theme: buildConfig().lightTheme,
    locationInformation,
    t: jest.fn()
  }
  it('should show nothing found if there are no search results', () => {
    const { getByText } = render(<CitySelector {...props} filterText='invalid query' />)

    expect(getByText('search:nothingFound')).toBeTruthy()
  })
})
