import React from 'react'
import { openSettings, RESULTS } from 'react-native-permissions'
import { render, fireEvent } from '@testing-library/react-native'
import buildConfig from '../../../../modules/app/constants/buildConfig'
import Landing from '../Landing'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import Geolocation from '@react-native-community/geolocation'
import waitForExpect from 'wait-for-expect'
import { ThemeProvider } from 'styled-components/native'

let mockCheckLocationPermission
let mockRequestLocationPermission
jest.mock('../../../../modules/app/LocationPermissionManager', () => {
  const checkLocationPermission = jest.fn()
  const requestLocationPermission = jest.fn()
  mockCheckLocationPermission = checkLocationPermission
  mockRequestLocationPermission = requestLocationPermission
  return {
    checkLocationPermission,
    requestLocationPermission
  }
})
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('@react-native-community/geolocation')
describe('Landing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const clearResourcesAndCache = jest.fn()
  const navigateToDashboard = jest.fn()
  const language = 'de'
  const cities = new CityModelBuilder(6).build()
  const augsburgCoordinates = {
    coords: {
      latitude: 48.369696,
      longitude: 10.892578
    }
  }
  it('should only show non-live cities', () => {
    mockCheckLocationPermission.mockImplementationOnce(() => RESULTS.BLOCKED)
    const { getByText, queryByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Landing
          cities={cities}
          language={language}
          t={key => key}
          theme={buildConfig().lightTheme}
          navigateToDashboard={navigateToDashboard}
          clearResourcesAndCache={clearResourcesAndCache}
        />
      </ThemeProvider>
    )
    expect(getByText('Stadt Augsburg')).toBeTruthy()
    expect(getByText('City')).toBeTruthy()
    expect(getByText('Other city')).toBeTruthy()
    expect(getByText('Yet another city')).toBeTruthy()
    expect(queryByText('Notlive')).toBeFalsy()
    expect(queryByText('Oldtown')).toBeFalsy()
  })
  describe('nearby locations', () => {
    it('should not request location permission on mount', async () => {
      mockCheckLocationPermission.mockImplementationOnce(() => RESULTS.BLOCKED)
      const { getByText } = render(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Landing
            cities={cities}
            language={language}
            t={key => key}
            theme={buildConfig().lightTheme}
            navigateToDashboard={navigateToDashboard}
            clearResourcesAndCache={clearResourcesAndCache}
          />
        </ThemeProvider>
      )
      await waitForExpect(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalled()
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(openSettings).not.toHaveBeenCalled()
      expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled()
    })
    it('should determine location and show nearby locations on mount if permission already granted', async () => {
      mockCheckLocationPermission.mockImplementationOnce(() => RESULTS.GRANTED)
      // @ts-ignore
      Geolocation.getCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
      const { queryByText, queryAllByText } = render(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Landing
            cities={cities}
            language={language}
            t={key => key}
            theme={buildConfig().lightTheme}
            navigateToDashboard={navigateToDashboard}
            clearResourcesAndCache={clearResourcesAndCache}
          />
        </ThemeProvider>
      )
      await waitForExpect(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(2))
      expect(queryByText('noPermission')).toBeFalsy()
      expect(mockCheckLocationPermission).toHaveBeenCalled()
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(openSettings).not.toHaveBeenCalled()
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    })
    it('should determine location and show no nearby locations if there are none', async () => {
      mockCheckLocationPermission.mockImplementationOnce(() => RESULTS.GRANTED)
      // @ts-ignore
      Geolocation.getCurrentPosition.mockImplementationOnce(setPosition =>
        setPosition({
          coords: {
            longitude: 0,
            latitude: 0
          }
        })
      )
      const { queryByText, queryAllByText, getByText } = render(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Landing
            cities={cities}
            language={language}
            t={key => key}
            theme={buildConfig().lightTheme}
            navigateToDashboard={navigateToDashboard}
            clearResourcesAndCache={clearResourcesAndCache}
          />
        </ThemeProvider>
      )
      await waitForExpect(() => expect(getByText('noNearbyPlaces')).toBeTruthy())
      expect(queryAllByText('Stadt Augsburg')).toHaveLength(1)
      expect(queryByText('noPermission')).toBeFalsy()
      expect(mockCheckLocationPermission).toHaveBeenCalled()
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(openSettings).not.toHaveBeenCalled()
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
    })
    it('should open settings if permission is blocked on retry clicked', async () => {
      mockCheckLocationPermission.mockImplementation(() => RESULTS.BLOCKED)
      const { getByText, getByA11yLabel } = render(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Landing
            cities={cities}
            language={language}
            t={key => key}
            theme={buildConfig().lightTheme}
            navigateToDashboard={navigateToDashboard}
            clearResourcesAndCache={clearResourcesAndCache}
          />
        </ThemeProvider>
      )
      await waitForExpect(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
      expect(openSettings).not.toHaveBeenCalled()
      const retryDetermineLocationButton = getByA11yLabel('refresh')
      fireEvent.press(retryDetermineLocationButton)
      expect(getByText('loading')).toBeTruthy()
      await waitForExpect(() => expect(getByText('noPermission')).toBeTruthy())
      await waitForExpect(() => expect(openSettings).toHaveBeenCalled())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled()
    })
    it('should determine location if permission is granted on retry click', async () => {
      mockCheckLocationPermission.mockImplementationOnce(() => RESULTS.BLOCKED)
      // @ts-ignore
      Geolocation.getCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
      const { queryAllByText, getByText, getByA11yLabel } = render(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Landing
            cities={cities}
            language={language}
            t={key => key}
            theme={buildConfig().lightTheme}
            navigateToDashboard={navigateToDashboard}
            clearResourcesAndCache={clearResourcesAndCache}
          />
        </ThemeProvider>
      )
      await waitForExpect(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
      await waitForExpect(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(1))
      mockCheckLocationPermission.mockImplementationOnce(() => RESULTS.GRANTED)
      const retryDetermineLocationButton = getByA11yLabel('refresh')
      fireEvent.press(retryDetermineLocationButton)
      expect(getByText('loading')).toBeTruthy()
      await waitForExpect(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(2))
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
      expect(mockRequestLocationPermission).not.toHaveBeenCalled()
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
      expect(openSettings).not.toHaveBeenCalled()
    })
    it('should request permission and determine location on retry if not granted yet', async () => {
      mockCheckLocationPermission.mockImplementation(() => RESULTS.DENIED)
      mockRequestLocationPermission.mockImplementation(() => RESULTS.GRANTED)
      // @ts-ignore
      Geolocation.getCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
      const { queryAllByText, getByText, getByA11yLabel } = render(
        <ThemeProvider theme={buildConfig().lightTheme}>
          <Landing
            cities={cities}
            language={language}
            t={key => key}
            theme={buildConfig().lightTheme}
            navigateToDashboard={navigateToDashboard}
            clearResourcesAndCache={clearResourcesAndCache}
          />
        </ThemeProvider>
      )
      await waitForExpect(() => expect(getByText('noPermission')).toBeTruthy())
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
      await waitForExpect(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(1))
      const retryDetermineLocationButton = getByA11yLabel('refresh')
      fireEvent.press(retryDetermineLocationButton)
      expect(getByText('loading')).toBeTruthy()
      await waitForExpect(() => expect(queryAllByText('Stadt Augsburg')).toHaveLength(2))
      expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
      expect(mockRequestLocationPermission).toHaveBeenCalledTimes(1)
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
      expect(openSettings).not.toHaveBeenCalled()
    })
  })
})
