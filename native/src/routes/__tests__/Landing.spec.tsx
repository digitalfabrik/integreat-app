import Geolocation from '@react-native-community/geolocation'
import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { openSettings, RESULTS } from 'react-native-permissions'

import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import buildConfig from '../../constants/buildConfig'
import render from '../../testing/render'
import { checkLocationPermission, requestLocationPermission } from '../../utils/LocationPermissionManager'
import Landing from '../Landing'

jest.mock('react-i18next')
jest.mock('styled-components')
jest.mock('react-native-system-setting', () => undefined)
jest.mock('../../utils/LocationPermissionManager', () => ({
  checkLocationPermission: jest.fn(),
  requestLocationPermission: jest.fn()
}))
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

jest.mock('@react-native-community/geolocation')

const mockCheckLocationPermission = mocked(checkLocationPermission)
const mockRequestLocationPermission = mocked(requestLocationPermission)
const mockGetCurrentPosition = mocked(Geolocation.getCurrentPosition)

describe('Landing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const clearResourcesAndCache = jest.fn()
  const navigateToDashboard = jest.fn()
  const navigateToCityNotCooperating = jest.fn()
  const language = 'de'
  const cities = new CityModelBuilder(6).build()
  const augsburgCoordinates = {
    coords: {
      latitude: 48.369696,
      longitude: 10.892578,
      altitude: null,
      accuracy: 1,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: 1234566789
  }
  const mockedBuildConfig = mocked(buildConfig)
  const mockBuildConfig = (cityNotCooperating: boolean) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      featureFlags: { ...previous.featureFlags, cityNotCooperating }
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

  it('should only show non-live cities', async () => {
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText, queryByText } = renderLanding()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(getByText('City')).toBeTruthy()
    expect(getByText('Other city')).toBeTruthy()
    expect(getByText('Yet another city')).toBeTruthy()
    expect(queryByText('Notlive')).toBeFalsy()
    expect(queryByText('Oldtown')).toBeFalsy()
  })

  it('should show footer if enabled', () => {
    mockBuildConfig(true)
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderLanding()
    expect(getByText('cityNotFound')).toBeTruthy()
    expect(getByText('clickHere')).toBeTruthy()
  })

  it('should not show footer if disabled', () => {
    mockBuildConfig(false)
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { queryByText } = renderLanding()
    expect(queryByText('cityNotFound')).toBeNull()
  })

  it('should navigate to cityNotCooperating page on button click', () => {
    mockBuildConfig(true)
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderLanding()
    const button = getByText('clickHere')
    fireEvent.press(button)
    expect(navigateToCityNotCooperating).toHaveBeenCalled()
  })

  describe('nearby locations', () => {
    it('should not request location permission on mount', async () => {
      mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
      const { getByText } = renderLanding()
      await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalled()
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(openSettings).not.toHaveBeenCalled()
      expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    })

    it('should determine location and show nearby locations on mount if permission already granted', async () => {
      mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
      mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
      const { queryByText, queryAllByText } = renderLanding()
      await waitFor(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(2))
      expect(queryByText('noPermission')).toBeFalsy()
      expect(mockCheckLocationPermission).toHaveBeenCalled()
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(openSettings).not.toHaveBeenCalled()
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    })

    it('should determine location and show no nearby locations if there are none', async () => {
      mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
      mockGetCurrentPosition.mockImplementationOnce(setPosition =>
        setPosition({
          ...augsburgCoordinates,
          coords: {
            ...augsburgCoordinates.coords,
            longitude: 0,
            latitude: 0
          }
        })
      )
      const { queryByText, queryAllByText, getByText } = renderLanding()
      await waitFor(() => expect(getByText('noNearbyCities')).toBeTruthy())
      expect(queryAllByText('Stadt Augsburg')).toHaveLength(1)
      expect(queryByText('noPermission')).toBeFalsy()
      expect(mockCheckLocationPermission).toHaveBeenCalled()
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(openSettings).not.toHaveBeenCalled()
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    })

    it('should open settings if permission is blocked on retry clicked', async () => {
      mockCheckLocationPermission.mockImplementation(async () => RESULTS.BLOCKED)
      const { getByText, getByA11yLabel } = renderLanding()
      await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
      expect(openSettings).not.toHaveBeenCalled()
      const retryDetermineLocationButton = getByA11yLabel('refresh')
      fireEvent.press(retryDetermineLocationButton)
      expect(getByText('loading')).toBeTruthy()
      await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
      await waitFor(() => expect(openSettings).toHaveBeenCalled())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
      expect(mockRequestLocationPermission).toHaveBeenCalled()
      expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    })

    it('should determine location if permission is granted on retry click', async () => {
      mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
      mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
      const { queryAllByText, getByText, getByA11yLabel } = renderLanding()
      await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(1))
      mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
      const retryDetermineLocationButton = getByA11yLabel('refresh')
      fireEvent.press(retryDetermineLocationButton)
      expect(getByText('loading')).toBeTruthy()
      await waitFor(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(2))
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
      expect(openSettings).not.toHaveBeenCalled()
    })

    it('should request permission and determine location on retry if not granted yet', async () => {
      mockCheckLocationPermission.mockImplementation(async () => RESULTS.DENIED)
      mockRequestLocationPermission.mockImplementation(async () => RESULTS.GRANTED)
      mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
      const { queryAllByText, getByText, getByA11yLabel } = renderLanding()
      await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(1))
      const retryDetermineLocationButton = getByA11yLabel('refresh')
      fireEvent.press(retryDetermineLocationButton)
      expect(getByText('loading')).toBeTruthy()
      await waitFor(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(2))
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
      expect(mockRequestLocationPermission).toHaveBeenCalledTimes(1)
      expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
      expect(openSettings).not.toHaveBeenCalled()
    })
  })
})
