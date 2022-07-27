import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import buildConfig from '../../constants/buildConfig'
import render from '../../testing/render'
import Landing from '../Landing'

jest.mock('../../components/NearbyCities', () => {
  const { Text } = require('react-native')
  return () => <Text>NearbyCities</Text>
})
jest.mock('react-i18next')
jest.mock('styled-components')

describe('Landing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const clearResourcesAndCache = jest.fn()
  const navigateToDashboard = jest.fn()
  const navigateToCityNotCooperating = jest.fn()
  const language = 'de'
  const cities = new CityModelBuilder(6).build()

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
      <Landing
        cities={cities}
        language={language}
        navigateToDashboard={navigateToDashboard}
        navigateToCityNotCooperating={navigateToCityNotCooperating}
        clearResourcesAndCache={clearResourcesAndCache}
      />
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
    expect(navigateToCityNotCooperating).toHaveBeenCalled()
  })
})
