import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { SUGGEST_TO_REGION_ROUTE, LandingRouteType } from 'shared'
import RegionModelBuilder from 'shared/api/endpoints/testing/RegionModelBuilder'

import buildConfig from '../../constants/buildConfig'
import useLoadRegions from '../../hooks/useLoadRegions'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import Landing from '../Landing'

jest.mock('../../components/NearbyRegions', () => {
  const { Text } = require('react-native-paper')
  return () => <Text>NearbyRegions</Text>
})
jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('../../hooks/useLoadRegions')

describe('Landing', () => {
  const { mocked } = jest
  const regions = new RegionModelBuilder(6).build()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useLoadRegions).mockImplementation(() => ({
      data: regions,
      error: null,
      refresh: jest.fn(),
      loading: false,
      setData: jest.fn(),
    }))
  })

  const navigation = createNavigationScreenPropMock<LandingRouteType>()

  const mockedBuildConfig = mocked(buildConfig)
  const mockBuildConfig = (suggestToRegion: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: {
        ...previous.featureFlags,
        suggestToRegion: suggestToRegion ? { template: 'test', icon: 'icon.svg' } : null,
      },
    }))
  }

  const renderLanding = (): RenderAPI => render(<Landing navigation={navigation} />)

  it('should show live regions', () => {
    const { getByText, queryByText } = renderLanding()

    expect(getByText('NearbyRegions')).toBeTruthy()

    expect(getByText('Stadt Augsburg')).toBeTruthy()
    expect(getByText('Region')).toBeTruthy()
    expect(getByText('Other region')).toBeTruthy()
    expect(getByText('Yet another region')).toBeTruthy()

    expect(queryByText('Notlive')).toBeFalsy()
    expect(queryByText('Oldtown')).toBeFalsy()
  })

  it('should show footer if enabled', () => {
    mockBuildConfig(true)
    const { getByText } = renderLanding()
    expect(getByText('regionNotFound')).toBeTruthy()
    expect(getByText('suggestToRegion')).toBeTruthy()
  })

  it('should not show footer if disabled', () => {
    mockBuildConfig(false)
    const { queryByText } = renderLanding()
    expect(queryByText('regionNotFound')).toBeNull()
  })

  it('should navigate to suggestToRegion page on button click', () => {
    mockBuildConfig(true)
    const { getByText } = renderLanding()
    const button = getByText('suggestToRegion')
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(SUGGEST_TO_REGION_ROUTE)
  })
})
