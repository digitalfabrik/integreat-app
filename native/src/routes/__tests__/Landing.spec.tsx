import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { CITY_NOT_COOPERATING_ROUTE, LandingRouteType } from 'api-client'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import buildConfig from '../../constants/buildConfig'
import useLoadCities from '../../hooks/useLoadCities'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Landing from '../Landing'

jest.mock('../../components/NearbyCities', () => {
  const { Text } = require('react-native')
  return () => <Text>NearbyCities</Text>
})
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('../../hooks/useLoadCities')

describe('Landing', () => {
  const cities = new CityModelBuilder(6).build()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useLoadCities).mockImplementation(() => ({ data: cities, error: null, refresh: jest.fn(), loading: false }))
  })

  const navigation = createNavigationScreenPropMock<LandingRouteType>()

  const mockedBuildConfig = mocked(buildConfig)
  const mockBuildConfig = (cityNotCooperating: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, cityNotCooperating },
    }))
  }

  const renderLanding = (): RenderAPI =>
    render(
      <NavigationContainer>
        <Landing navigation={navigation} />
      </NavigationContainer>
    )

  it('should show live cities', () => {
    const { getByText, queryByText } = renderLanding()

    expect(getByText('NearbyCities')).toBeTruthy()

    expect(getByText('Stadt Augsburg')).toBeTruthy()
    expect(getByText('City')).toBeTruthy()
    expect(getByText('Other city')).toBeTruthy()
    expect(getByText('Yet another city')).toBeTruthy()

    expect(queryByText('Notlive')).toBeFalsy()
    expect(queryByText('Oldtown')).toBeFalsy()
  })

  it('should show footer if enabled', () => {
    mockBuildConfig(true)
    const { getByText } = renderLanding()
    expect(getByText('cityNotFound')).toBeTruthy()
    expect(getByText('clickHere')).toBeTruthy()
  })

  it('should not show footer if disabled', () => {
    mockBuildConfig(false)
    const { queryByText } = renderLanding()
    expect(queryByText('cityNotFound')).toBeNull()
  })

  it('should navigate to cityNotCooperating page on button click', () => {
    mockBuildConfig(true)
    const { getByText } = renderLanding()
    const button = getByText('clickHere')
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(CITY_NOT_COOPERATING_ROUTE)
  })
})
